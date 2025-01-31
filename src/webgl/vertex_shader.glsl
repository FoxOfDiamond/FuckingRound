attribute vec4 pos;
uniform vec2 trueViewport;
uniform mat2 transform;
void main(){
    vec2 vec2Pos=vec2(pos.x,pos.y);
    vec2Pos=vec2Pos*transform;
    vec4 posTrans=vec4(vec2Pos.x,vec2Pos.y,0,0);
    gl_Position=pos;
    gl_Position.w=1.0/min(trueViewport.x,trueViewport.y);
}