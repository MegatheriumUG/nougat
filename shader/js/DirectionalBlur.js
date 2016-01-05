//Direction Blur

THREE.DirectionalBlur = {
	uniforms: {
		"map" : { type: "t", value: null },
		"step" : { type: "v2", value: new THREE.Vector2() },
		"intensity" : { type: "f", value: 1.0 },
		"decay" : { type: "f", value: 0.95 }
	},

	vertexShader: [
		"varying vec2 vUv;",

		"void main() {",
			"vUv = uv;",
    		"gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0 );",
    	"}"
	].join("\n"),

	fragmentShader: [
		"#define steps 20",
		"#define stepsf 20.0",
		"varying vec2 vUv;",
		"uniform sampler2D map;",
		"uniform vec2 step;",
		"uniform float intensity;",
		"uniform float decay;",

		"void main() {",
			"vec3 col = vec3(0.0);",
			"vec2 uv = vUv.xy;",
			"float s = 1.0;",
			/*
			"if( 0.0 <= steps ) col += texture2D(map, uv).rgb;",
			"uv += step;",
			
			"if( 1.0 <= steps ) col += texture2D(map, uv).rgb;",
			"uv += step;",

			"if( 2.0 <= steps ) col += texture2D(map, uv).rgb;",
			"uv += step;",

			"if( 3.0 <= steps ) col += texture2D(map, uv).rgb;",
			"uv += step;",

			"if( 4.0 <= steps ) col += texture2D(map, uv).rgb;",
			"uv += step;",

			"if( 5.0 <= steps ) col += texture2D(map, uv).rgb;",
			//"uv += step;",
			*/
			"for(int i = 0; i < steps ; i++) {",
				"col += texture2D(map, uv).rgb * s;",
				"uv += step;",
				"s *= decay;",
			"}",
			"gl_FragColor = clamp(vec4(col / stepsf * intensity, 1.0), 0.0, 1.0);",
		"}"


	].join("\n")
};