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

var ArrayUtil = {
    initArray1D : function (length, value) {
        var one_d_array = new Array(length);
        for (var i = length; i; ) { one_d_array[--i] = value; }
        return one_d_array
    },

    flatten_two_d_array : function(two_d_array) {
        if (! two_d_array.length) { return []; }
        
        var height = two_d_array.length;
        var width = two_d_array[0].length;
        var length = height*width;
        var one_d_array = new Array(length);
        var index = length;
        for (i = height; i; ) {
            --i;
            for (j =  width; j; ) {
                one_d_array[--index] = two_d_array[i][--j];
            }
        }
        return one_d_array;
    }
};

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++){ formatted = formatted.replace("{" + i+ "}", arguments[i]) }
    return formatted;
};

var print_to_log = function printToLog() {
	var string = arguments.length ? arguments[0] : '';
	var content = [];
	for (var i = 1; i < arguments.length; i++) { content.push(arguments[i]); }
	console.log(string.format(content));
}

var FileLoader = Class.create({
	urls_to_load: [],
	callback_functions: null,
	url_done_loading: {},
	url_load_error: {},
	
	initialize: function(urls, callback) {
		this.urls_to_load = urls;
		this.callback_functions = callback;
		for (var i = 0; i < this.urls_to_load.length; i++) { this.start_loading_url(i); }
	},
	
	start_loading_url: function(url_index) {
		url = this.urls_to_load[url_index];
		this.url_done_loading[url] = false;
		this.url_load_error[url] = false;
		
		function create_callback(file_loader, url, url_index, load_succeeded) 
			{ return function(response) { file_loader.finish_loading_url(response, url, url_index, load_succeeded) } }
		
		var request_setup =
			{ method: 'get', onSuccess: create_callback(this, url, url_index, true), onFailure: create_callback(this, url, url_index, false) }
		new Ajax.Request(url, request_setup);
	},
	
	finish_loading_url: function(response, url, url_index, load_succeeded) {
		this.url_done_loading[url] = true;
		this.url_load_error[url] = load_succeeded;
		if (! load_succeeded) { print_to_log('{0} failed to load (status {1}): {2}', url, response.status, response.statusText) }
		if (this.callback_functions[url_index]) { eval(response.responseText); this.callback_functions[url_index](response, url, load_succeeded); }
	},
	
	all_done: function() {
		return true;
	}
});

var PrioritizedFileLoader = Class.create({
	lists_of_urls_to_load: [],
	callback_functions: [],
	current_priority: 0,
	current_file_loader: null,
	
	initialize: function(url_arrays, callbacks) {
		this.lists_of_urls_to_load = url_arrays;
		this.callback_functions = callbacks;
		this.current_priority = 0;
		this.load_counts = new Array(url_arrays.length);
		for (var i = 0; i < url_arrays.length; i++) { this.load_counts[i] = undefined }
		this.start_loading_current_priority();
	},
	
	file_loaded: function(priority, url_index) {
		this.load_counts[priority]++;
		if (this.load_counts[priority] == this.lists_of_urls_to_load[priority].length) {
			if (this.callback_functions[priority]) { this.callback_functions[priority](); }
			if (priority + 1 < this.lists_of_urls_to_load.length) {
				this.current_priority = priority + 1;
				this.start_loading_current_priority();
			} else {
				console.log('File appears to have loaded twice')
			}
		}
	},
	
	create_callbacks: function(priority) {
		var callback_list = []
		for(i = 0; i < this.lists_of_urls_to_load[priority].length; i++) {
			callback_list.push(
				function(prioritized_file_loader, url_priority, url_index) {
					return function(response, urls, load_succeeded) { prioritized_file_loader.file_loaded(url_priority, url_index); }
				}(this, priority, i));
		}
		return callback_list;
	},

	start_loading_current_priority: function() {
		if (this.load_counts[this.current_priority] == undefined) {
			this.load_counts[this.current_priority] = 0;
			this.current_file_loader = new FileLoader(this.lists_of_urls_to_load[this.current_priority], this.create_callbacks(this.current_priority));			
		}
		

	}
});

var ModelLoader = Class.create({
	initialize: function(shapeinfo_url, shape_data_directory, startModelViewerFunction) {
		this.startModelViewerFunction = startModelViewerFunction;
		this.shape_data_directory = shape_data_directory;
		var info_callback = function(model_loader) { return function() { model_loader.create_models(); } }(this);
		this.file_loader = new FileLoader([shapeinfo_url], [info_callback])
	},
	
	finish_loading_shapeinfo : function(filenames, means, covariance) {
		this.filenames = filenames;
		this.means = means;
		this.covariance = covariance;
		this.template_url = this.shape_data_directory + 'mean' + '.js';
		this.offset_urls = [];
		this.offset_names = Array(filenames.length);
		this.meshes = {};
		for (var i = 0; i < filenames.length; i++) {
			this.offset_names[i] = filenames[order_by_measurement[names[i].toLowerCase()]];
			this.offset_urls.push(this.shape_data_directory + this.offset_names[i] + '.js')
		}
	},
	
	create_models : function() {
		var template_callback = function(model_loader) { return function() { model_loader.template_loaded(); } }(this);
		var offsets_callback = function(model_loader) { return function() { model_loader.offsets_loaded(); } }(this);
		this.mesh_loader = new PrioritizedFileLoader([[this.template_url], this.offset_urls], [template_callback, offsets_callback]);
		setupSliders();
	},
	
	create_mesh: function(name, vertices, faces) {
		this.meshes[name] = new Mesh(vertices, faces, false);
		this.meshes[name].faces = faces;
	},
	
	
	template_loaded : function() {
		this.template_mesh = this.meshes['mean'];
		this.offset_meshes = [];
		this.current_model = new Model(this.template_mesh, this.offset_meshes);
		this.startModelViewerFunction(preview_canvas, this.current_model);
	},
	
	offsets_loaded : function() {
		this.offset_meshes = [];
		for (var i = 0; i < this.filenames.length; i++) {
			measurement_sliders[i].slider( "option", "disabled", false );
			this.offset_meshes[i] = this.meshes[this.offset_names[i]];
		}
		$J('#overlay').hide();
		preview_canvas.hide();
		body_canvas.show();
		preview_canvas.remove();
		console.log(this.offset_meshes);
		this.current_model = new Model(this.template_mesh, this.offset_meshes);
		this.startModelViewerFunction(body_canvas, this.current_model);
	}
})

var Mesh = Class.create({
	initialize: function initialize_mesh (vertices, faces, textures) {
		this.Positions = new Float32Array(ArrayUtil.flatten_two_d_array(vertices));
		if (faces) {
			this.Indices = new Uint16Array(ArrayUtil.flatten_two_d_array(faces));
		}
		var texture_cordinates = textures ? ArrayUtil.flatten_two_d_array(textures) : ArrayUtil.initArray1D(2*vertices.length, 0);
		this.TexCoords = new Float32Array(texture_cordinates);
		
		if (faces) {
			var vertex_to_face_list = vertices.map(function () { return []} );
			for (var i = 0; i < faces.length; i++) {
				var face=faces[i];
				vertex_to_face_list[face[0]].push(i); vertex_to_face_list[face[1]].push(i); vertex_to_face_list[face[2]].push(i); 
			}
			this.structured = { x:vertices, tri:faces, vrt2tri:vertex_to_face_list };
		} else {
			this.structured = { x:vertices };
		}
	},

});

function cross(a,b) {
        return [a[1]*b[2] - a[2]*b[1], a[2]*b[0] - a[0]*b[2], a[0]*b[1] - a[1]*b[0]];
}
function add(a,b) {
    return [a[0]+b[0], a[1]+b[1], a[2]+b[2]];
}
function sub(a,b) {
    return [a[0]-b[0], a[1]-b[1], a[2]-b[2]];
}

function create_normal_model(template, offset_meshes) {
    var tri=template.structured.tri;
    var vrt2tri=template.structured.vrt2tri;
    var tx=template.structured.x;

    var scaled_normal=new Array(tri.length);
    var dscaled_normal=new Array(offset_meshes.length);
    for(var oo=0; oo<offset_meshes.length; ++oo) {
		dscaled_normal[oo]=new Array(tri.length);
    }
	
    for(var ii=0; ii < tri.length; ++ii) {
		var t=tri[ii];
		scaled_normal[ii]=cross(sub(tx[t[1]], tx[t[0]]), sub(tx[t[2]], tx[t[0]]));
		
		for(var oo=0; oo<offset_meshes.length; ++oo) {
	    	var ox=offset_meshes[oo].structured.x;
	    	dscaled_normal[oo][ii]=add(cross(sub(tx[t[1]], tx[t[0]]), sub(sub(ox[t[2]],tx[t[2]]), sub(ox[t[0]],tx[t[0]]))), 
	                               cross(sub(sub(ox[t[1]],tx[t[1]]), sub(ox[t[0]],tx[t[0]])), sub(tx[t[2]], tx[t[0]])));
		}
    }

    var template_normals = ArrayUtil.initArray1D(3*tx.length, 0.0);
    for(var i=0; i<tx.length; ++i) {
        var vertex_faces = template.structured.vrt2tri[i];
        for (var j = 0; j < vertex_faces.length; j++) {
            template_normals[3*i] += scaled_normal[vertex_faces[j]][0];
            template_normals[3*i + 1] += scaled_normal[vertex_faces[j]][1];
            template_normals[3*i + 2] += scaled_normal[vertex_faces[j]][2];
        }
    }

    var dnormals = new Array(offset_meshes.length);
    for(var oo=0; oo<offset_meshes.length; ++oo) {
		dnormals[oo] = ArrayUtil.initArray1D(3*tx.length, 0.0);
		for(var i=0; i<tx.length; ++i) {
	    	var vertex_faces = template.structured.vrt2tri[i];
	    	for (var j = 0; j < vertex_faces.length; j++) {
				dnormals[oo][3*i] += dscaled_normal[oo][vertex_faces[j]][0];
				dnormals[oo][3*i + 1] += dscaled_normal[oo][vertex_faces[j]][1];
				dnormals[oo][3*i + 2] += dscaled_normal[oo][vertex_faces[j]][2];
	    	}
		}
    }
    return {template_point_normals: template_normals, dtemplate_point_normals: dnormals};
}

var Model = Class.create({
    initialize: function initialize_model(mesh, offset_meshes, optionsInput) {
	normal_model=create_normal_model(mesh, offset_meshes);
	mesh.Normals=new Float32Array(normal_model.template_point_normals);
	for(var oo=0; oo<offset_meshes.length; ++oo) {
	    offset_meshes[oo].Normals=new Float32Array(normal_model.dtemplate_point_normals[oo]);
	}

        var knownOptions = {color:true,textureImage:true};
        var options = {};
        this.mesh = mesh;
		this.offset_meshes = offset_meshes;
		this.number_of_offset_meshes = offset_meshes.length;
		options.scaleFactors = Array(this.number_of_offset_meshes);
		for (var i = 0; i < this.number_of_offset_meshes; i++ ) {
			options.scaleFactors[i] = 0.0;
		}
		
        this.getOption = function getOption(option) {
            if (knownOptions[option]) {
                return options[option];
            } else {
                throw new Error("Unknown Option: " + option);
            }
        }

        this.setOption = function setOption(option,value) {
            if (knownOptions[option]) {
                options[option] = value;
            } else {
                throw new Error("Unknown Option: " + option);
            }
        }

        this.setTextureImage = function (image) {
            this.setOption('textureImage',image);
        }
        this.setColor = function (image) {
            this.setOption('color',image);
        }

        this.setScalefactor = function (index, scalefactor) {
            options.scaleFactors[index] = scalefactor;
        }

        var positions =  function () {
            return mesh.Positions;
        }
        var indices = function() {
            return mesh.Indices;
        }
        var hasNormals = function () {
            return mesh.Normals ? true : false;
        }
        var hasTexCoords = function () {
            return mesh.TexCoords ? true : false;
        }
        var normals = function() {
            if (hasNormals()) {
                return mesh.Normals;
            } else {
                throw new Error("This Model has no Normals");
            }
        }

		var offset_normals = function(index) {
			return offset_meshes[index].Normals;
		}
		var offset_positions = function(index) {
			return offset_meshes[index].Positions;
		}
		
        var texCoords = function() {
            if (hasTexCoords()) {
                return mesh.TexCoords;
            } else {
                throw new Error("This Model has no Texture Coordinates");
            }
        }



        this.positions = positions;
        this.indices = indices;
        this.hasNormals = hasNormals;
        this.hasTexCoords = hasTexCoords;
        this.normals = normals;
        this.texCoords = texCoords;

		this.offset_normals = offset_normals;
		this.offset_positions = offset_positions;

        var attachedGL;
        var vbo;
        var texture;
        var elementVbo;
        var positionsOffset;
        var normalsOffset;
        var texCoordsOffset;
        var numElements;
        var shaderProgram;
        var uniformLocations;
        var attributeLocations;

        this.attach = function attach(gl) {
            if (attachedGL) throw new Error ("Already attached to a gl context");
            attachedGL = gl;
            uniformLocations = {};
            attributeLocations = {};


            if (options.textureImage) {
                //gl.enable(gl.TEXTURE_2D);  
                texture = gl.createTexture();  
                gl.bindTexture(gl.TEXTURE_2D, texture);  
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, options.textureImage);  
                //gl.texImage2D(gl.TEXTURE_2D, 0, textureImage,true);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                //gl.generateMipmap(gl.TEXTURE_2D);  
                gl.bindTexture(gl.TEXTURE_2D, null);  
            }   

			offset_related_attribute_declarations = [];
			offset_related_uniform_declarations = [];
			position_offsets_addition_expression = [];
			normal_offsets_addition_expression = [];
			for (var i = 1; i <= this.number_of_offset_meshes; i++) {
				offset_related_attribute_declarations.push("attribute vec3 aPositionOffsets" + i + ";");
				offset_related_attribute_declarations.push("attribute vec3 aNormalOffsets" + i + ";");
				offset_related_uniform_declarations.push("uniform float scaleFactor" + i + ";");
				position_offsets_addition_expression.push(" + scaleFactor" + i + " * aPositionOffsets" + i + ".xyz");
				normal_offsets_addition_expression.push(" + scaleFactor" + i + " * aNormalOffsets" + i + ".xyz");
			}
			offset_related_attribute_declarations = offset_related_attribute_declarations.join('\n');
			offset_related_uniform_declarations = offset_related_uniform_declarations.join('\n');
			position_offsets_addition_expression = position_offsets_addition_expression.join('');
			normal_offsets_addition_expression = normal_offsets_addition_expression.join('');
            var vertexShaderSource = [
				"#ifdef GL_ES",
			  	"precision highp float;",
			  	"#endif",
				"",
                "attribute vec3 aPosition;",
                "attribute vec3 aNormal;",
                "attribute vec2 aTexture;",
				"",
                offset_related_attribute_declarations,
                offset_related_uniform_declarations, 
				"uniform float meanScaleFactor;",

                "uniform mat4 world;",
                "uniform mat4 worldInverseTranspose;",
                "uniform mat4 worldViewProj;",
                "uniform mat4 viewInverse;",
                "uniform mat4 normalMatrix;",
                "",
                "varying vec3 vLighting;",
                "varying vec2 vTexture;",
                "",
                "void main() {",
                "  gl_Position = worldViewProj * vec4( meanScaleFactor * aPosition.xyz" + position_offsets_addition_expression + ", 1.0);",
                "  vec3 ambientLight = vec3(0.2, 0.2, 0.2);",
                "  vec3 directionalLightColor = vec3(0.9, 0.9, 0.75);",
                "  vec3 directionalVector = vec3(0.0, 0.0, 1.0);",
                "  vec3 directionalVector2 = 0.41*vec3(1.0, 2.0, 1.0);",
				"  vec3 specDirection = 0.667*vec3(0.5, 1.0, 1.0);",
				"  vec3 normalVector = normalize(vec3( aNormal.xyz" + normal_offsets_addition_expression + " ));",  
                "  vec4 transformedNormal = normalMatrix * vec4(normalVector, 1.0);",
//                "  float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);",
//              "  vec4 transformedNormal = normalMatrix * vec4(normalVector, 0.0);",
                "  float directional = abs(dot(transformedNormal.xyz, directionalVector));",
                "  float directional2 = abs(dot(transformedNormal.xyz, directionalVector2));",
				"  float directional3 = pow(max(dot(transformedNormal.xyz, specDirection),0.0), 10.0);",
                "  vLighting = ambientLight + (directionalLightColor * directional) + 0.3*(directionalLightColor * directional2) + 0.6*(directionalLightColor * directional3);",
//                "  vLighting = ambientLight + (directionalLightColor * directional);",
//                "  vTexture = aTexture;",
                "}",
            ].join('\n');
			
            var fragmentShaderSource = [
				"#ifdef GL_ES",
		  		"precision highp float;",
		  		"#endif",
				"",
                "varying vec3 vLighting;",
                "varying vec2 vTexture;",
                "",
                "uniform vec4 color;",
                "uniform sampler2D textureSampler;",
                "void main() {",
                texture ? 
                  "    vec4 col = texture2D(textureSampler, vTexture);":
                  "    vec4 col = color;",
                "    gl_FragColor = vec4(col.rgb*vLighting,col.a);",
                "}",
            ].join('\n');
//			console.log(vertexShaderSource)
            var vertexShader = GLUTIL.loadShader(gl,gl.VERTEX_SHADER,vertexShaderSource);
            var fragmentShader = GLUTIL.loadShader(gl,gl.FRAGMENT_SHADER,fragmentShaderSource);
            shaderProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
			GLUTIL.checkGLError(gl);

            gl.linkProgram(shaderProgram);
            attributeLocations.position = gl.getAttribLocation(shaderProgram, "aPosition");
            attributeLocations.normal = gl.getAttribLocation(shaderProgram, "aNormal");
            attributeLocations.texCoord = gl.getAttribLocation(shaderProgram, "aTexture");
			GLUTIL.checkGLError(gl);
			
			positionsOffsetsAttributeLocations = Array(this.number_of_offset_meshes);
			normalsOffsetsAttributeLocations = Array(this.number_of_offset_meshes);
			for (var i = 0; i < this.number_of_offset_meshes; i++) {
				positionsOffsetsAttributeLocations[i] = gl.getAttribLocation(shaderProgram, "aPositionOffsets" + (i + 1));
				normalsOffsetsAttributeLocations[i] = gl.getAttribLocation(shaderProgram, "aNormalOffsets" + (i + 1));
//				console.log(positionsOffsetsAttributeLocations[i])
//				console.log(normalsOffsetsAttributeLocations[i])
			}
			GLUTIL.checkGLError(gl);
            shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
            shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
            uniformLocations.world = gl.getUniformLocation(shaderProgram, "world");
            uniformLocations.worldInverseTranspose = gl.getUniformLocation(shaderProgram, "worldInverseTranspose");
            uniformLocations.worldViewProj = gl.getUniformLocation(shaderProgram, "worldViewProj");
            uniformLocations.viewInverse = gl.getUniformLocation(shaderProgram, "viewInverse");
            uniformLocations.normalMatrix = gl.getUniformLocation(shaderProgram, "normalMatrix");
            uniformLocations.color = gl.getUniformLocation(shaderProgram, "color");
            uniformLocations.texture = gl.getUniformLocation(shaderProgram, "textureSampler");
			
			uniformLocations.scaleFactorLocations = Array(this.number_of_offsets_meshes);
			for (var i = 0; i < this.number_of_offset_meshes; i++) {
				uniformLocations.scaleFactorLocations[i] = gl.getUniformLocation(shaderProgram, "scaleFactor" + (i + 1));
			}
			uniformLocations.meanScaleFactorLocation = gl.getUniformLocation(shaderProgram, "meanScaleFactor");
			
			GLUTIL.checkGLError(gl);
            //Create VBO and buffer objects
            vbo = gl.createBuffer();
			positions_byte_length = positions().byteLength;
			normals_byte_length = normals().byteLength;
			
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.bufferData(gl.ARRAY_BUFFER,
                      positions_byte_length + normals_byte_length + texCoords().byteLength + 
                      this.number_of_offset_meshes*positions_byte_length + this.number_of_offset_meshes*normals_byte_length,
                      gl.STATIC_DRAW);
            positionsOffset = 0;
            normalsOffset = positionsOffset + positions_byte_length;
            texCoordsOffset = normalsOffset + normals_byte_length;
			GLUTIL.checkGLError(gl);
			
			initial_offsets_offset = texCoordsOffset + texCoords().byteLength;
			positionsOffsetsOffsets = Array(this.number_of_offset_meshes);
			normalsOffsetsOffsets = Array(this.number_of_offset_meshes);
			for (var i = 0; i < this.number_of_offset_meshes; i++) {
				positionsOffsetsOffsets[i] = initial_offsets_offset + i*(positions_byte_length + normals_byte_length);
				normalsOffsetsOffsets[i] = positionsOffsetsOffsets[i] + positions_byte_length;
			}
            GLUTIL.checkGLError(gl);
            gl.bufferSubData(gl.ARRAY_BUFFER, positionsOffset, positions());
            gl.bufferSubData(gl.ARRAY_BUFFER, normalsOffset,   normals());
            gl.bufferSubData(gl.ARRAY_BUFFER, texCoordsOffset, texCoords());
            GLUTIL.checkGLError(gl);
			for (var i = 0; i < this.number_of_offset_meshes; i++) {
            	gl.bufferSubData(gl.ARRAY_BUFFER, positionsOffsetsOffsets[i], offset_positions(i));
            	gl.bufferSubData(gl.ARRAY_BUFFER, normalsOffsetsOffsets[i],   offset_normals(i));
	            GLUTIL.checkGLError(gl);
			}
            elementVbo = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementVbo);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices(), gl.STATIC_DRAW);
            numElements = indices().length;
            GLUTIL.checkGLError(gl);
            return uniformLocations;
        }



        this.draw = function(uniforms) {
            if (!attachedGL) throw new Error ("Cannot draw unless attached to a context");
            var gl = attachedGL;

            attachedGL.useProgram(shaderProgram);

            gl.uniformMatrix4fv(uniformLocations.world, gl.FALSE, uniforms.world);
            gl.uniformMatrix4fv(uniformLocations.worldInverseTranspose, gl.FALSE, uniforms.worldInverseTranspose);
            gl.uniformMatrix4fv(uniformLocations.worldViewProj, gl.FALSE, uniforms.worldViewProj);
            gl.uniformMatrix4fv(uniformLocations.viewInverse, gl.FALSE, uniforms.viewInverse);
            gl.uniformMatrix4fv(uniformLocations.normalMatrix, gl.FALSE, uniforms.normalMatrix);

			scale_factor_sum = 0.0;
			for (var i = 0; i < this.number_of_offset_meshes; i++) {
				gl.uniform1f(uniformLocations.scaleFactorLocations[i], options.scaleFactors[i]);
				scale_factor_sum += options.scaleFactors[i];
			}
			gl.uniform1f(uniformLocations.meanScaleFactorLocation, 1.0 - scale_factor_sum);
            if (options.color) {
                gl.uniform4fv(uniformLocations.color,options.color);
            }

            if (texture) {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, texture);
                //gl.uniform1i(locations.texture,0);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

            gl.vertexAttribPointer(attributeLocations.position, 3, gl.FLOAT, false, 0, positionsOffset);
            gl.enableVertexAttribArray(attributeLocations.position);

            gl.vertexAttribPointer(attributeLocations.normal, 3, gl.FLOAT, false, 0, normalsOffset);
            gl.enableVertexAttribArray(attributeLocations.normal);
            GLUTIL.checkGLError(gl);

            if (attributeLocations.texCoord != -1) {
                gl.vertexAttribPointer(attributeLocations.texCoord, 2, gl.FLOAT, false, 0, texCoordsOffset);
                gl.enableVertexAttribArray(attributeLocations.texCoord);
            }
            GLUTIL.checkGLError(gl);

			for (var i = 0; i < this.number_of_offset_meshes; i++) {
//				console.log(positionsOffsetsAttributeLocations[i])
            	gl.vertexAttribPointer(positionsOffsetsAttributeLocations[i], 3, gl.FLOAT, false, 0, positionsOffsetsOffsets[i]);
            	gl.enableVertexAttribArray(positionsOffsetsAttributeLocations[i]);
//				console.log(normalsOffsetsAttributeLocations[i])
            	gl.vertexAttribPointer(normalsOffsetsAttributeLocations[i], 3, gl.FLOAT, false, 0, normalsOffsetsOffsets[i]);
            	gl.enableVertexAttribArray(normalsOffsetsAttributeLocations[i]);
            	GLUTIL.checkGLError(gl);
			}

//			gl.LightModeli(gl.GL_LIGHT_MODEL_TWO_SIDE, gl.GL_TRUE);
            gl.drawElements(gl.TRIANGLES, numElements, gl.UNSIGNED_SHORT, 0);
//            gl.drawElements(gl.LINES, numElements, gl.UNSIGNED_SHORT, 0);
            GLUTIL.checkGLError(gl);

        }
    }

})
