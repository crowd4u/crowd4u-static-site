requirejs.config({
  paths: {
          "api": '//crowd4u.org/script/api'
         },
  waitSeconds: 30,
  shim: {
          "api": {
            deps: ['jquery-ui', 'jquery.form', 'xdr'],
            exports: "c4u"
          }
        }
});
require(["api"], function(c4u) {
  
  $c4u("head").append("<link>");
  var css = $c4u("head").children(":last");
  css.attr({
    rel: "stylesheet",
    type: "text/css",
  
    href: "//crowd4u.org/css/dialog.css?1708665394"
  
  });
  
});
