// ==UserScript==
// @name         Trello jdate
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://trello.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/moghaddam24/jdate/master/jdate.min.js
// @updateURL    https://raw.githubusercontent.com/moghaddam24/Trello-Farsi/master/trello.user.js
// ==/UserScript==

function updateIt(){
    $("#classic").find("a[dt]").each(function(){
        var ts_text = $(this).html();
        if( ts_text.indexOf('  ') === -1 ){
            if( ts_text.indexOf('at') > 0 ){
                var dt = new Date( Date.parse( $(this).attr("title") ) );
                $(this).html(new JDate( dt.getTime() ).echo() + " " + ziro(dt.getHours()) + ":" + ziro(dt.getMinutes()) + "  ");
            }else{
                ts_text = ts_text.replace('an hour ago', "یک ساعت قبل");
                ts_text = ts_text.replace('hours ago', "ساعت قبل");
                ts_text = ts_text.replace('just now', "همین الان");
                ts_text = ts_text.replace('a minute ago', "یک دقیقه پیش");
                ts_text = ts_text.replace('minutes ago', "دقیقه پیش");
                ts_text = ts_text.replace('a few seconds ago', "چند ثانیه پیش");
                $(this).html(ts_text + "  ");
            }
        }
    });
    $("#classic").find(".phenom-desc").each(function(){
        if( ! $(this).attr("data-r324") ){
            var text = $(this).html();
            text = text.replace('moved this card from', "انتقال از<strong>");
            text = text.replace('to', "</strong>به<strong>") + "</strong>";
            text = text.replace('added this card', "اضافه کرد<strong>");
            $(this).html(text);
            $(this).attr("data-r324", "OK");
        }
    });
    $("#classic").find(".day-cell").each(function(){
        var dt = new Date( parseInt($(this).attr('name')) );
        var day = $(this).find(".date");
        if( day.html().indexOf('  ') === -1 ){
            var jd = new JDate( dt.getTime() );
            var label = jd.getDate() == 1 ? trnumToFa(jd.echo("d F")) : trnumToFa(jd.echo("d"));
            var lclass = jd.getDay() == 6 ? "jd_title friday" : "jd_title";
            day.html( day.html() + " <div class='"+ lclass +"'>"+ label +"</div>  " );
        }
    });
    $("#classic").find(".calendar-header-toolbar-title").each(function(){
        if( $(this).html().indexOf('  ') === -1 ){
            var jd = new JDate( Date.parse($(this).html()) );
            $(this).html( jd.echo("F Y  ") );
        }
    });
    if( ! $(".days-of-week").attr("data-r324") ){
        $(".days-of-week .quiet:nth(0)").html("یکشنبه");
        $(".days-of-week .quiet:nth(1)").html("دوشنبه");
        $(".days-of-week .quiet:nth(2)").html("سه‌شنبه");
        $(".days-of-week .quiet:nth(3)").html("چهارشنبه");
        $(".days-of-week .quiet:nth(4)").html("پنج‌شنبه");
        $(".days-of-week .quiet:nth(5)").html("جمعه");
        $(".days-of-week .quiet:nth(6)").html("شنبه");
        $(".days-of-week").attr("data-r324", "OK");
    }
}
(function() {
    'use strict';

    //updateIt();
    setInterval(updateIt, 1000);
})();