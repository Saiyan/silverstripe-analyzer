var sspage = require("./lib/SilverstripePage");
var ConsoleOutput = require("./lib/ConsoleOutput.js");
var fs = require("fs");
var page,site;


var cout = ConsoleOutput.ConsoleOutput();
var couttable = ConsoleOutput.ConsoleOutputTable();
var sites = JSON.parse(fs.readFileSync("sites.json"));
for (var i in sites) {
    site = sites[i];
    page = sspage.create(site);

    if(process.argv.indexOf("--table") > 1){
        couttable.addPage(page);
    }else {
        cout.print(page);
    }
}

if(process.argv.indexOf("--table") > 1)
    couttable.print();