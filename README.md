## Requirements

- cli-table 0.3.1
- colors 1.0.3
- js-yaml 3.2.3


## Installation

```
git clone https://github.com/Saiyan/silverstripe-analyzer.git
cd silverstripe-analyzer
npm install
```

## Usage
```
node analyzer.js [COMMAND] [OPTION]
```

If SA is started without a command it will print any configured Silverstripe-CMS instances found in the sites.json file.
When you start SA for the first time there will be no sites.json so you need to add a new Silverstripe site with:

```
node analyzer.js add <NAME> </PATH/TO/MYSITE/>
```

The NAME for your site is just a String so you can identify your site later on whereas the PATH needs to be the path to the "project" folder of your silverstripe instance.
If you dont change it after installing Silverstripe it should be the "mysite" folder.

If you want to remove a Page from your config then just use

```
node analyzer.js remove <NAME>
```

## Options
###--format=

if you start the analyzer with a parameter which starts with "--format=" the analyzer will print every site in the specified format.  
the standard-format looks something like this (without the line breaks) 

```
Site:            %s%n
Version:         %v%n
DefaultAdmin:    %da%n
EmailLogging:    %el%n
EnvironmentType: %et%n
Modules:         %mo%n
```

You can use the following placeholders in your format:
```
%n  //Newline
%s  //Sitename
%v  //Version
%da //DefaultAdmin
%el //EmailLogging
%et //EnvironmentType
%mo //Modules
```

###--filter-name=

if you don't want to see all your sites listed you can filter the results shown to you with --filter-name=
Everything after the parameter name will be interpreted as a Javascript Regular Expression and will be tested against the name of the site.
 
Some Examples
```
//list every site which starts with the string "site"
--filter-name=^site

//list every site which name ends with the string "site"
--filter-name=site$

//list only sites which have only characters in their name  
--filter-name=\w+
```