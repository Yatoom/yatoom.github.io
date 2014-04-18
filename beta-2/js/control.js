$(document).ready(function(){
	scroller(".container");
	scrollTop('.logo');
	autoScroll('.menu a');
	autoScroll('.autoscroll');

	$('.menu-button').on("click", function () {
		if ($('.menu').attr('style') !== undefined) {
			//$('.menu-button, .menu, .container, .left, .design').removeAttr("style");
			$('.menu-button').removeClass('button-left');

			$('.menu, .design').css("left", "-255px");
			$('.container').css("left", "0px");
			$('.menu-button').css("left", "0px");
		} else {
			$('.menu, .design').css("left", "0px");
			$('.container').css("left", "255px");
			$('.menu-button').css("left", "255px");
			$('.menu-button').addClass('button-left');
		}
	});
});