## Run the terminal command "node compile.js" to compile both the webgl.ts into browser-friendly js and embed all js files into the compiled html!
- You can also add custom embeds into the index.html file by adding the property 'compilerSrc=${filename}' into any tag, and the content of that file will be inserted into the tag when compiling the html
- adding the '-o' flag to the command opens the compiled html in the browser
- adding the '-p' flag disables the typescript compillation for testing compatibility
# Make sure to "npm install typescript" as well
