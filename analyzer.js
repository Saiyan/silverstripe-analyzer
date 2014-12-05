var util = require("./lib/util");
var fs = require("fs");
var path = require("path");
global.appRoot = path.resolve(__dirname);

if(!util) return;

if(process.argv.indexOf('--debug') > 1)
    process.__DEBUG = true;

if(!fs.existsSync(util.getConfigPath())){
    util.writeFileContent(util.getConfigPath(),'[]');
}

if(process.argv[2] === "add") {
    if(process.argv[3] && process.argv[4]){
        if(util.addSite(process.argv[3],process.argv[4])){
            util.writeSites();
        }
    }
    return;
}

if(process.argv[2] === "remove" && process.argv[3]){
    if(util.removeSite(process.argv[3])){
        util.writeSites();
    }
    return;
}

util.filterSites();
util.printSites(util.findFormat());


