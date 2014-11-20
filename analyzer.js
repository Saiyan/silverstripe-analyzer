var sspage = require("./lib/SilverstripePage");
var ConsoleOutput = require("./lib/ConsoleOutput.js");
var fs = require("fs");
var _SITES;
var __CFGFILE = "sites.json";
var cout = ConsoleOutput.ConsoleOutput();
var couttable = ConsoleOutput.ConsoleOutputTable();

if(process.argv.indexOf('--debug') > 1)
    process.__DEBUG = true;

if(!fs.existsSync(__CFGFILE)){
    fs.writeFileSync(__CFGFILE,'[]');
}

try{
    _SITES = JSON.parse(fs.readFileSync(__CFGFILE));
}catch(e){
    console.log("Can't parse "+__CFGFILE);
    return;
}

if(process.argv[2] === "add") {
    if(process.argv[3] && process.argv[4]){
        addSite(process.argv[3],process.argv[4]);
    }
    return;
}

if(process.argv[2] === "remove" && process.argv[3]){
    removeSite(process.argv[3]);
    return;
}


printSites();


/***********************************************************************/


function addSite(sitename,projectpath){
    var siteexists = false;
    if(!_SITES) _SITES = [];
    _SITES.map(function(i){
        if(i.name == sitename){
            siteexists = true;
        }
    });
    if(!siteexists) {
        _SITES.push({
            name: sitename,
            path: projectpath
        });
        fs.writeFileSync(__CFGFILE, JSON.stringify(_SITES));
        console.log("Site added: "+sitename);
    }else{
        console.log("Site with that name already exists: "+sitename);
    }
}

function removeSite(sitename){
    var siteindex = -1;
    if(!_SITES) _SITES = [];

    for(var i in _SITES){
        if(_SITES[i].name == sitename){
            siteindex = i;
        }
    }
    if(siteindex) {
        _SITES.splice(siteindex,siteindex+1);
        fs.writeFileSync(__CFGFILE, JSON.stringify(_SITES));
        console.log("Site removed: "+sitename);
    }else{
        console.log("Site with that did not exist: "+sitename);
    }
}

function printSites(){
    if(!_SITES.length){
        console.log("No sites found. Add sites with: node analyzer NAME PATH");
    }

    for (var i in _SITES) {
        var site = _SITES[i];
        var page = sspage.create(site);
        if(!page)continue;

        if(process.argv.indexOf("--table") > 1){
            couttable.addPage(page);
        }else {
            cout.print(page);
        }
    }

    if(process.argv.indexOf("--table") > 1)
        couttable.print();
}