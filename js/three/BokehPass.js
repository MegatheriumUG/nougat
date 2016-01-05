/**
 * Depth-of-field post-process with bokeh shader
 */


THREE.BokehPass = function ( scene, camera, params ) {

	this.scene = scene;
	this.camera = camera;

	var focus = ( params.focus !== undefined ) ? params.focus : 1.0;
	var aspect = ( params.aspect !== undefined ) ? params.aspect : camera.aspect;
	var aperture = ( params.aperture !== undefined ) ? params.aperture : 0.025;
	var maxblur = ( params.maxblur !== undefined ) ? params.maxblur : 1.0;

	// render targets

	var width = params.width || window.innerWidth || 1;
	var height = params.height || window.innerHeight || 1;

	this.renderTargetColor = new THREE.WebGLRenderTarget( width, height, {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBAFormat
	} );

	this.renderTargetDepth = this.renderTargetColor.clone();

	// depth material

	if(THREE.TransparentDepthShader === undefined) {
		console.error("THREE.BrokehPass relies on THREE.TransparentDepthShader");
	}

	var depthShader = THREE.TransparentDepthShader;
	var depthUniforms = THREE.UniformsUtils.clone(depthShader.uniforms);
	depthUniforms['mNear'].value = camera.near;
	depthUniforms['mFar'].value = camera.far;
	depthUniforms['map'].value = this.renderTargetColor;

	this.materialDepth = new THREE.ShaderMaterial({
		uniforms: depthUniforms,
		vertexShader: depthShader.vertexShader,
		fragmentShader: depthShader.fragmentShader
	});

	//this.materialDepth = new THREE.MeshDepthMaterial();
	this.materialDepth.transparent = true;
	this.materialDepth.alphaTest = 0.5;
	this.materialDepth.needsUpdate = true;

	// bokeh material

	if ( THREE.BokehShader === undefined ) {

		console.error( "THREE.BokehPass relies on THREE.BokehShader" );

	}
	
	var bokehShader = THREE.BokehShader;
	var bokehUniforms = THREE.UniformsUtils.clone( bokehShader.uniforms );

	bokehUniforms[ "tDepth" ].value = this.renderTargetDepth;

	bokehUniforms[ "focus" ].value = focus;
	bokehUniforms[ "aspect" ].value = aspect;
	bokehUniforms[ "aperture" ].value = aperture;
	bokehUniforms[ "maxblur" ].value = maxblur;

	this.materialBokeh = new THREE.ShaderMaterial( {
		uniforms: bokehUniforms,
		vertexShader: bokehShader.vertexShader,
		fragmentShader: bokehShader.fragmentShader
	} );

	this.uniforms = bokehUniforms;
	this.enabled = true;
	this.needsSwap = false;
	this.renderToScreen = true;
	this.clear = false;

	this.camera2 = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	this.scene2  = new THREE.Scene();

	this.quad2 = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
	this.scene2.add( this.quad2 );

};

THREE.BokehPass.prototype = {

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		this.quad2.material = this.materialBokeh;

		// Render depth into texture

		this.scene.overrideMaterial = this.materialDepth;
		this.materialDepth.uniforms['map'].value = readBuffer;

		renderer.render( this.scene, this.camera, null, true );

		// Render bokeh composite

		this.uniforms[ "tColor" ].value = readBuffer;

		if ( this.renderToScreen ) {

			//renderer.render( this.scene2, this.camera2 );

		} else {

			//renderer.render( this.scene2, this.camera2, writeBuffer, this.clear );

		}

		this.scene.overrideMaterial = null;

	}

};

