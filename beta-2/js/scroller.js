/* Scroller.js
 * 
 * Author: Jeroen van Hoof
 */

var SCROLLTIME = 400;
var ids = [];

// Returns the top and bottom offset of an element.
function position(elem) {
    "use strict";

    var top, bottom;
    top = elem.offset().top;
    bottom = top + elem.outerHeight();

    return [top, bottom];
}

// Returns the position of a navigation link.
function listPosition(id) {
    "use strict";

    var li = $(".nav li a[href='#" + id + "']");

    return position(li);
}

// Returns the position of a box.
function boxPosition(id) {
    "use strict";

    var box = $("#" + id);

    return position(box);
}

// Returns true if the navigation link is at the same height as the box. False otherwise.
function checkBetween(id) {
    "use strict";

    var listPos, boxPos, topLink, bottomLink, topBox, bottomBox;
    listPos = listPosition(id);
    boxPos = boxPosition(id);
    topLink = listPos[0];
    bottomLink = listPos[1];
    topBox = boxPos[0];
    bottomBox = boxPos[1];

    if (topLink >= topBox && bottomLink <= bottomBox) {
        return true;
    }

    return false;
}

// Activates a navigation link when it has the same height as the box.
function activator(id) {
    "use strict";

    var li = $(".nav li a[href='#" + id + "']");
    if (checkBetween(id)) {
        li.parent().addClass('active');
    } else {
        li.parent().removeClass('active');
    }
}

// Find all siblings with an id, and store this id.
function getIds(target) {
    "use strict";

    $(target + " div").each(function (index, element) {
        if ($(element).attr("id") !== undefined) {
            ids.push($(element).attr("id"));
        }
    });
}

// Update each element.
function update() {
    "use strict";

    var i;
    for (i = 0; i < ids.length; i += 1) {
        activator(ids[i]);
    }
}

// Main function.
function scroller(target) {
    "use strict";

    getIds(target);

    $(document).on("scroll", function () {
        update();
    });

    // Also update if the menu itself is scrolled.
    $(".menu").on("scroll", function () {
        update();
    });
}

// Optional autoScroll function: if clicked on link, autoscroll to id.
function autoScroll(target) {
    "use strict";

    $(target).on("click", function (e) {
        e.preventDefault();
        var scrollTarget = $($(this).attr("href"));
        $('html,body').animate({
            scrollTop: scrollTarget.offset().top
        }, SCROLLTIME);
    });
}

// Optional scrollTop function: scroll to top, if clicked on target.
function scrollTop(target) {
    "use strict";

    $(target).on("click", function () {
        $('html,body').animate({
            scrollTop: "0px"
        }, SCROLLTIME);
    });
}