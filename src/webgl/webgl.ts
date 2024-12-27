const rescale=1;
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
async function setup(){
  const canvas:HTMLCanvasElement=document.querySelector("#main_canvas");
  const wgl:WebGLRenderingContext=canvas.getContext("webgl");
  if (wgl == null) {
      alert(
        "webgl not supported, odd",
      );
      return;
  }
  let vertexShaderSrc:HTMLDivElement=document.querySelector("#vertex_shader");
  let fragmentShaderSrc:HTMLDivElement=document.querySelector("#fragment_shader");
  
  const vertexShader:WebGLShader=iniShader(wgl,wgl.VERTEX_SHADER,vertexShaderSrc.innerText);
  const fragmentShader:WebGLShader=iniShader(wgl,wgl.FRAGMENT_SHADER,fragmentShaderSrc.innerText);
  const program=newProgram(wgl,vertexShader,fragmentShader);

  let attLoc=wgl.getAttribLocation(program,'pos');
  let ssLoc=wgl.getUniformLocation(program,'screenSize');
  let soLoc=wgl.getUniformLocation(program,'screenOff');
  
  function fit(){
    let cont:HTMLDivElement=document.querySelector("#canvas_container");
    const w=window.visualViewport.width-9;
    const h=window.visualViewport.height-9;
    cont.style.width=w+'px';
    cont.style.height=h+'px';
    
    let canv:HTMLCanvasElement=document.querySelector("#main_canvas");
    canv.width=w;
    canv.height=h;
    const min=Math.min(w,h);
    wgl.viewport((w-min)/2,(h-min)/2,min,min);

    wgl.uniform1f(ssLoc,min/2);
    wgl.uniform1fv(soLoc,[(w/2),(h/2)]);
  }
  window.visualViewport.onresize=(event)=>{
    fit();
  };  

  let positionBuffer=wgl.createBuffer();
  wgl.bindBuffer(wgl.ARRAY_BUFFER,positionBuffer);

  var tespos=[
    0,0,
    1,0,
    0,1,
    0,0,
    -1,0,
    0,-1,
    0,0,
    1,0,
    0,-1,
    0,0,
    -1,0,
    0,1,
  ];
  wgl.bufferData(wgl.ARRAY_BUFFER,new Float32Array(tespos),wgl.DYNAMIC_DRAW);

  wgl.clearColor(0,0,0,1);
  wgl.clear(wgl.COLOR_BUFFER_BIT);
  wgl.useProgram(program);
  wgl.enableVertexAttribArray(attLoc);

  wgl.bindBuffer(wgl.ARRAY_BUFFER,positionBuffer);
  wgl.vertexAttribPointer(attLoc,2,wgl.FLOAT,false,0,0);

  fit();

  function draw(){
    wgl.clearColor(0,0,0,1);
    wgl.clear(wgl.COLOR_BUFFER_BIT);
    wgl.drawArrays(wgl.TRIANGLES,0,tespos.length/2);
    requestAnimationFrame(draw);
  }
  draw();
  return null;
}