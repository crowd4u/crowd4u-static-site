/*
function print(str){
  document.write(str + "<br />");
}


var d = new Date();
var offset = d.getTimezoneOffset();

//var getopt = {"-12.00":1, "-11.00":2, "-10.00":3, "-9.50":4, "-9.00":5, "-8.00":6, "-7.00":7, "-6.00":8, "-5.00":9, "-4.50":10, "-4.00":11, "-3.50":12, "-3.00":13, "-2.00":14, "-1.00":15, "0.00":16, "1.00":17, "2.00":18, "3.00":19, "3.50":20, "4.00":21, "4.50":22, "5.00":23, "5.50":24, "5.75":25, "6.00":26, "6.50":27, "7.00":28, "8.00":29, "8.50":30, "8.75":31, "9.00":32, "9.50":33, "10.00":34, "10.50":35, "11.00":36, "11.50":37, "12.00":38, "12.75":39, "13.00":40, "14.00":41};

var offset_hours = - parseFloat(offset) / 60.0;
//tz_key = (-1) * offset_hours.round(2);

var getopt = [-12, -11, -10, -9.5, -9, -8, -7, -6, -5, -4.5, -4, -3.5, -3, -2, -1, 0, 1, 2, 3, 3.5, 4, 4.5, 5, 5.5, 5.75, 6, 6.5, 7, 8, 8.5, 8.75, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.75, 13, 14];

var select_id = getopt.indexOf(offset_hours) + 1;

document.write("<p>");

print(offset);
print(offset_hours.toString());
//print(tz_key.toString());
print(getopt.indexOf(offset_hours));

print(d);
//print(d.toUTCString());
//print(d.getTimezoneOffset() + "分");

document.write("</p>");
*/

$(function(){

  var d = new Date();
  var offset = d.getTimezoneOffset();

  var offset_hours = - parseFloat(offset) / 60.0;

  var getopt = [-12, -11, -10, -9.5, -9, -8, -7, -6, -5, -4.5, -4, -3.5, -3, -2, -1, 0, 1, 2, 3, 3.5, 4, 4.5, 5, 5.5, 5.75, 6, 6.5, 7, 8, 8.5, 8.75, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.75, 13, 14];

  var select_id = getopt.indexOf(offset_hours) + 1;

  document.cert_form.offset_hour.options[select_id].selected= true;

    });
