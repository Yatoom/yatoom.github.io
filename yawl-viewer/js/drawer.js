var drawer = new function drawer() {
	this.draw = function(net, canvas) {
		net = $(net)
		var bounds = _getBounds(net)
		console.log(bounds)
	}
	
	this.createCanvas = function(net, target) {
		var $target = $(target)
		var bounds = _getBounds(net)
		var canvas = sprintf("<canvas width='%(w)dpx' height='%(h)dpx'></canvas>", bounds)
		return $target.html(canvas)
	}
	
	this.getVertices = function (net) {
		net = $(net)
		var vertices = net.find("vertex")
		console.log(vertices)
	}
	
	this.getTasks = function(processControlElements) {
		return $(processControlElements).find("task")
	}
	
	this.getConditions = function(processControlElements) {
		return $(processControlElements).find("condition")
	}
	
	
	function _drawSquare(x, y, size, canvas) {
		var context = canvas.getContext("2d")
		context.beginPath();
    context.rect(x, y, size, size);
    context.stroke();
	}
	
	function _drawCircle(x, y, size, canvas) {
		var context = canvas.getContext("2d")
		context.beginPath()
		context.arc(x, y, size, 0, 2 * Math.PI)
		context.stroke()
	}
	
	function _getBounds(net) {
		var bounds = net.child("bounds").attributes
		
		return {
			w: +bounds.w.value,
			h: +bounds.h.value,
		}
	}
}