var url_path = window.location.href.split( '/' );
var imgs_hash = {HEART: 'heart_a.gif',
                 FIREWORK: 'firework.gif'}
var pre_act_number;

//
function getActNumber(){

  $.ajax({
    url: '/api/act_number',
    type: 'GET',
    dataType: 'json',
    cache: false,
  }).done(function(data){
      var act_number = data
      var data_1000sep = act_number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
      $('#actNumber').html(data_1000sep);
      $('#actNumber2').html(data_1000sep);

      //カウントアップ時処理
      if (pre_act_number != null && pre_act_number < act_number) {
        var keys = new Array();
        for(var key in imgs_hash){
          keys.push(key);
        }
        var key = keys[Math.floor(Math.random() * keys.length)];
        var img = imgs_hash[key];

        switch(key) {
          case 'HEART':
            $('#addActNumPanel').attr('style', 'height:200px; top: -135px; text-align: right;');
            $('#add_actNum').attr('src', '/img/' + img).attr('style', 'display:inline');
            break;

          case 'FIREWORK':
            $('#addActNumPanel').attr('style', 'height:300px; top: -335px; text-align: right;');
            var margin = 10 + Math.floor(Math.random() * 61);
            $('#add_actNum').attr('src', '/img/' + img)
              .attr('style', 'display:inline; margin-right:' + margin + '%;');
            break;
        }
      }
      pre_act_number = act_number;
    }).fail(function(data){
    });

  setTimeout('getActNumber()', 10000);
}


//
// //実行
if ($('#actNumber').length != 0 || $('#actNumber2').length != 0) {
  getActNumber();
}
