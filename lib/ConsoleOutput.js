var colors = require('colors');
var clitable = require("cli-table");
var output = require("./Output.js");

/*
 * Format:
 * %n Newline
 * %s Sitename
 * %v Version
 * %da DefaultAdmin
 * %el EmailLogging
 * %et EnvironmentType
 * %mo Modules
 * %cfgp Path to _config.php
 * %cfgy Path to _config/config.yml
 */
function ConsoleOutputFormat(format){
    var me = {};
    if(!format) var format = null;
    me.print = function(sspage) {
        var out = output.formatSSPage(sspage,format);
        console.log(out);
    };
    return me;
}

function ConsoleOutputTable(cols) {
    var me = {};
    var columns = cols ? cols : "%s%v%da%el%et";

    var table = new clitable({
        head: output.getHeadFromColumns(columns),
        style : {compact : true}
    });

    me.print = function () {
        console.log(table.toString());
    };

    me.addPage = function(sspage){
        table.push(
            output.getRowFromColumns(columns,sspage)
        );
    };

    return me;


};

module.exports.ConsoleOutputFormat = ConsoleOutputFormat;
module.exports.ConsoleOutputTable = ConsoleOutputTable;