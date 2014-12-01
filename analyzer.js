var sspage = require("./lib/SilverstripePage");
var ConsoleOutput = require("./lib/ConsoleOutput.js");
var fs = require("fs");
var _SITES;
var __CFGFILE = "sites.json";

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

filterSites();
printSites(findFormat());


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
        fs.writeFileSync(__CFGFILE, JSON.stringify(_SITES,null,4));
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
        fs.writeFileSync(__CFGFILE, JSON.stringify(_SITES,null,4));
        console.log("Site removed: "+sitename);
    }else{
        console.log("Site with that did not exist: "+sitename);
    }
}

function printSites(format){
    if(!_SITES.length){
        console.log("No sites found. Add sites with: node analyzer add NAME PATH");
    }
    if(process.argv.indexOf("--table") > 1)
        var isTable = true;

    if(isTable) {
        var couttable = ConsoleOutput.ConsoleOutputTable(findColumns());
    }

    for (var i in _SITES) {
        var site = _SITES[i];
        var page = sspage.create(site);
        if(!page)continue;

        if(isTable){
            couttable.addPage(page);
        }else {
            var coutformat = ConsoleOutput.ConsoleOutputFormat(format);
            coutformat.print(page);
        }
    }

    if(isTable)
        couttable.print();
}

function findColumns(){
    var format;
    process.argv.forEach(function(e){
        var rex = /^--table-columns=/;
        if(e.search(rex) > -1) {
            format = e.replace(rex,"");
        }
    });
    return format;
}

function findFormat(){
    var format;
    process.argv.forEach(function(e){
        var rex = /^--format=/;
        if(e.search(rex) > -1) {
            format = e.replace(rex,"");
        }
    });
    return format;
}

function filterSites(){
    process.argv.forEach(function(e){
        if(e.search(/^--filter-name=/) > -1) {
            var filterName = e.replace(/^--filter-name=/,"");
            for (var i in _SITES) {
                if(_SITES[i].name.search(filterName) == -1){
                    delete _SITES[i];
                }
            }
        }

    });
}