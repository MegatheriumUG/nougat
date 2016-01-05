#extension GL_OES_standard_derivatives : enable
 
precision highp float;
 
varying vec2 vUv;
uniform sampler2D texSampler;
uniform vec2 size;
uniform vec2 repeat;
uniform vec2 offset;
uniform vec4 color;
uniform float opacity;


void main(void) {
    // here, k=0.7
    //vec2 alpha = 0.7*vec2(dFdx(vUv.x), dFdy(vUv.y));
    const float alpha = 0.1;
    vec2 x = fract(vUv);
    vec2 x_ = clamp(0.5/alpha*x, 0.0, 0.5) +
              clamp(0.5/alpha*(x-1.0)+0.5, 0.0, 0.5);
    vec4 clr = texture2D(texSampler, (floor(vUv) + x_)/size * repeat + offset);
    clr.a *= opacity;
    if(clr.a == 0.0) discard;
    
    gl_FragColor = clr * color;
}
