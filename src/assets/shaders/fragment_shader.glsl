precision mediump float;
uniform vec2 screenOff;
uniform vec2 trueViewportFrag;
uniform mat2 textureTransform;
uniform sampler2D texture;
const float asize=8.0;
float mag2(vec2 x){
    return  (sqrt(x.x*x.x+x.y*x.y));
}
void main(){
    vec2 trueCoord;
    vec2 textCord;  

    trueCoord.x=(gl_FragCoord.x-screenOff.x)/screenOff.y/trueViewportFrag.x;
    trueCoord.y=(gl_FragCoord.y-screenOff.y)/screenOff.x/trueViewportFrag.y;
    float dis=1.0-mag2(vec2(trueCoord.x,trueCoord.y));
    textCord=vec2(0.5)+(trueCoord*textureTransform)/2.0;

    vec4 thisPixel=texture2D(texture,textCord);
    for(float x = -asize; x <= asize; x+=1.0) {
        for(float y = -asize; y <= asize; y+=1.0) {
            vec2 tempCord;
            tempCord.x=(gl_FragCoord.x+x-screenOff.x)/screenOff.y/trueViewportFrag.x;
            tempCord.y=(gl_FragCoord.y+y-screenOff.y)/screenOff.x/trueViewportFrag.y;
            tempCord=vec2(0.5)+(tempCord*textureTransform)/2.0;
            if (any(notEqual(thisPixel,texture2D(texture,tempCord)))){
                if (trueCoord.y>0.6){
                    gl_FragColor=vec4(0.0, 0.0, 0.0, 1.0);
                }else if (trueCoord.y>0.2){
                    gl_FragColor=vec4(0.66,0.66,0.66, 1.0);
                }else if (trueCoord.y>-0.2){
                    gl_FragColor=vec4(1.0,1.0,1.0,1.0);
                }else if (trueCoord.y>-0.6){
                    gl_FragColor=vec4(0.82, 0.5, 0.82, 1.0);
                }else{
                    gl_FragColor=vec4(0.5, 0.0, 0.5, 1.0);
                }
                return;
            }
        }    
    }
    if(thisPixel.r>0.0){
        if (abs(trueCoord.y)<0.2){
            gl_FragColor=vec4(1.0,1.0,1.0,1.0);
        }else if (abs(trueCoord.y)<0.6){
            gl_FragColor=vec4(0.96, 0.66, 0.72, 1.0);
        }else{
            gl_FragColor=vec4(0.35, 0.8, 0.98, 1.0);
        }
    }else{   
        if (trueCoord.y>0.6){
            gl_FragColor=vec4(0.23, 0.68, 0.2, 1);
        }else if (trueCoord.y>0.2){
            gl_FragColor=vec4(0.65, 0.82, 0.5, 1.0);
        }else if (trueCoord.y>-0.2){
            gl_FragColor=vec4(1.0,1.0,1.0,1.0);
        }else if (trueCoord.y>-0.6){
            gl_FragColor=vec4(0.66,0.66,0.66,1.0);
        }else{
            gl_FragColor=vec4(0.0, 0.0, 0.0, 1.0);
        }
    }
}