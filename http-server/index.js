const http = require("http");
const fs = require("fs");
const args=require("minimist")(process.argv.slice(2));

let homeContent = "";
let projectContent = "";
let responseContent="";
fs.readFile("home.html", (err, home) => {
  if (err) {
    throw err;
  }
  homeContent = home;
});

fs.readFile("registration.html",(err,res)=>{
    if(err){
        throw err;
    }
    responseContent=res;
});

fs.readFile("project.html", (err, project) => {
  if (err) {
    throw err;
  }
  projectContent = project;
});

http
  .createServer((request, response) => {
    let url = request.url;
    response.writeHeader(200, { "Content-Type": "text/html" });
    switch (url) {
        case "/project":
            response.write(projectContent);
            response.end();
            break;
        case "/registration":
            response.write(responseContent);
            response.end();
            break;
        default:
            response.write(homeContent);
            response.end();
            break;
    }
  })
  .listen(args.port);