var fs = require("fs");
var path = require("path");
var jsyaml = require("js-yaml");

var sspage;
sspage = {
    create: function (pagecfg) {
        var me = this;
        var path_project = pagecfg.path;
        var pagename = pagecfg.name || null;
        var path_configphp,path_configyml,path_ssversion,path_root;
        var val_version,val_defadmin,val_maillog,val_envtype,arr_modules;

        if(!path_project){
            console.log("Aborting: No Path specified");
            return null;
        }

        path_configphp = path.join(path_project, '_config.php');
        path_configyml = path.join(path_project, '_config/config.yml');
        path_root = path.join(path_project,'..');
        path_ssversion = fs.existsSync(path.join(path_project, '../framework/'))
            ? path.join(path_project, '../framework/silverstripe_version')
            : path.join(path_project, '../sapphire/silverstripe_version');


        readVersion();
        readDefaultAdmin();
        readEmailLogging();
        readEnvironmentType();
        readModules();

        function readModules(){
            var rootdirs = fs.readdirSync(path_root);
            arr_modules = [];
            for(var i in rootdirs){
                var dir = rootdirs[i];
                if(dir[0] === '.') continue;
                var absdir = path.join(path_root,rootdirs[i]);
                if(!fs.statSync(absdir).isDirectory()) continue;
                if(fs.readdirSync(absdir).indexOf("_config.php") >= 0){
                    switch(dir){
                        case 'assets':
                        case 'cms':
                        case 'framework':
                        case 'sapphire':
                        case path.basename(path_project):
                            break;
                        default:
                            arr_modules.push(dir);
                    }
                }
            }
        }

        function readVersion() {
            val_version = 'N/A';
            if(fs.existsSync(path_ssversion)) {
                var content = fs.readFileSync(path_ssversion).toString();
                var v = content.match(/\d+\.\d+\.\d+/);
                if (v) {
                    val_version = v[0];
                }
            }
        };

        function readDefaultAdmin(){
            if(fs.existsSync(path_configphp)) {
                var content = fs.readFileSync(path_configphp).toString();
                content = content.replace(/\/\*[^\Z]*\*\//gm,"");
                var da = content.match(/^\s*Security::setDefaultAdmin/m);
                if(da){
                    val_defadmin = true;
                }else{
                    val_defadmin = false;
                }
            }
        }

        function readEmailLogging(){
            if(fs.existsSync(path_configphp)) {
                var content = fs.readFileSync(path_configphp).toString();
                content = content.replace(/\/\*[^\Z]*\*\//gm,"");
                var ml = content.match(/\s*SS_Log::add_writer\(\s*new\s*SS_LogEmailWriter/m);
                if(ml) {
                    val_maillog = true;
                }else{
                    val_maillog = false;
                }
            }
        }

        function readEnvironmentType(){
            if(fs.existsSync(path_configphp)) {
                var content = fs.readFileSync(path_configphp).toString();
                content = content.replace(/\/\*[^\Z]*\*\//gm,"");
                var et = content.match(/\s*Director::set_environment_type\(\s*['"](dev|live|test*)['"]\s*\);/m);
                if(et) {
                    val_envtype = et[1];
                }else{
                    val_envtype = null;
                }
            }

            if(fs.existsSync(path_configyml)) {
                // Get document, or throw exception on error
                try {
                    var doc = jsyaml.safeLoadAll(fs.readFileSync(path_configyml),function(doc){
                        if(doc && doc.Director && doc.Director.environment_type){
                            val_envtype = doc.Director.environment_type;
                        }
                    });
                } catch (e) {
                    console.log(e);
                }
            }
        }

        me.getName = function () {
            return pagename;
        }

        me.getVersion = function () {
            return val_version;
        };

        me.hasDefaultAdmin = function () {
            return val_defadmin;
        };

        me.hasEmailLogging = function () {
            return val_maillog;
        };

        me.getEnvironmentType = function () {
            return val_envtype;
        };

        me.getModules = function () {
            return arr_modules;
        };

        return me;
    }
};

module.exports = sspage;