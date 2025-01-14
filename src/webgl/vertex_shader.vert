attribute vec4 pos;
uniform vec2 trueViewport;
uniform mat2 transform;
uniform float a;
void main(){
    mat2 posMatrix;
    posMatrix[0][0]=pos.x;
    posMatrix[1][0]=pos.y;
    mat2 posTransMatrix=posMatrix*transform;
    vec4 posTrans=vec4(posTransMatrix[0][0],posTransMatrix[1][0],0,0);
    gl_Position=pos;
    gl_Position.x=posTrans.x*cos(a)+posTrans.y*sin(a);
    gl_Position.y=-posTrans.x*sin(a)+posTrans.y*cos(a);
    gl_Position.w=1.0/min(trueViewport.x,trueViewport.y);
}