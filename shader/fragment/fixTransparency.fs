#extension GL_OES_standard_derivatives : enable
 
precision highp float;
 
varying vec2 vUv;
uniform sampler2D texSampler;
uniform vec2 size;


void main(void) {
	vec2 factor = 1.0 / size;
	vec2 pixel = vUv * factor;
	vec4 color = texture2D(texSampler, vUv);
	/*
	vec4 neighbour;
	if(color.a == 0.0) {
		neighbour = texture2D(texSampler, pixel + vec2(factor.x, 0.0));
		if(neighbour.a > 0.0) {
			color.rgb = neighbour.rgb;
			gl_FragColor = color;
			return;
		}
	}
	*/
    
    gl_FragColor = color;
}
