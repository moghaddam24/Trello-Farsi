// ==UserScript==
// @name         Trello jdate
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       You
// @match        https://trello.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/moghaddam24/Trello-Farsi/master/jdate.min.js
// @updateURL    https://raw.githubusercontent.com/moghaddam24/Trello-Farsi/master/trello.user.js
// ==/UserScript==

function updateIt(){
    $("#trello-root").find("a[dt]").each(function(){
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
    $("#trello-root").find(".card-detail-due-date-text").each(function(){
        var ts_text = $(this).html();
        if( ts_text && ts_text.indexOf('  ') === -1 ){
            ts_text = ts_text.replace(' at', ", " + new Date().getFullYear());
            var dt = new Date( Date.parse( ts_text ) );
            $(this).parent().css({direction: "rtl", 'padding-right': "12px", 'padding-left': 0});
            $(this).html(new JDate( dt.getTime() ).echo("d M") + "، ساعت " + ziro(dt.getHours()) + ":" + ziro(dt.getMinutes()) + "  ");
        }
    });
    $("#trello-root").find(".js-due-date-text").each(function(){
        var ts_text = $(this).html();
        if( ts_text && ts_text.indexOf('  ') === -1 ){
            ts_text = ts_text + ", " + new Date().getFullYear();
            var dt = new Date( Date.parse( ts_text ) );
            $(this).html(new JDate( dt.getTime() ).echo("d M  "));
        }
    });
    $("#trello-root").find(".phenom-desc").each(function(){
        if( ! $(this).attr("data-r324") ){
            var text = $(this).html();
            text = text.replace('moved this card from', "انتقال از<strong>");
            text = text.replace('changed the due date of this card', "ددلاین را تغییر داد<strong>");
            text = text.replace('set this card', "اعمال کرد<strong>");
            text = text.replace('transferred this card from', "این کارت را انتقال داد از<strong>");
            text = text.replace('to', "</strong>به<strong>") + "</strong>";
            text = text.replace('added this card', "اضافه کرد<strong>");
            $(this).html(text);
            $(this).attr("data-r324", "OK");
        }
    });
    $("#trello-root").find(".day-cell").each(function(){
        var dt = new Date( parseInt($(this).attr('name')) );
        var day = $(this).find(".date");
        if( day.html().indexOf('  ') === -1 ){
            var jd = new JDate( dt.getTime() );
            var label = jd.getDate() == 1 ? trnumToFa(jd.echo("d F")) : trnumToFa(jd.echo("d"));
            var lclass = jd.getDay() == 6 ? "jd_title friday" : "jd_title";
            day.html( day.html() + " <div class='"+ lclass +"'>"+ label +"</div>  " );
        }
    });
    $("#trello-root").find(".calendar-header-toolbar-title").each(function(){
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
    var members = $(".b-avatar__image");
    for(var i=0; i<members.length; i++){
        var a = $(members[i]).attr('style');
        var id = a.slice(a.indexOf(".com/") + 5, -42);
        if( id.indexOf("/") == -1 ){
            var src = $(".member-avatar[src*="+id+"]")[0].src;
        $(members[i]).attr('style', 'background: url("'+src+'") center center / cover no-repeat;');
        }
    }
}

var holidaysShamsi = ['1399/05/18', '1399/06/08', '1399/06/09', '1399/07/17', '1399/07/26', '1399/08/04', '1399/08/13', '1399/10/28', '1399/11/22', '1399/12/07', '1399/12/21', '1399/12/30'];

function ganttFarsi(){
    $(".b-cell_holiday").removeClass("b-cell_holiday");
    $(".b-cell_last").removeClass("b-cell_last");
    $(".b-cell_right-border").removeClass("b-cell_right-border");

    var ganttDay = $(".b-cell_today");
    var gday = new Date();
    for(var i=0; i<40; i++){
        var TS = gday.getTime() + (86400000*i);
        var curDate = new Date(TS);
        if( i != 0 ){
            ganttDay = ganttDay.next();
        }
        var dayHead = ganttDay[0];
        var dayCell = ganttDay[1];
        if( curDate.getDay() == 5 ){
            $($(dayHead)[0]).addClass("b-cell_holiday b-cell_right-border");
            $($(dayCell)[0]).addClass("b-cell_holiday b-cell_right-border");
        }
        if( holidaysShamsi.indexOf( new JDate( TS ).echo() ) != -1 ){
            $($(dayHead)[0]).addClass("b-cell_holiday");
            $($(dayCell)[0]).addClass("b-cell_holiday");
        }
        $(dayHead).find(".b-day__text").text( new JDate( TS ).echo("d") );
    }
}
function ganttFarsiPre(){
    var ganttDay = $(".b-cell_today");
    var gday = new Date();
    for(var i=0; i<40; i++){
        var TS = gday.getTime() - (86400000*i);
        var curDate = new Date(TS);
        if( i != 0 ){
            ganttDay = ganttDay.prev();
        }
        var dayHead = ganttDay[0];
        var dayCell = ganttDay[1];
        if( curDate.getDay() == 5 ){
            $($(dayHead)[0]).addClass("b-cell_holiday b-cell_right-border");
            $($(dayCell)[0]).addClass("b-cell_holiday b-cell_right-border");
        }
        if( holidaysShamsi.indexOf( new JDate( TS ).echo() ) != -1 ){
            $($(dayHead)[0]).addClass("b-cell_holiday");
            $($(dayCell)[0]).addClass("b-cell_holiday");
        }
        $(dayHead).find(".b-day__text").text( new JDate( TS ).echo("d") );
    }
}

(function() {
    'use strict';
    setInterval(updateIt, 1000);

    $(document).on("click", ".b-switch__last", function(){
        $("#beacon-container").remove();
        ganttFarsi();
        ganttFarsiPre();
    });
})();
