var userAgent = window.navigator.userAgent.toLowerCase();
if (crowd4u_task_loaded !== true){
  if (userAgent.indexOf('msie') === -1 || userAgent.indexOf('msie 8.') !== -1 || userAgent.indexOf('msie 9.') !== -1 || userAgent.indexOf('msie 10.') !== -1) {
    var crowd4u_task_loaded = true;
    document.open();
    require = {urlArgs: "requester=-2&length=10&_cache=1708665394"};
    document.write('<script type="text/javascript" src="//crowd4u.org/js/api/require-jquery.js" data-main="//crowd4u.org/js/api/include.js"></script>');
    document.write('<div id="crowd4u-task-content" title=""></div>')
    document.close();
  }
}
