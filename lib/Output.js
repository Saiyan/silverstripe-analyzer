var colors = require('colors');

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

    if (et === 'live')
        return colors.green(et);
    else
        return colors.red(et);
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
        switch (matches[m]) {
            case '%s':
                if (sspage)
                    row.push(sspage.getName());
                else
                    row.push("Site");
                break;
            case '%v':
                if (sspage)
                    row.push(sspage.getVersion());
                else
                    row.push("Version");
                break;
            case '%da':
                if (sspage)
                    row.push(sspage.hasDefaultAdmin());
                else
                    row.push("DefaultAdmin");
                break;
            case '%el':
                if (sspage)
                    row.push(sspage.hasEmailLogging());
                else
                    row.push("EmailLogging");
                break;
            case '%et':
                if (sspage)
                    row.push(sspage.getEnvironmentType());
                else
                    row.push("EnvironmentType");
                break;
            case '%m':
                if (sspage)
                    row.push(sspage.getModules().join(', '));
                else
                    row.push("Modules");
                break;
            case '%cfgp':
                if (sspage)
                    row.push(sspage.getConfigPhpPath());
                else
                    row.push("_config.php");
                break;
            case '%cfgy':
                if (sspage)
                    row.push(sspage.getConfigYmlPath());
                else
                    row.push("_config/config.yml");
                break;
        }
    }
    return row;
};


