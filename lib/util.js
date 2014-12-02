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
    if (!_SITES) _SITES = [];
    _SITES.map(function (i) {
        if (i.name == sitename) {
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
    fs.writeFileSync(exports.getConfigPath(), JSON.stringify(_SITES, null, 4));
};

exports.removeSite = function(sitename) {
    var siteindex = -1;
    if (!_SITES) _SITES = [];

    for (var i in _SITES) {
        if (_SITES[i].name == sitename) {
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
    if (!_SITES.length) {
        console.log("No sites found. Add sites with: node analyzer add NAME PATH");
        return;
    }
    if (process.argv.indexOf("--table") > 1)
        var isTable = true;

    if (isTable) {
        var couttable = ConsoleOutput.ConsoleOutputTable(exports.findColumns());
    }

    for (var i in _SITES) {
        var site = _SITES[i];
        var page = sspage.create(site);
        if (!page)continue;

        if (isTable) {
            couttable.addPage(page);
        } else {
            var coutformat = ConsoleOutput.ConsoleOutputFormat(format);
            coutformat.print(page);
        }
    }

    if (isTable)
        couttable.print();
};

exports.findColumns = function() {
    var columns;
    process.argv.forEach(function (e) {
        var rex = /^--table-columns=/;
        if (e.search(rex) > -1) {
            columns = e.replace(rex, "");
        }
    });
    return columns;
};

exports.findFormat = function() {
    var format;
    process.argv.forEach(function (e) {
        var rex = /^--format=/;
        if (e.search(rex) > -1) {
            format = e.replace(rex, "");
        }
    });
    return format;
};

exports.filterSites = function() {
    process.argv.forEach(function (e) {
        if (e.search(/^--filter-name=/) > -1) {
            var filterName = e.replace(/^--filter-name=/, "");
            for (var i in _SITES) {
                if (_SITES[i].name.search(filterName) == -1) {
                    delete _SITES[i];
                }
            }
        }

    });
};

exports.stripPhpComments = function(strng) {
    return strng.replace(/\/\*[^\Z]*\*\//gm, "").replace(/\/\/.*/gm, "");
};

try {
    _SITES = JSON.parse(fs.readFileSync(exports.getConfigPath()));
} catch (e) {
    console.log("Can't parse " + exports.getConfigPath());
};