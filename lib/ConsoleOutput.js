var colors = require('colors');
var clitable = require("cli-table");


var ConsoleOutput = function(){
    var me = {};
    me.print = function(sspage) {
        console.log("Site:            " + colors.cyan(sspage.getName()));
        console.log("Version:         " + colors.yellow(sspage.getVersion()));
        console.log("DefaultAdmin:    " + getDefaultAdminText(sspage));
        console.log("EmailLogging:    " + getEmailLoggingText(sspage));
        console.log("EnvironmentType: " + getEnvironmentText(sspage));
        console.log("Modules:         " + getModulesText(sspage));
        console.log("");
    }
    return me;
}

function getDefaultAdminText(sspage){
    var da = sspage.hasDefaultAdmin()
    if(sspage.hasDefaultAdmin()){
        return colors.red(da);
    }else{
        return colors.green(da);
    }
}

function getEmailLoggingText(sspage){
    var el = sspage.hasEmailLogging()
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
    }

    me.addPage = function(sspage){
        table.push(
            [sspage.getName(), sspage.getVersion(), sspage.hasDefaultAdmin(), sspage.hasEmailLogging(), sspage.getEnvironmentType(), sspage.getModules()]
        );
    }
    return me;
}

module.exports.ConsoleOutput = ConsoleOutput;
module.exports.ConsoleOutputTable = ConsoleOutputTable;