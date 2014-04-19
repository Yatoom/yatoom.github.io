$(document).ready(function(){
	scroller(".container");
	scrollTop('.logo');
	autoScroll('.menu a');
	autoScroll('.autoscroll');

	$('.menu-button').on("click", function () {
		if ($('body').hasClass('menu-default')) {
			
			$('body').removeClass('menu-default');

			if ($('.menu').css("left") == "0px") {
				$('body').addClass('menu-opened');
			} else {
				$('body').addClass('menu-closed');
			}
		}

		$('body').toggleClass('menu-closed');
		$('body').toggleClass('menu-opened');
	});
});