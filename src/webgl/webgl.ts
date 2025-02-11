const assets:Map<string,any>=new Map<string,any>();
function importAll(r:any) {
  // @ts-ignore
  r.keys().forEach((key) => (assets.set(key,r(key))));
}
importAll(require.context("../assets"))
const rescale=1;
class Vector{
  private values:Array<number>=[];
  size=2;
  get x():number{
    return this.values[0];
  }
  set x(arg){
    this.values[0]=arg;
  }
  get y():number{
    return this.values[1];
  }
  set y(arg){
    this.values[1]=arg;
  }
  get z():number{
    return this.values[2];
  }
  set z(arg){
    this.values[2]=arg;
  }
  get w():number{
    return this.values[3];
  }
  set w(arg){
    this.values[3]=arg;
  }
  get components():Array<number>{
    return this.values;
  }
  toString():String{
    return this.values.toString();
  }
  dot(a:Vector):number{
    if (this.size==a.size){
      let out=0;
      for (let i=0;i<a.size;i++){
        out+=this.values[i]*a.values[i]
      }
      return out;
    }
    console.error("Invalid dot product");
    return null
  }
  constructor(tx:Array<number>|number=0,ty:number=0,tz?:number,tw?:number){
    if (typeof(tx)=="number"){
      this.x=tx;
      this.y=ty;
      if (tz){
        this.size=3;
        this.z=tz;
      }
      if (tw){
        this.size=4;
        this.w=tw;
      }
    }else if (tx instanceof Array){
      this.values=tx;
      this.size=tx.length
    }
  }
}
class Matrix{
  values:Array<Array<number>>=[[0,0]];
  get components():Array<number>{
    let out:Array<number>=[];
    for(let y=0;y<this.height;y++){
      for(let x=0;x<this.width;x++){
        out.push(this.values[y][x]);
      }
    }
    return out;
  }
  row(r:number):Vector{
    return new Vector(this.values[r]);
  }
  col(c:number):Vector{
    let out:Array<number>=[];
    for (let i=0;i<this.values.length;i++){
      out[i]=this.values[i][c]
    }
    return new Vector(out)
  }
  mult(a:Matrix):Matrix{
    if (a.height==this.width){
      let out:Array<Array<number>>=[];
      for(let y=0;y<this.height;y++){
        out[y]=[];
        for(let x=0;x<a.width;x++){
          out[y][x]=this.row(y).dot(a.col(x));
        }
      }
      return new Matrix(out);
    }
    console.error("Invalid matrix multiplication")
    return null
  }
  width:number;
  height:number;
  constructor(tval:Array<Array<number>>){
    this.height=tval.length
    this.width=tval[0].length
    this.values=tval
  }
}
function newProgram(wgl:WebGLRenderingContext,vertexShader:WebGLShader,fragmentShader:WebGLShader){
  let program:WebGLProgram=wgl.createProgram();
  wgl.attachShader(program,vertexShader);
  wgl.attachShader(program,fragmentShader);
  wgl.linkProgram(program);
  if(wgl.getProgramParameter(program,wgl.LINK_STATUS)){
    console.log("Program compilled");
    return program;
  }
  console.log("Something went wrong creating program...");
  wgl.deleteProgram(program);
  return null;
}
function iniShader(wgl:WebGLRenderingContext,shaderType:number,src:string):WebGLShader{
  let shader:WebGLShader=wgl.createShader(shaderType);
  wgl.shaderSource(shader,src);
  wgl.compileShader(shader);
  if(wgl.getShaderParameter(shader,wgl.COMPILE_STATUS)){
    console.log("Shader compilled");
    return shader;
  }
  console.log("Something went wrong creating shader...");
  wgl.deleteShader(shader);
  return null;
}
async function loadImage(path:string){
  return new Promise<HTMLImageElement>((resolve,reject)=>{
    let img=new Image();
    img.onload=()=>resolve(img);
    img.onerror=()=>reject;
    img.src=assets.get(path);
  })
}
async function setup():Promise<null>{
  const canvas:HTMLCanvasElement=document.querySelector("#main_canvas");
  const wgl:WebGLRenderingContext=canvas.getContext("webgl");
  if (wgl == null) {
      alert(
        "webgl not supported, odd",
      );
      return;
  }
  
  const vertexShader:WebGLShader=iniShader(wgl,wgl.VERTEX_SHADER,assets.get("./shaders/vertex_shader.glsl"));
  const fragmentShader:WebGLShader=iniShader(wgl,wgl.FRAGMENT_SHADER,assets.get("./shaders/fragment_shader.glsl"));
  const program=newProgram(wgl,vertexShader,fragmentShader);

  let positionAttributeLocation=wgl.getAttribLocation(program,'pos');
  let trueViewport=new Vector(1,1);
  function fit(){
    let cont:HTMLDivElement=document.querySelector("#canvas_container");
    const w=window.visualViewport.width-9;
    const h=window.visualViewport.height-9;
    cont.style.width=w+'px';
    cont.style.height=h+'px';
    
    let canv:HTMLCanvasElement=document.querySelector("#main_canvas");
    canv.width=w;
    canv.height=h;
    const max=Math.max(w,h);
    wgl.viewport((w-max)/2,(h-max)/2,max,max);

    wgl.uniform2f(wgl.getUniformLocation(program,'screenOff'),w/2,h/2);
    wgl.uniform2f(wgl.getUniformLocation(program,'trueViewport'),trueViewport.x,trueViewport.y);
    wgl.uniform2f(wgl.getUniformLocation(program,'trueViewportFrag'),trueViewport.x,trueViewport.y);
    if (max==w){
      trueViewport.x=1;
      trueViewport.y=h/max;
    }else{
      trueViewport.y=1;
      trueViewport.x=w/max;
    }
  }
  window.visualViewport.onresize=(event)=>{
    fit();
  };  

  let positionBuffer=wgl.createBuffer();
  wgl.bindBuffer(wgl.ARRAY_BUFFER,positionBuffer);

  var tespos=[
    /*heart*/
    -1,0,
    1,0,
    0,-1,

    -1,0,
    1,0,
    -1,0.5,

    -1,0.5,
    1,0.5,
    1,0,

    -1,0.5,
    -0.5,1,
    0,0.5,

    0,0.5,
    0.5,1,
    1,0.5,
    
   /*triangle*/
   0.5,0.5,
   0.5,0.6,
   0.4,0.6,
   
  ];

  wgl.useProgram(program);
  wgl.enableVertexAttribArray(positionAttributeLocation);

  wgl.bindBuffer(wgl.ARRAY_BUFFER,positionBuffer);
  wgl.vertexAttribPointer(positionAttributeLocation,2,wgl.FLOAT,false,0,0);

  let img=await loadImage("./textures/mask.png");
  let texture=wgl.createTexture();
  let texturePointer=wgl.getUniformLocation(program,"texture");
  wgl.bindTexture(wgl.TEXTURE_2D,texture)
  wgl.texImage2D(wgl.TEXTURE_2D,0,wgl.RGBA,wgl.RGBA,wgl.UNSIGNED_BYTE,img);
  wgl.generateMipmap(wgl.TEXTURE_2D);
  wgl.uniform1i(texturePointer,0);

  wgl.bufferData(wgl.ARRAY_BUFFER,new Float32Array(tespos),wgl.STATIC_DRAW);

  fit();
  let a=0;

  function draw(){
    wgl.clearColor(0.3,0,0,1);
    wgl.clear(wgl.COLOR_BUFFER_BIT);
    wgl.drawArrays(wgl.TRIANGLES,0,tespos.length/2);
    const expo=10;
    const beat=0.85+Math.pow(expo,Math.sin(Date.now()/80))*0.15/expo;
    const rot=Math.PI/2;
    const rx=Math.cos(rot);
    const ry=Math.sin(rot);
    const scaleMatrix=new Matrix([[beat,0],[0,beat]]);
    const rotMatrix=new Matrix([[Math.cos(a),-Math.sin(a)],[Math.sin(a),Math.cos(a)]]); 
    const transMatrix=rotMatrix.mult(scaleMatrix);
    wgl.uniformMatrix2fv(wgl.getUniformLocation(program,'transform'),false,transMatrix.components); 
    
    const TrotMatrix=new Matrix([[Math.cos(-a),-Math.sin(a)],[Math.sin(a),Math.cos(a)]]); 
    wgl.uniformMatrix2fv(wgl.getUniformLocation(program,'textureTransform'),false,TrotMatrix.components); 

    a+=0.01;
    requestAnimationFrame(draw);
  }
  draw();
  return null;
}
window.onload=()=>{
  setup();
};