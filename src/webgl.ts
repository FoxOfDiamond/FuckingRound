setup();
function newProgram(wgl:WebGLRenderingContext,vertexShader:WebGLShader,fragmentShader:WebGLShader){
  let program=wgl.createProgram();
  wgl.attachShader(program,vertexShader);
  wgl.attachShader(program,fragmentShader);
  wgl.linkProgram(program);
  return program;
}
function iniShader(wgl:WebGLRenderingContext,shaderType:number,src:string):WebGLShader{
  let shader:WebGLShader=wgl.createShader(shaderType);
  wgl.shaderSource(shader,src);
  wgl.compileShader(shader);
  return shader;
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
  console.log(fragmentShaderSrc);
  const vertexShader:WebGLShader=iniShader(wgl,wgl.VERTEX_SHADER,vertexShaderSrc);
  const fragmentShader:WebGLShader=iniShader(wgl,wgl.FRAGMENT_SHADER,fragmentShaderSrc);
  const program=newProgram(wgl,vertexShader,fragmentShader);
  return null;
}