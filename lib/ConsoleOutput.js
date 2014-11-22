var colors = require('colors');
var clitable = require("cli-table");
var _EOL = require('os').EOL;
var _format_default = "Site:            %s%n"
                    +"Version:         %v%n"
                    +"DefaultAdmin:    %da%n"
                    +"EmailLogging:    %el%n"
                    +"EnvironmentType: %et%n"
                    +"Modules:         %mo%n";

/*
 * Format:
 * %n Newline
 * %s Sitename
 * %v Version
 * %da DefaultAdmin
 * %el EmailLogging
 * %et EnvironmentType
 * %mo Modules
 */
function ConsoleOutputFormat(format){
    var me = {};
    if(!format) format = _format_default;
    me.print = function(sspage) {
        var out = format
                    .replace(/%n/g,_EOL)
                    .replace(/%s/g,colors.cyan(sspage.getName()))
                    .replace(/%v/g,colors.yellow(sspage.getVersion()))
                    .replace(/%da/g,getDefaultAdminText(sspage))
                    .replace(/%el/g,getEmailLoggingText(sspage))
                    .replace(/%et/g,getEnvironmentText(sspage))
                    .replace(/%mo/g,getModulesText(sspage));
        console.log(out);
    };
    return me;
}

function getDefaultAdminText(sspage){
    var da = sspage.hasDefaultAdmin();
    if(sspage.hasDefaultAdmin()){
        return colors.red(da);
    }else{
        return colors.green(da);
    }
}

function getEmailLoggingText(sspage){
    var el = sspage.hasEmailLogging();
    if(sspage.hasEmailLogging()){
        return colors.green(el);
    }else{
        return colors.red(el);
    }
}

function getEnvironmentText(sspage){
    var et = sspage.getEnvironmentType();

    if(et === 'live')
        return colors.green(et);
    else
        return colors.red(et);
}

function getModulesText(sspage){
    return sspage.getModules().join(', ');
}

var ConsoleOutputTable = function() {
    var me = {};
    var table = new clitable({
        head: ["Site", "Version", "DefaultAdmin", "EmailLogging", "EnvironmentType", "Modules"],
        style : {compact : true}
    });

    me.print = function () {
        console.log(table.toString());
    };

    me.addPage = function(sspage){
        table.push(
            [sspage.getName(), sspage.getVersion(), sspage.hasDefaultAdmin(), sspage.hasEmailLogging(), sspage.getEnvironmentType(), sspage.getModules()]
        );
    };
    return me;
};

module.exports.ConsoleOutputFormat = ConsoleOutputFormat;
module.exports.ConsoleOutputTable = ConsoleOutputTable;