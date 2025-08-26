// プロジェクトページのプログレスバーの値を自動変更する
function getGRate(){
  $.ajax('/api/group_achievement_rate', {
    type: 'GET',
    dataType: 'json',
    cache: false,
    success: function(data){
      var items = document.getElementsByClassName('groupid');
      //var baritems = document.getElementsByClassName('progress-bar');
      var rateitems = document.getElementsByClassName('grate');
      var targetitems = document.getElementsByClassName('targetnum');

      for (var i = 0; i < items.length; i++) {
        //var vid = 'id' + i;
        var vid2 = 'iid' + i;
        var vid3 = 'iiid' + i;

        $.each(data, function(key, value) {
          if(key == items[i].textContent) {
              //id属性追加
              //baritems[i].setAttribute("id",vid);
              rateitems[i].setAttribute("id",vid2);
              targetitems[i].setAttribute("id",vid3);
              //var barWidth = 'width :' + value[0] + '%;' + ' color: black';
              //console.log(barWidth);
              //$('#'+ vid).attr({'aria-valuenow': value[0] , 'style': barWidth});
              $('#' + vid2).text(value[0] + '%');
              $('#' + vid3).text(value[1]);
            }
        });
      }
    }
  });
  setTimeout('getGRate()', 10000);
}

//実行
getGRate();
