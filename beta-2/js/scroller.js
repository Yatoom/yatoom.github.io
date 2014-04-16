var ids = new Array();

// Returns the top and bottom offset of an element.
function position(elem) {
	var top = elem.offset().top;
	var bottom = top + elem.outerHeight();

	return [top, bottom]
}

// Returns the position of a navigation link.
function listPosition(id) {
	var li = $(".nav li a[href='#" + id + "']");

	return position(li);
}

// Returns the position of a box.
function boxPosition(id) {
	var box = $("#" + id);

	return position(box);
}

// Returns true if the navigation link is at the same height as the box. False otherwise.
function checkBetween(id) {
	var listPos = listPosition(id);
	var boxPos = boxPosition(id);

	var topLink = listPos[0];
	var bottomLink = listPos[1];
	var topBox = boxPos[0];
	var bottomBox = boxPos[1];

	if (topLink >= topBox && bottomLink <= bottomBox) {
		return true;
	} else {
		return false;
	}
}

function activator(id) {
	var li = $(".nav li a[href='#" + id + "']");
	if (checkBetween(id)) {
		li.parent().addClass('active');
	} else {
		li.parent().removeClass('active');
	}
}

function getIds(target) {
	$(target + " div").each(function(index, element){
		if ($(element).attr("id") !== undefined) {
			ids.push($(element).attr("id"));
		}
	});
}

function check() {
	for (var i = 0; i < ids.length; i++) {
		activator(ids[i]);
	}
}

$(document).ready(function(){
	// Get ids.
	getIds(".container");

	$(document).on("scroll", function() {
		check();
	});
	$(".menu").on("scroll", function() {
		check();
	});
});