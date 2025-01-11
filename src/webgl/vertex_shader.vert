attribute vec4 pos;
uniform vec2 trueViewport;
void main(){
    gl_Position=pos;
    gl_Position.w=1.0/min(trueViewport.x,trueViewport.y);
}