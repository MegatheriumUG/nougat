THREE.TransparentDepthShader = {
	uniforms: {
		'mNear' : { type: 'f', value: 1.0 },
		'mFar'	: { type: 'f', value: 2000.0 },
		'opacity' : { type: 'f', value: 1.0 },
		'map'	: { type: 't', value: null },
		'diffuse' : { type: 'v3', value: new THREE.Vector3(1, 1, 1) }
	},
	vertexShader: [
		THREE.ShaderChunk[ 'common' ],
		THREE.ShaderChunk[ 'morphtarget_pars_vertex'],
		THREE.ShaderChunk[ 'logdepthbuf_pars_vertex'],
		THREE.ShaderChunk[ 'uv_pars_vertex'],
		'void main() {',
			THREE.ShaderChunk['uv_vertex'],
			THREE.ShaderChunk['begin_vertex'],
			THREE.ShaderChunk['morphtarget_vertex'],
			THREE.ShaderChunk['project_vertex'],
			THREE.ShaderChunk['logdepthbuf_vertex'],
		'}'
	].join('\n'),
	fragmentShader: [
		'uniform float mNear;',
		'uniform float mFar;',
		'uniform float opacity;',
		'uniform vec3 diffuse;',

		THREE.ShaderChunk['common'],
		THREE.ShaderChunk['logdepthbuf_pars_fragment'],
		THREE.ShaderChunk['uv_pars_fragment'],
		THREE.ShaderChunk['map_pars_fragment'],

		'void main() {',
			//'vec4 diffuseColor = vec4(diffuse, opacity);',
			//THREE.ShaderChunk['logdepthbuf_fragment'],
			//THREE.ShaderChunk['map_fragment'],
			//THREE.ShaderChunk['alphatest_fragment'],

			'#ifdef USE_LOGDEPTHBUF_EXT',
				'float depth = gl_FragDepthEXT / gl_FragCoord.w;',
			'#else',
				'float depth = gl_FragCoord.z / gl_FragCoord.w;',
			'#endif',

			'float color = 1.0 - smoothstep(mNear, mFar, depth);',
			'color = 0.5;',
			//'gl_FragColor = vec4(vec3(color), opacity);',
			'gl_FragColor = vec4(1, 1, 1, 1);',
		'}'
	].join('\n')
};	