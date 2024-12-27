setup();
function newProgram(wgl:WebGLRenderingContext,vertexShader:WebGLShader,fragmentShader:WebGLShader){
  let program=wgl.createProgram();
  wgl.attachShader(program,vertexShader);
  wgl.attachShader(program,fragmentShader);
  wgl.linkProgram(program);
  console.log(wgl.getProgramParameter(program,wgl.LINK_STATUS));
  console.log(wgl.validateProgram(program));
  return program;
}
function iniShader(wgl:WebGLRenderingContext,shaderType:number,src:string):WebGLShader{
  let shader:WebGLShader=wgl.createShader(shaderType);
  wgl.shaderSource(shader,src);
  wgl.compileShader(shader);
  return shader;
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
  let vertexShaderSrc:string;
  let fragmentShaderSrc:string;
  
  const vertexShader:WebGLShader=iniShader(wgl,wgl.VERTEX_SHADER,vertexShaderSrc);
  const fragmentShader:WebGLShader=iniShader(wgl,wgl.FRAGMENT_SHADER,fragmentShaderSrc);
  const program=newProgram(wgl,vertexShader,fragmentShader);

  let attLoc=wgl.getAttribLocation(program,'pos');
  let positionBuffer=wgl.createBuffer();
  wgl.bindBuffer(wgl.ARRAY_BUFFER,positionBuffer);

  var tespos=[
    0,0,
    1,0,
    0,1
  ];
  wgl.bufferData(wgl.ARRAY_BUFFER,new Float32Array(tespos),wgl.DYNAMIC_DRAW);
  wgl.viewport(0,0,10,10);
  wgl.clearColor(0,0,0,1);
  wgl.clear(wgl.COLOR_BUFFER_BIT);
  wgl.useProgram(program);
  wgl.enableVertexAttribArray(attLoc);

  wgl.bindBuffer(wgl.ARRAY_BUFFER,positionBuffer);
  wgl.vertexAttribPointer(attLoc,2,wgl.FLOAT,false,0,0);

  wgl.drawArrays(wgl.TRIANGLES,0,3);

  return null;
}