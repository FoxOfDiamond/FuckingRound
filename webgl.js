setup();

function setup(){
    /**
    * 
    * @type {HTMLCanvasElement}canvas
    */
    const canvas=document.getElementById("main_canvas");
    const wgl=canvas.getContext("webgl");
    if (wgl == null) {
        alert(
          "webgl not supported, odd",
        );
        return;
    }
    wgl.clearColor(0,0,0,1);
    wgl.clear(wgl.COLOR_BUFFER_BIT);
}