const fs=require('fs')
const hdata=fs.readFileSync("src/index.html")
const aldir=fs.readdirSync("src",{"recursive":true});
for (let i=0;i<aldir.length;i++){
    aldir[i]=aldir[i].replaceAll(/\\/g,"/");
    aldir[i]={"name":aldir[i].substring(aldir[i].lastIndexOf('/')+1),"path":aldir[i]};
}
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
    if(fname[0]=="*"){
        fname=fname.substring(2);
        let fdir=aldir.find(val=>{return val.name==fname});
        if(fdir){
            fdir=fdir.path;
            console.log("File '"+fname+"' found at '"+fdir+"'");
            fname=fdir;
        }else{
            console.log("File '"+fname+"' not found");
            continue;
        }
    }
    console.log("Compiling '"+fname+"'...");
    hIndex=nindex+1;
    let sdata;
    if(fname.substring(fname.length-3)==".ts"){
        fs.mkdirSync("compiled/"+fname.substring(0,fname.lastIndexOf('/')),{"recursive":true});
        if(process.argv.indexOf("-p")>0){
            sdata=fs.readFileSync("src/"+fname).toString();
            sdata=sdata.replaceAll(/:(.*?)(?=[;=,){])/gm,"");
            fs.writeFileSync("compiled/"+fname.substring(0,fname.length-2)+"js",sdata);
            console.log(fname+" manually compiled as compiled/"+fname.substring(0,fname.length-2)+"js");
        }else{
            require('child_process').execSync("npx tsc src/"+fname+" --outfile compiled/"+fname.substring(0,fname.length-2)+"js",{encoding:'utf-8'});
            console.log(fname+" compiled as compiled/"+fname.substring(0,fname.length-2)+"js");
            sdata=fs.readFileSync("compiled/"+fname.substring(0,fname.length-2)+"js").toString()
        }
    }else{
        sdata=fs.readFileSync("src/"+fname).toString()
        console.log(fname+" compiled into main");
    };
    
    hIndex=raw.indexOf(">",hIndex);
    nindex=raw.indexOf("<",hIndex+1);

    sdata=sdata.replaceAll(/[\n\r\t]/gm, " ");
    sdata=sdata.replaceAll(/( )\1{1,}/gm," ");
    raw=raw.substring(0,hIndex+1)+sdata+raw.substring(nindex);
}
fs.writeFileSync("compiled/compiled_webapp.html",raw);
console.log("Success!");
if(process.argv.indexOf("-o")>0){
    console.log("Opening file...");
    require('child_process').exec('start ' + __dirname+"\\compiled\\compiled_webapp.html");
}
