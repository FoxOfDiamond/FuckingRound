//Check your current dependencies and adding them into install.bat. Run after installing or removing any dependencies
const esync=require('child_process').execSync

const output=esync('npm list',{encoding:'utf-8'})
const dependencies=output.match(/(?<= )(.*)(?=@)/g)
const command="npm install "+dependencies.join(" ")
console.log("----------- New command -----------")
console.log(command)
console.log("-----------------------------------")
const fs=require("fs")
fs.writeFileSync("install.bat",command)