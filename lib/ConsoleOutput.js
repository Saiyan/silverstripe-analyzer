var colors = require('colors');
var clitable = require("cli-table");
var output = require("./Output.js");
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
 * %cfgp Path to _config.php
 * %cfgy Path to _config/config.yml
 */
function ConsoleOutputFormat(format){
    var me = {};
    if(!format) format = _format_default;
    me.print = function(sspage) {
        var out = format
                    .replace(/%n/g,_EOL)
                    .replace(/%s/g,colors.cyan(sspage.getName()))
                    .replace(/%v/g,colors.yellow(sspage.getVersion()))
                    .replace(/%da/g,output.getDefaultAdminText(sspage))
                    .replace(/%el/g,output.getEmailLoggingText(sspage))
                    .replace(/%et/g,output.getEnvironmentText(sspage))
                    .replace(/%mo/g,output.getModulesText(sspage))
                    .replace(/%cfgp/g,sspage.getConfigPhpPath())
                    .replace(/%cfgy/g,sspage.getConfigYmlPath());
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