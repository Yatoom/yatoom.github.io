function toggle(source, id) {
	var element = document.getElementById(id)
	var display = element.style.display
	console.log(source)
	
	if (display === 'none') {
		element.style.display = 'block'
	} else {
		element.style.display = 'none'
	}
}

function hide(element) {
	console.log(element)
	element.style.display = 'none'
}