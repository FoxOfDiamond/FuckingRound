cont=document.querySelector("#canvas_container");
function fit(){
    cont.style.width=window.visualViewport.width-9+'px';
    cont.style.height=window.visualViewport.height-9+'px';
}
window.visualViewport.onresize=(event)=>{
    fit();
};
fit();