precision mediump float;
uniform vec2 screenOff;
uniform vec2 trueViewportFrag;
vec2 trueCoord;
float mag2(vec2 x){
    return  (sqrt(x.x*x.x+x.y*x.y));
}
void main(){
    trueCoord.x=(gl_FragCoord.x-screenOff.x)/screenOff.y/trueViewportFrag.x;
    trueCoord.y=(gl_FragCoord.y-screenOff.y)/screenOff.x/trueViewportFrag.y;
    float dis=1.0-mag2(vec2(trueCoord.x,trueCoord.y));
    /*gl_FragColor=vec4(1.0-(trueCoord.x+trueCoord.y)/1.5,trueCoord.y*3.0,trueCoord.x*3.0,1.0);*/
    /* trans*/
    if (abs(trueCoord.y)<0.2){
        gl_FragColor=vec4(1.0,1.0,1.0,1.0);
    }else if (abs(trueCoord.y)<0.6){
        gl_FragColor=vec4(0.96, 0.66, 0.72, 1.0);
    }else{
        gl_FragColor=vec4(0.35, 0.8, 0.98, 1.0);
    }
    /* ace
    if (trueCoord.y>0.5){
        gl_FragColor=vec4(0.0, 0.0, 0.0, 1.0);
    }else if (trueCoord.y>0.0){
        gl_FragColor=vec4(0.64, 0.64, 0.64, 1.0);
    }else if (trueCoord.y>-0.5){
        gl_FragColor=vec4(1.0,1.0,1.0,1.0);
    }else{
        gl_FragColor=vec4(0.5, 0.0, 0.5, 1.0);
    }*/
}