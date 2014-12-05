var colors = require('colors');
var _EOL = require('os').EOL;
var _format_default = "Site:            %s%n\
Version:         %v%n\
DefaultAdmin:    %da%n\
EmailLogging:    %el%n\
EnvironmentType: %et%n\
Modules:         %mo%n";

exports.getDefaultAdminText = function(sspage){
    var da = sspage.hasDefaultAdmin();
    if (sspage.hasDefaultAdmin()) {
        return colors.red(da);
    } else {
        return colors.green(da);
    }
};

exports.getEmailLoggingText = function(sspage) {
    var el = sspage.hasEmailLogging();
    if (sspage.hasEmailLogging()) {
        return colors.green(el);
    } else {
        return colors.red(el);
    }
};

exports.getEnvironmentText = function(sspage) {
    var et = sspage.getEnvironmentType();
    return et === 'live' ? colors.green(et) : colors.red(et);
};

exports.getModulesText = function(sspage) {
    return sspage.getModules().join(', ');
};


exports.getHeadFromColumns = function(columns) {
    return exports.getRowFromColumns(columns);
};

exports.getRowFromColumns = function(columns,sspage) {
    var matches = columns.match(/%s|%v|%da|%el|%et|%m|%cfgp|%cfgy+/g);
    var row = [];
    for (var m = 0; m < matches.length; m++) {
        var c = util.getCellFromPlaceholder(sspage,m);
        if(c) {
            row.push(c);
        }
    }
    return row;
};

exports.formatSSPage = function(sspage,format,asHtml){
    var eol = asHtml ? '<br/>' : _EOL;
    if(!format) {
        format = _format_default;
    }
    return format
        .replace(/%n/g,eol)
        .replace(/%s/g,colors.cyan(sspage.getName()))
        .replace(/%v/g,colors.yellow(sspage.getVersion()))
        .replace(/%da/g,exports.getDefaultAdminText(sspage))
        .replace(/%el/g,exports.getEmailLoggingText(sspage))
        .replace(/%et/g,exports.getEnvironmentText(sspage))
        .replace(/%mo/g,exports.getModulesText(sspage))
        .replace(/%cfgp/g,sspage.getConfigPhpPath())
        .replace(/%cfgy/g,sspage.getConfigYmlPath());
};