var OPEN_TASK_BUTTON = 'a.microtask, input[type=submit].microtask';
var TASK_DIALOG = '.crowd4u';
var TASK_DIALOG_CONTENT = '#crowd4u-task-content';
var TASK_DIALOG_TITLE = '.ui-dialog-title';
var API_ROOT = "//crowd4u.org/";

var DEBUG = false;

var parameters = {
  "embed": 0,
  "requester": -2,
  "_ajax": 1
}


var currentOpenTaskButton;

var TaskDialog = {
  init: function() {
    var options = {
      autoOpen: false,
      width: 'min(550px, 100%)',
      height: 'auto',
      dialogClass: TASK_DIALOG.split('.')[1],
      closeText: '',
      show: 100,
      hide: 100
    }
    $c4u(TASK_DIALOG_CONTENT).dialog(options);
    // $c4u(TASK_DIALOG).css('position','fixed');
  },
  open: function() {
    this.clear();

    $c4u(TASK_DIALOG_TITLE).text('タスク取得中');
    $c4u(TASK_DIALOG_CONTENT).append(
      $c4u('<img src="' + '//' + API_ROOT + '/img/loading.gif' +'" width="48" height="auto" />')
    );
    $c4u(TASK_DIALOG_CONTENT).dialog('open');
  },
  close: function() {
    $c4u(TASK_DIALOG_CONTENT).dialog('close');
  },
  clear: function() {
    $c4u(TASK_DIALOG_CONTENT).empty();
    $c4u(TASK_DIALOG_TITLE).empty();
  },
  injectErroerContent: function() {
    this.clear();
    $c4u(TASK_DIALOG_TITLE).text('通信エラーが発生しました。');
    $c4u(TASK_DIALOG_CONTENT).append(
      $c4u('<p></p>')
    );
  },
  injectContent: function(task) {
    this.clear();
    $c4u(TASK_DIALOG_TITLE).html(task['message']);

    $c4u(TASK_DIALOG_CONTENT).append(
      $c4u('#crowd4u-content', task['task_view']).contents()
    );

    $c4u(TASK_DIALOG_CONTENT).append(
      "<script src='" + task['task_script_url'] + "'></script>"
    );

    $c4u('.ui-dialog-titlebar-close').blur()

    if(task["tweet_message"] !== 'undefined'){
      $c4u(TASK_DIALOG_CONTENT).append(task["tweet_message"]);
    }

    $c4u(TASK_DIALOG_CONTENT).append('<a href="" id="crowd4u-skip-button">&gt;&gt;&nbsp;skip</a>');
    $c4u(TASK_DIALOG_CONTENT).append('<a href="" id="crowd4u-deny-button">今後表示しない</a>');
    var fixed_top = window.innerHeight / 2 - $c4u(".crowd4u.ui-dialog").outerHeight() / 2;
    if(fixed_top < 0){
      fixed_top = 0;
    }
    $c4u(TASK_DIALOG_CONTENT).dialog("option", "position", {my: "center top", at: "center top+"+fixed_top, of: window, collision: "fit"});
  }
}

var WebAPI = {
  getNewTask: function() {
    return $c4u.ajax('//' + API_ROOT + '/task_assignment', {
      "type": 'GET',
      "xhrFields": { withCredentials: true },
      "crossDomain": true,
      "cache": false,
      "dataType": 'json',
      "data": parameters,
      "timeout": 10000
    }).done(function(data) {
      if(DEBUG) { console.log('WebAPI.getNewTask: success', data)} 
      TaskQueue.enqueue(data)
    }).fail(function() {
      if(DEBUG) { console.error('WebAPI.getNewTask: error')} 
    })
  },
  postExceptionalResult: function(actionUrl, actionType, callback) {
    return $c4u.ajax(actionUrl, {
      type: "POST",
      dataType: 'json',
      xhrFields: { withCredentials: true },
      crossDomain: true,
      cache: false,
      data: {
        action_type: actionType,
        requester: parameters.requester,
      },
      success: function(data){
        if(DEBUG) { console.log('WebAPI.postExceptionalResult: success', data)}
        TaskDialog.close()
        callback()
      },
      error: function() {
        if(DEBUG) { console.error('WebAPI.postExceptionalResult: error')}
        TaskDialog.close()
        if(actionType != 'close'){
          doOriginalProcess();
        }
      }
    })
  }
}

var TaskQueue = {
  queue: [],
  enqueue: function(task) {
    this.queue.push(task);
    return;
  },
  dequeue: function() {
    return this.queue.shift();
  },
  size: function() {
    return this.queue.length;
  },
  flush: function() {
    this.queue = [];
    return;
  }
}

var getNextTask = function(option) {
  var defer = $c4u.Deferred();
  var MAX_TASK_QUEUE_SIZE = 1;
  var taskQueueSize = TaskQueue.size()

  var doneCallback = function() {
    defer.resolve()
  }

  var failCallback = function() {
    defer.reject()
  }

  if(DEBUG) { console.log('TaskQueue.size', TaskQueue.size())} 

  if(taskQueueSize >= MAX_TASK_QUEUE_SIZE) {
    if(option.prefetch) {
      WebAPI.getNewTask()
    }
    return defer.resolve();
  } else {
    WebAPI.getNewTask()
      .done(doneCallback)
      .fail(failCallback)

    if(option.prefetch) {
      WebAPI.getNewTask()
    }
  }
  return defer.promise();
}

var popupTask = function(option) {
  if(DEBUG) { console.info('call popupTask')} 
  TaskDialog.open();
  getNextTask(option)
    .done(function() {
      if(DEBUG) { console.log('getNextTask: done')} 
      var nextTask = TaskQueue.dequeue();
      TaskDialog.injectContent(nextTask);

      var options = {
        url: $c4u("form.crowd4u").attr("action"),
        success: function(response){
          if(DEBUG) { console.log('WebAPI.postTaskResult: success')} 
          if(DEBUG) { console.log(response)} 
          return
        },
        error: function(a, b, c) {
          if(DEBUG) { console.log('WebAPI.postTaskResult: error')} 
          if(DEBUG) { console.log(a, b, c)} 
          return
        },
        dataType: 'json',
        clearForm: true,
        xhrFields: { withCredentials: true },
        crossDomain: true,
        data: parameters
      };

      $c4u("form.crowd4u").ajaxForm(options);

      $c4u('form.crowd4u').submit(function(event) {
        event.preventDefault();
          TaskDialog.close();
          if(option.repeat) {
            popupTask(option)
          } else {
            doOriginalProcess();
          }
      })

      $c4u('#crowd4u-skip-button').unbind().click(function(event) {
        event.preventDefault();
        if(DEBUG) { console.log($c4u("form.crowd4u").attr("action"))} 
        WebAPI.postExceptionalResult($c4u("form.crowd4u").attr("action"), 'skip', doOriginalProcess)
      })

      $c4u('#crowd4u-deny-button').unbind().click(function(event) {
        event.preventDefault();
        if(DEBUG) { console.log($c4u("form.crowd4u").attr("action"))} 
        WebAPI.postExceptionalResult($c4u("form.crowd4u").attr("action"), 'denied', doOriginalProcess)
      })

      $c4u('.crowd4u.change-button').unbind().click(function(event) {
          event.preventDefault();
          if(DEBUG) { console.log($c4u("form.crowd4u").attr("action"))}
          WebAPI.postExceptionalResult($c4u("form.crowd4u").attr("action"), 'change', function() { popupTask(option) })
      })

      $c4u('.crowd4u.ui-dialog .ui-dialog-titlebar-close').unbind().click(function(event) {
        event.preventDefault();
        TaskQueue.flush();
        if(DEBUG) { console.log($c4u("form.crowd4u").attr("action"))} 
        WebAPI.postExceptionalResult($c4u("form.crowd4u").attr("action"), 'close', function() {})
      })
    })
    .fail(function() {
      if(DEBUG) { console.error('fail')} 
      TaskDialog.injectErroerContent()
      doOriginalProcess();
    })
}

var doOriginalProcess = function() {
  var $button = $c4u(currentOpenTaskButton)
  if($button.prop("tagName") === 'A'){
    if(!$button.hasClass("specific")){
      location.href = $button.attr("href");
    }
  } else {
    $button.parents("form").submit();
  }
  return 0;
}

$c4u(document).ready(function() {
  TaskDialog.init();

  $c4u(OPEN_TASK_BUTTON).click(function(event) {
    if(DEBUG) { console.warn('OPEN_TASK_BUTTON was clicked');} 

    event.preventDefault();
    currentOpenTaskButton = this;

    var option = {
      repeat: $c4u(this).hasClass('repeat') || $c4u(this).hasClass('repeat-prefetch'),
      prefetch: $c4u(this).hasClass('repeat-prefetch')
    }

    if(/group([0-9]+)/.test($c4u(this).attr("class"))){
      parameters['group_id'] = RegExp.$1;
    }

    if(DEBUG) { console.log('option', option)} 
    popupTask(option);
  });
});