precision mediump float;
uniform float screenSize;
uniform float screenOff[2];
float tempx;
float tempy;
float mag2(vec2 x){
    return  (sqrt(x.x*x.x+x.y*x.y));
}
/*
    notes for ellie: float only accepts floats! use '2.0', '2' will cause a compile failure. 
    Also use multiline comments only due to how the compiler is coded
*/
vec3 rainbow(float x)
{
	float level = floor(x * 6.0);
	float r = float(level <= 2.0) + float(level > 4.0) * 0.5;
	float g = max(1.0 - abs(level - 2.0) * 0.5, 0.0);
	float b = (1.0 - (level - 4.0) * 0.5) * float(level >= 4.0);
	return vec3(r, g, b);
}
void main(){
    /*tempx=(gl_FragCoord.x-screenOff[0])/screenSize;
    tempy=(gl_FragCoord.y-screenOff[1])/screenSize;
    float dis=1.0-mag2(vec2(tempx,tempy));
    gl_FragColor=vec4(dis,dis/2.5,0.0,1.0);
    
    fox gradient ^
    gay gradient v
    */
    tempx=(gl_FragCoord.x-screenOff[0]/2.0)/screenSize;
    gl_FragColor=vec4(rainbow(tempx),1.0);
}