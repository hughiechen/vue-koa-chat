// ***************************************************************** LICENSE AND COPYRIGHT *****************************************************************
// 
// Copyright Max Planck Gesellshaft, 2011
// 
// All software, data, text, and design used in this web application is the sole property of the Max Plank Gesellshaft and/or Brown University. 
// This application is provided solely for research and personal use.  Commercial use and reverse engineering of this application is explicitly prohibited.
// No warranty or suitability for any purpose is implied. 
// 
// Commercial licensing requests should be directed to Michael Black <black@is.mpg.de> .
// 
// Patents pending.
//
// *********************************************************************************************************************************************************


var CameraController = Class.create({
	onchange_functions : [],
	xRot : 0,
	yRot : 0,
	scaleFactor : 3.0,
	dragging : false,
	curX : 0,
	curY : 0,
	opt_canvas : null,
	opt_context : null,
	
	initialize: function(element, opt_canvas, opt_context) {
		if (opt_canvas) { this.canvas_ = opt_canvas; }
		if (opt_context) { this.context_ = opt_context; }
		
        this.onchange_functions = [];
		// Assign a mouse down handler to the HTML element.
		var start = function(controller) {
			return function(ev) {
				if (ev.touches) {
					controller.curX = ev.touches[0].pageX;
					controller.curY = ev.touches[0].pageY;
				} else {
					controller.curX = ev.clientX;
					controller.curY = ev.clientY;
				}
				var dragging = false;
				if (controller.canvas_ && controller.context_) {
					var rect = controller.canvas_.getBoundingClientRect();
					// Transform the event's x and y coordinates into the coordinate
					// space of the canvas
					var canvasRelativeX = ev.pageX - rect.left;
					var canvasRelativeY = ev.pageY - rect.top;
					var canvasWidth = controller.canvas_.width;
					var canvasHeight = controller.canvas_.height;
		
					// Read back a small portion of the frame buffer around this point
					if (canvasRelativeX > 0 && canvasRelativeX < canvasWidth &&
						canvasRelativeY > 0 && canvasRelativeY < canvasHeight) {
						var pixels = controller.context_.readPixels(canvasRelativeX, canvasHeight - canvasRelativeY, 1, 1, controller.context_.RGBA, controller.context_.UNSIGNED_BYTE);
						if (pixels) {
							// See whether this pixel has an alpha value of >= about 10%
							if (pixels[3] > (255.0 / 10.0)) {
								dragging = true;
							}
						}
					}
				} else {
					dragging = true;
				}
				controller.dragging = true;
                ev.preventDefault();
			}
		}(this)
		element.addEventListener('mousedown',start,false);
		element.addEventListener('touchstart',start,false);
		
		// Assign a mouse up handler to the document
		var end = function(controller) {
			return function(ev) {
				controller.dragging = false;
			}
		}(this);
		document.addEventListener('mouseup',end,false);
		document.addEventListener('touchend',end,false);
		
		// Assign a mouse move handler to the document
		var move = function(controller) {
			return function(ev) {
				if (controller.dragging) {
					// Determine how far we have moved since the last mouse move
					// event.
					if (ev.touches) {
						var curX = ev.touches[0].pageX;
						var curY = ev.touches[0].pageY;
					} else {
						var curX = ev.clientX;
						var curY = ev.clientY;
					}
					var deltaX = (controller.curX - curX) / controller.scaleFactor;
					var deltaY = (controller.curY - curY) / controller.scaleFactor;
					controller.curX = curX;
					controller.curY = curY;
					// Update the X and Y rotation angles based on the mouse motion.
					controller.yRot = (controller.yRot + deltaX) % 360;
					controller.xRot = (controller.xRot + deltaY);
					// Send the onchange event to any listeners.
					for (var i = 0; i < controller.onchange_functions.length; i++) {
						controller.onchange_functions[i]();
					}
				}
			}
		}(this)
		document.addEventListener('mousemove',move,false);
		document.addEventListener('touchmove',move,false);
	},
	
	add_viewer: function(callback) {
		this.onchange_functions.push(callback);
	},

	remove_viewer: function(callback) {
		this.onchange_functions = this.onchange_functions.without(callback);
	},
});

