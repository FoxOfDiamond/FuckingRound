console.log(require('child_process').execSync('npx tsc src/webgl/webgl.ts --outfile compiled/compiled_webgl.js',{encoding:'utf-8'}));
const fs=require('fs')
const hdata=fs.readFileSync("src/index.html")
let raw=hdata.toString();
let hIndex=0;
while (true){
    hIndex=raw.indexOf("compilerSrc",hIndex);
    if (hIndex==-1){
        break;
    }
    hIndex++;
    hIndex=raw.indexOf("\"",hIndex);
    if (hIndex==-1){
        console.error("Invalid html");
        return;
    }
    hIndex++;
    let nindex=raw.indexOf("\"",hIndex);
    let fname=raw.substring(hIndex,nindex);
    console.log("Compiling '"+fname+"'...");
    hIndex=nindex+1;

    let sdata=fs.readFileSync("src/"+fname);
    hIndex=raw.indexOf(">",hIndex);
    nindex=raw.indexOf("<",hIndex+1);

    let sdpar=sdata.toString()
    sdpar=sdpar.replaceAll(/[\n\r\t]/gm, " ");
    sdpar=sdpar.replaceAll(/( )\1{1,}/gm," ");
    raw=raw.substring(0,hIndex+1)+sdpar+raw.substring(nindex,raw.length);
}
fs.writeFileSync("compiled/compiled_webapp.html",raw);
console.log("Success!");
console.log(process.argv);
if(process.argv.indexOf("o")>0){
    console.log("Opening file...");
    require('child_process').exec('start ' + __dirname+"\\compiled\\compiled_webapp.html");
}