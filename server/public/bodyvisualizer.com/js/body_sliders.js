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

var ColorSlider = Class.create({
	slider_id: "",
	slider: null,
	slider_handle: null,
	
	r: 0,
	g: 0,
	b: 0,
	hex: "000000",
	
	callback: null,
	
	initialize: function(slider_id, callback) {
		this.slider_id = slider_id;
		this.callback = callback;
		
		var update_function = function(color_slider_object) {
			return function() { color_slider_object.update(); }
		}(this);
		
		$J('#' + slider_id).slider({
			orientation: "horizontal",
			min: 0, max: 300, value: 180,
			slide: update_function,
			change: update_function,
			animate: 300,
		})
		this.slider = $J('#' + slider_id);
		this.slider_handle = $J('#' + slider_id + ' .ui-slider-handle');
	},
	
	hexFromRGB: function(r, g, b) {
		var hex = [ Math.round(r).toString( 16 ), Math.round(g).toString( 16 ), Math.round(b).toString( 16 ) ];
		if ( hex[0].length === 1 ) { hex[0] = "0" + hex[0]; }
		if ( hex[1].length === 1 ) { hex[1] = "0" + hex[1]; }
		if ( hex[2].length === 1 ) { hex[2] = "0" + hex[2]; }	
		return hex.join( "" ).toUpperCase();
	},
	
	update: function() {
		var s = 130;
		var c = 255 - s;
		
		color_value = 3*this.slider.slider( "value" )/300;
		if (color_value <= 1) {
			this.r = s*(1 - color_value) + c;
			this.g = s*(color_value) + c;
			this.b = c;
		} else if (color_value <= 2) {
			this.r = c;
			this.g = s*(2 - color_value) + c;
			this.b = s*(color_value - 1) + c;
		} else {
			this.r = s*(color_value - 2) + c;
			this.g = c;
			this.b = s*(3 - color_value) + c;
		}
		this.hex = this.hexFromRGB( this.r, this.g, this.b );
		this.slider_handle.css( "background-color", "#" + this.hex );	
		if (this.callback) { 
			return this.callback(this.hex, this.r, this.g, this.b);
		}
	}
});
