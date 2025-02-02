const rescale=1;
class Vector2{
  x=0;
  y=0;
  constructor(tx:number,ty:number){
    this.x=tx;
    this.y=ty;
  }
}
setup();
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
function drawVertexArray(){
  
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
  
  const vertexShader:WebGLShader=iniShader(wgl,wgl.VERTEX_SHADER,require("./vertex_shader.glsl"));
  const fragmentShader:WebGLShader=iniShader(wgl,wgl.FRAGMENT_SHADER,require("./fragment_shader.glsl"));
  const program=newProgram(wgl,vertexShader,fragmentShader);

  let positionAttributeLocation=wgl.getAttribLocation(program,'pos');
  let trueViewport=new Vector2(1,1);
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
  wgl.bufferData(wgl.ARRAY_BUFFER,new Float32Array(tespos),wgl.DYNAMIC_DRAW);

  wgl.useProgram(program);
  wgl.enableVertexAttribArray(positionAttributeLocation);

  wgl.bindBuffer(wgl.ARRAY_BUFFER,positionBuffer);
  wgl.vertexAttribPointer(positionAttributeLocation,2,wgl.FLOAT,false,0,0);

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
    wgl.uniformMatrix2fv(wgl.getUniformLocation(program,'transform'),false,[beat,0,0,beat]);
    a+=0.01;
    /*wgl.uniform1f(wgl.getUniformLocation(program,'a'),a);*/
    requestAnimationFrame(draw);
  }
  draw();
  return null;
}