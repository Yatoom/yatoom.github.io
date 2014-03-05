/** Small window mode: push container out of screen to the left */
function moveScreen() {
		if ($(".menu").css("right") != "0px"){
		// Open Menu
		$(".menu").css("right", "0px");
		$(".container").css("left", "-300px");
		$(".contact").css("left", "-300px");
	} else {
		setDefault();
	}
}

/** Wide window mode: decrease padding and move to the right */
function moveText() {
	console.log("moveMenu");
	if ($(".menu").css("right") != "0px"){
		console.log("open...");
		// Open Menu
		$(".menu").css("right", "0px");
		$(".purple-box, .green-box, .blue-box, .red-box, .contact .info").css("padding", "5% calc(15% - 150px) 5% calc(15% - 150px)");
		$(".contact .design").css("padding", "2% calc(15% - 150px) 2% calc(15% - 150px)"); // Different padding values
		$(".purple-box, .green-box, .blue-box, .red-box, .contact .info, .contact .design, .about").css("right", "-300px");
		$(".container").css("left", "-300px");
		$(".about").css("width", "calc(100% - 300px)");
		$(".logo").css("padding", "160px 0px 100px 300px")
		$(".logo").css("width", "calc(100% - 300px)");

	} else {
		console.log("close...");
		setDefault();
	}
}

/** Set default values. */
function setDefault() {
	$(".menu").css("right", "-300px");
	$(".purple-box, .green-box, .blue-box, .red-box, .contact .info, .contact .design").css("padding", "5% 15% 5% 15%");
	$(".contact .design").css("padding", "2% 15% 2% 15%"); // Different padding values
	$(".purple-box, .green-box, .blue-box, .red-box, .contact .info, .contact .design, .about").css("right", "0px");
	$(".container").css("left", "0px");
	$(".about").css("width", "100%");
	$(".contact").css("left", "0px");
	$(".logo").css("padding", "160px 0px 100px 0px")
	$(".logo").css("width", "100%");
}

$(document).ready(function(){
	/** Show menu */
	$("#menu-button").on("click", function(){
		console.log($(".menu").css("width"));
		if ($(window).width() > 1024){
			moveText();
		} else {
			moveScreen();
		}
	});

	/** Hide menu on resize */
	$(window).on("resize", function(){
		setDefault();
	});

	/** Activate scrollspy */
	$('body').scrollspy({ target: '.menu', offset: 100})

	/** Scroll to id */
	$( '.menu a' ).click( function(e) {
    	e.preventDefault();
    	console.log($(this).attr("href"));
    	var target = $($(this).attr("href"));
    	$('html,body').animate({
        	scrollTop: target.offset().top
        }, 1000);
        setDefault();
   });
});