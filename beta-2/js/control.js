function autoScroll(target) {
	$(target).click( function(e) {
    	e.preventDefault();
    	var target = $($(this).attr("href"));
    	$('html,body').animate({
        	scrollTop: target.offset().top
        }, 400);
   });	
}

function scrollToNext(id) {
	// var next = $(current).parent();
	// console.log(next);
	var next = $("#" + id).next();
	while (next.attr("id") === undefined) {
		var next = next.next();
	}
	$('html,body').animate({
    	scrollTop: next.offset().top
    }, 400);
}

$(document).ready(function(){

	$(".logo").on("click", function(){
		$('html,body').animate({
        	scrollTop: "0px"
        }, 400);
	});


	autoScroll('.menu a');
	autoScroll('.autoscroll');
});