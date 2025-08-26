/*
for 書誌同定プロジェクト **
created:     2017.02.13 by lumely
lastupdated: 2017.02.13 by lumely
ver: 1.00
*/

// 比較対象の文字が違ったら色を変える
$(function() {
  if(jQuery.trim($("#bib1 .title").text()) != jQuery.trim($("#bib2 .title").text())){
    $("#bibsTableHeader .title").css('background-color', '#fdd');
    $("#bibsTableHeader .title").css('color', 'black');
  }

  if(jQuery.trim($("#bib1 .volume").text()) != jQuery.trim($("#bib2 .volume").text())){
    $("#bibsTableHeader .volume").css('background-color', '#fdd');
    $("#bibsTableHeader .volume").css('color', 'black');
  }

  if(jQuery.trim($("#bib1 .responsibility").text()) != jQuery.trim($("#bib2 .responsibility").text())){
    $("#bibsTableHeader .responsibility").css('background-color', '#fdd');
    $("#bibsTableHeader .responsibility").css('color', 'black');
  }

  if(jQuery.trim($("#bib1 .publisher_name").text()) != jQuery.trim($("#bib2 .publisher_name").text())){
    $("#bibsTableHeader .publisher_name").css('background-color', '#fdd');
    $("#bibsTableHeader .publisher_name").css('color', 'black');
  }

  if(jQuery.trim($("#bib1 .issued").text()) != jQuery.trim($("#bib2 .issued").text())){
    $("#bibsTableHeader .issued").css('background-color', '#fdd');
    $("#bibsTableHeader .issued").css('color', 'black');
  }

  $("#submitSame input").blur();
});
