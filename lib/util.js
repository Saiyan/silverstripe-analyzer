var sspage = require("./SilverstripePage");
var ConsoleOutput = require("./ConsoleOutput");
var fs = require("fs");

var _SITES;
var CFGFILE = "sites.json";

exports.getConfigPath = function(){
    return CFGFILE;
};

exports.addSite = function(sitename, projectpath) {
    var siteexists = false;
    if (!_SITES) {
        _SITES = [];
    }
    _SITES.map(function (i) {
        if (i.name === sitename) {
            siteexists = true;
        }
    });
    if (!siteexists) {
        _SITES.push({
            name: sitename,
            path: projectpath
        });
        console.log("Site added: " + sitename);
        return true;
    } else {
        console.log("Site with that name already exists: " + sitename);
    }
    return false;
};

exports.writeSites = function() {
    exports.writeFileContent(exports.getConfigPath(), JSON.stringify(_SITES, null, 4));
};

exports.removeSite = function(sitename) {
    var siteindex = -1;
    if (!_SITES) {
        _SITES = [];
    }

    for (var i in _SITES) {
        if (_SITES[i].name === sitename) {
            siteindex = i;
        }
    }
    if (siteindex) {
        _SITES.splice(siteindex, siteindex + 1);
        console.log("Site removed: " + sitename);
        return true;
    } else {
        console.log("Site with that did not exist: " + sitename);
    }
    return false;
};

exports.printSites = function(format) {
    var isTable,output,site,page;
    if (!_SITES.length) {
        console.log("No sites found. Add sites with: node analyzer add NAME PATH");
        return;
    }
    output = ConsoleOutput.ConsoleOutputFormat(format);

    if (process.argv.indexOf("--table") > 1) {
        isTable = true;
    }

    if (isTable) {
        output = ConsoleOutput.ConsoleOutputTable(exports.findColumns());
    }

    for (var i = 0; i < _SITES.length; i++) {
        try {
            site = _SITES[i];
            page = sspage.create(site);
        }catch(err){
            console.log(err);
            continue;
        }
        if (isTable) {
            output.addPage(page);
        } else {
            output.print(page);
        }
    }

    if (isTable) {
        output.print();
    }
};

exports.findColumns = function() {
    return findArgsValue(/^--table-columns=/);
};

exports.findFormat = function() {
    return findArgsValue(/^--format=/);
};

exports.filterSites = function() {
    process.argv.forEach(function (e) {
        if (e.search(/^--filter-name=/) > -1) {
            var filterName = e.replace(/^--filter-name=/, "");
            for (var i = 0; i < _SITES.length;i++) {
                if (_SITES[i].name.search(filterName) == -1) {
                    delete _SITES[i];
                }
            }
        }

    });
};

exports.readFileContents = function(path,options){
    try{
        return fs.readFileSync(path,options);
    }catch(err){
        if(err.code === 'ENOENT'){
            throw new Error('File not found! ('+path+')');
        }else{
            throw err;
        }
    }
};

exports.writeFileContent = function(path,content,options){
    try{
        fs.writeFileSync(path, content,options);
    }catch(err){
        throw err;
    }
};

exports.stripPhpComments = function(strng) {
    return strng.replace(/\/\*[^\Z]*\*\//gm, "").replace(/\/\/.*/gm, "");
};

function findArgsValue(regex){
    var val = "";
    process.argv.forEach(function (e) {
        if (e.search(regex) > -1) {
            val = e.replace(regex, "");
        }
    });
    return val;
}

_SITES = JSON.parse(exports.readFileContents(exports.getConfigPath()));