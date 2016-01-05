varying vec2 vUv;
uniform vec2 size;
 
void main()
{
    vUv = uv * size;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix
                  * vec4(position, 1.0 );
}