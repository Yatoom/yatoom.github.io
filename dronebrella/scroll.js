/*global $, document, window */

// Scroll animation.
function scrollTo(event, location) {
    "use strict";
    event.preventDefault();
    $('html, body').animate({
        scrollTop: $(location).offset().top
    }, 1000);
}

$(document).ready(function () {
    "use strict";
    var displayFixedTop = false;

    // Set menu to fixed position when scroll offset is on menu height.
    $(window).on("scroll", function () {
        var scrollOffset = $(window).scrollTop();
        if (scrollOffset > 541 && !displayFixedTop) {
            $('#fixed-top').show();
            $('.menu').hide();
            scrollOffset = true;
        } else {
            $('#fixed-top').hide();
            $('.menu').show();
            scrollOffset = false;
        }
    });

    // Toggle menu
    $(".toggle-menu").on("click", function () {
        $("#fixed-top ul").slideToggle();
        $(".menu ul").slideToggle();
    });

    // Fix unexpected behavior on resizing.
    $(window).on("resize", function () {
        if ($(window).width() > 921) {
            $("#fixed-top ul").show();
            $(".menu ul").show();
        } else {
            $("#fixed-top ul").hide();
            $(".menu ul").hide();
        }
    });

    $("[href='#home']").on("click", function (event) {
        scrollTo(event, "#home");
    });

    $("[href='#concept']").on("click", function (event) {
        scrollTo(event, "#concept");
    });

    $("[href='#system']").on("click", function (event) {
        scrollTo(event, "#system");
    });

    $("[href='#service']").on("click", function (event) {
        scrollTo(event, "#service");
    });

    $("[href='#reviews']").on("click", function (event) {
        scrollTo(event, "#reviews");
    });
});