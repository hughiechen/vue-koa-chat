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


var ModelViewer = Class.create({
    
    

    initialize: function(in_models, canvas, controller) {
        var gl = GLUTIL.getContext(canvas);
        GLUTIL.checkGLError(gl);
        var locations = {};
        var models = [];
        var currentController;
        var orig_draw = this.draw;
        var self = this;
        this.init(gl);
        for (var i = 0; i < in_models.length; i++) {
            models.push(in_models[i]);
            locations = models[i].attach(gl);
        }
        
        this.repaint = function () {
            var options = {
              xRot: controller.xRot,
              yRot: controller.yRot,
              width: canvas.width,
              height: canvas.height,
              models: models,
            };
//			console.log('here')
        	GLUTIL.checkGLError(gl);
            orig_draw(gl,locations,options);
//   			console.log('here2')
        };

        this.disconnect = function () {
            controller.remove_viewer(self.repaint);
        }

        this.attach = function (controller) {
            if (currentController) {
               self.disconnect();
            }
            currentController = controller;
            currentController.add_viewer(self.repaint);
        }



        this.enable = function enable(property) {
            gl.enable(gl[property]);
        };
        this.disable = function enable(property) {
            gl.enable(gl[property]);
        };
        this.attach(controller);
        this.repaint();
        return true;
    },
    
    

    init: function(gl) {

//        gl.clearColor(0.3, 0.3, 0.3, 1.0);
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clearDepth(1.0);

        GLUTIL.checkGLError(gl);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.enable(gl.CULL_FACE);
        gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
        GLUTIL.checkGLError(gl);
        gl.depthFunc(gl.LEQUAL);

        GLUTIL.checkGLError(gl);
    },
    
    
    

    draw: function draw(gl,locations,options) { // Draw the picture

        GLUTIL.checkGLError(gl);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, options.width, options.height);
        GLUTIL.checkGLError(gl);

        var model = new Matrix4x4();
        var view = new Matrix4x4();
        var projection = new Matrix4x4();

        GLUTIL.checkGLError(gl);
        projection.loadIdentity();
        projection.perspective(45, options.width / options.height, 0.1, 100);
    
        GLUTIL.checkGLError(gl);
        // Add in  rotation
        model.loadIdentity();
        model.translate(0.0, -1.0, -3.0);
        model.rotate(options.xRot, 1, 0, 0);
        model.rotate(options.yRot, 0, 1, 0);
//        model.rotate(175, 0, 1, 0);
//        model.rotate(90, 1, 0, 0);

        GLUTIL.checkGLError(gl);
        
        var mvp = new Matrix4x4();
        mvp.multiply(model);
        mvp.multiply(projection);
        var worldInverseTranspose = model.inverse();
        worldInverseTranspose.transpose();
        var viewInverse = view.inverse();
        var normalMatrix = new Matrix4x4().multiply(model).inverse().transpose();

        GLUTIL.checkGLError(gl);

        var uniforms = {
            world: new Float32Array(model.elements),
            worldInverseTranspose: new Float32Array(worldInverseTranspose.elements),
            worldViewProj: new Float32Array(mvp.elements),
            viewInverse: new Float32Array(viewInverse.elements),
            normalMatrix: new Float32Array(normalMatrix.elements),
        };
        
        for (var i = 0; i < options.models.length; i++) {
            gl.clear(gl.DEPTH_BUFFER_BIT);
            options.models[i].draw(uniforms);
            GLUTIL.checkGLError(gl);

        }


        gl.flush();
        GLUTIL.checkGLError(gl);
    },
});

var GLUTIL = {
    loadTexture: function(gl, src, callback) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        var image = new Image();
        image.onload = function() {
            
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, image, true);
            GLUTIL.checkGLError(gl);
            callback(texture);
        };
        image.src = src;
        return texture;
    },
    loadShader: function(gl, type, shaderSrc) {
        var shader = gl.createShader(type);
        if (shader == null) {
            throw new Error("Unable to create shader");
        }
        // Load the shader source
        gl.shaderSource(shader, shaderSrc);
        // Compile the shader
        gl.compileShader(shader);
        // Check the compile status
        if (! gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            var infoLog = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            throw new Error("Error compiling shader:\n" + infoLog);
        }
        return shader;
    },
    checkGLError: function(gl) {
        var error = gl.getError();
        if (error != gl.NO_ERROR) {
            throw new Error("GL Error: " + error );
        }
    },
    getContext: function getContext(canvas) {
      var gl = null;
      try {
          gl = canvas.getContext("experimental-webgl");
      } catch (e) {
      }
      if (!gl) {
          throw new Error("Could not create WebGLContext");
      }
      return gl;
    },

};
var OpacitySlider = Class.create({
    model_viewer: null,
    handle_div_id: "",
    handle: null,
    track_div_id: "",
    track: null,
    slider: null,
    callback_function: function(x) { return true; },
    
    width: 0,
    lower_bound: 0.0,
    upper_bound: 1.0,
    range: 1.0,
    initial_value: 0.5,
    current_value: 0.5,
    
    initialize: function(model_viewer, handle_div_id, track_div_id, width, lower_bound, upper_bound, initial_value, callback_function) {
        this.model_viewer = model_viewer;
        this.handle_div_id = handle_div_id;
        this.handle = $(this.handle_div_id);
        this.track_div_id = track_div_id;
        this.track = $(this.track_div_id);
        if (callback_function) { this.callback_function = callback_function; }
        
        if (width) { this.track.style.width = width + 'px'; }
        this.width = parseInt(this.track.style.width.substring(0, this.track.style.width.length - 2));
        
        if (lower_bound) { this.lower_bound = lower_bound; }
        if (upper_bound) { this.upper_bound = upper_bound; }
        this.range = this.upper_bound - this.lower_bound;
        if (initial_value) { this.initial_value = initial_value; }
        
        function slider_onChange_function(opacity_slider, width, range, lower_bound, callback_function) {
            return function(x) { opacity_slider.set_value(x); callback_function(x, opacity_slider.model_viewer); };
        }
        this.slider = new Control.Slider(handle_div_id, track_div_id, {
            onSlide: slider_onChange_function(this, this.width, this.range, this.lower_bound, this.callback_function),
            onChange: slider_onChange_function(this, this.width, this.range, this.lower_bound, this.callback_function),
            range: $R(lower_bound, upper_bound),
        });
        
        this.slider.setValue(this.initial_value);
        this.current_value = this.initial_value;
    },
    
    set_value : function(value) {
        if (value != this.current_value) {
            this.model_viewer.triColors[0][3] = value;
            this.model_viewer.lineColors[0][3] = value;
            this.model_viewer.triColors[1][3] = 1 - value;
            this.model_viewer.lineColors[1][3] = 1 - value;
            this.current_value = value;
        }
    }
});
