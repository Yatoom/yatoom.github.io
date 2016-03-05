var Parser = new function parser() {
	var self = this
	this.parseYawlFromURL = function(url) {
		yawl = ""
		
		$.ajax({
			url: url,
			dataType: "text",
			success: function(data) {
				yawl += data
			},
			async: false
		});
		
		return _parseXML(yawl)
	}

	this.parseYawl = function(yawl) {	
		return _parseXML(yawl)
	}
	
	this.xmlToText = function(xml) {
		return new XMLSerializer().serializeToString(xml);
	}


	function _parseXML(yawl) {
		return $($.parseXML(yawl)).find("specificationSet")
	}
	
	this.getGlobalSpecs = function(yawl) {
		var decompositions = $(yawl).find("decomposition")
		var output = []
		decompositions.each(function(i, e) {
			if ($(e).attr("xsi:type") != "NetFactsType") {
				var text = self.xmlToText(e)
				output.push(text)
			}
		})
		return output.join("\n")
	}
	
	this.getMetaData = function(yawl) {
		return $(yawl).find("specification metaData")[0]
	}
	
	this.getLayout = function(yawl) {
		return yawl.child("layout")
	}
	
	this.getSpecification = function(yawl) {
		return yawl.child("specification")
	}
	
	this.getNetSpecs = function(yawl, netId) {
		return $(yawl).find("decomposition#" + netId)[0]
	}
	
	this.getNets = function(yawl) {
		return $(yawl).find("net")
	}
	
	this.getNet = function(yawl, id) {
		return $(yawl).find("net#" + id)[0]
	}
	
	this.getNetIds = function(nets) {
		var ids = []
		nets.each(function(i, e) {
			ids.push($(e).attr("id"))
		})
		return ids
	}
	
	this.getVertices = function(yawl, netId) {
		var vertex = sprintf("#%s vertex", netId)
		return yawl.find(vertex)
	}
	
	this.encodeXML = function(str) {
    var string =  String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
		return string
	}
	
	this.parseVertices = function(vertices) {
		
	}
	
	this.makeTree = function(yawl, target) {
		console.log(yawl)
		return new XMLTree({
			xml: yawl,
			container: target,
			startExpanded: true
		});
	}
}