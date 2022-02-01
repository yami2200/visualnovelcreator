import fs from "fs";
import path from "path";
import libraries_files from "@/assets/library.json";
import FileCustomFunction from "@/assets/base_customFunctionFile.json";
import {clipboard, remote} from "electron";
const removeFilePart = dirname => path.parse(dirname).dir;

function readFileSync(path) {
    try{
        return fs.readFileSync(path);
    } catch {
        return null;
    }
}

function writeFile(path, data){
    try{
        fs.writeFileSync(path, data);
    } catch(err) {
        console.log(err);
    }
}

function renameFile(oldPath, newPath){
    try{
        fs.renameSync(oldPath, newPath);
    } catch(err) {
        console.log(err);
    }
}

function deleteFile(path){
    try{
        fs.unlinkSync(path);
    } catch(err) {
        console.log(err);
    }
}

function renamePath(oldPath, newPath){
    try {
        fs.renameSync(oldPath, newPath);
    } catch(err) {
        console.log(err)
    }
}

function replaceFileLine(path, dataToReplace, dataReplacement){
    fs.readFile(path, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var result = data.replace(dataToReplace, dataReplacement);

        fs.writeFile(path, result, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    });
}

function existFile(path){
    return fs.existsSync(path);
}

function getDate(){
    return Date.now();
}

function removePreviousDialoguesFromOutput(listdialogues, indexDialogue, indexOutput){
    var oldNext = listdialogues[indexDialogue].nextDialogue[indexOutput];
    if(oldNext.id != -1){
        if(listdialogues[oldNext.id].previousDialogue[oldNext.ii].length <=1) listdialogues[oldNext.id].previousDialogue[oldNext.ii] = [{id: -1, ii:0}];
        else listdialogues[oldNext.id].previousDialogue[oldNext.ii].splice(listdialogues[oldNext.id].previousDialogue[oldNext.ii].findIndex(v => v.id === indexDialogue && v.ii === indexOutput), 1);
    }
}

function squareIntoSelection(minX, maxX, minY, maxY, x, y, width, height){
    return (
        (minY>=y && maxY<=y+height) && ((x>=minX && x<=maxX) || (x+width>=minX && x+width<=maxX))
    ) || (
        (minY<=y && maxY>=y) && ((minX>=x && minX<=x+width) || (maxX>=x && maxX<=x+width))
    ) || (
        (((x+width >= minX && x+width <=maxX) || (x >= minX && x <= maxX)) && ((y >=minY && y <= maxY) || (y+height >=minY && y+height <= maxY)))
    ) || (
        ((minX>=x && minX<= x+width) || (maxX>=x && maxX<=x+width)) && ((minY>=y && minY<=y+height) || (maxY>=y && maxY<=y+height))
    );
}

function sizeChoiceNode(numberChoice){
    var value = 21 + (numberChoice-3) * 7;
    if(numberChoice<4) value = 21;
    return value;
}

function createFileProject(directory, properties, assets){
    if(!fs.existsSync(directory)) return;
    var propertiesWrite = JSON.parse(JSON.stringify(properties));
    propertiesWrite.directory = path.join(directory, properties.name, "/");
    propertiesWrite.editorVersion = (remote.app.getVersion() !== undefined ? remote.app.getVersion() : "1.1.x");

    var folderAssets = ["Characters","Musics","Objects","Scenes","Sounds"];

    folderAssets.forEach((dir) => {
        try {
            fs.mkdirSync(path.join(propertiesWrite.directory, "Assets", dir, "/"), { recursive: true });
        } catch (err) {
            if (err.code !== 'EEXIST') throw err
        }
    });

    fs.mkdirSync(path.join(propertiesWrite.directory, "Assets", "Properties", "/"), { recursive: true });
    writeFile(path.join(propertiesWrite.directory, "Assets", "Properties", "vuejs.js"), libraries_files.vue);
    writeFile(path.join(propertiesWrite.directory, "Assets", "Properties", "howler.js"), libraries_files.howler);
    writeFile(propertiesWrite.directory+properties.name+".vnc", JSON.stringify(propertiesWrite));
    writeFile(propertiesWrite.directory+"assets.json", JSON.stringify(assets));
    writeFile(propertiesWrite.directory+"engine_assets.js", "var assets = "+JSON.stringify(assets)+";");
    writeFile(propertiesWrite.directory+"customFunction.js", getCustomFunctionFileText([]));
}

function createPackageWeb(directory, assets){
    if(!fs.existsSync(directory)) return;
    fs.mkdirSync(path.join(directory, assets[8].content.displayname, "/"), { recursive: true });
    copyFolderRecursiveSync(assets[8].content.directory, directory);
    deleteFile(path.join(directory, assets[8].content.name, assets[8].content.name+".vnc"));
    replaceFileLine(path.join(directory, assets[8].content.displayname, "/game.html"), "var packaged = false; // DO NOT EDIT THE LINE", "var packaged = true;");
}

function createPackageWindows(directory, assets, devMode, packagePath = ""){
    if(!fs.existsSync(directory)) return;
    fs.mkdirSync(path.join(directory, assets[8].content.displayname, "/"), { recursive: true });
    copyFolderRecursiveSync(assets[8].content.directory, path.join(directory, assets[8].content.displayname, "/"));
    renamePath(path.join(directory, assets[8].content.displayname, assets[8].content.name), path.join(directory, assets[8].content.displayname, "game"));
    replaceFileLine(path.join(directory, assets[8].content.displayname, "game", "/game.html"), "var packaged = false; // DO NOT EDIT THE LINE", "var packaged = true;");
    deleteFile(path.join(directory, assets[8].content.displayname, "game", assets[8].content.name+".vnc"));
    let listPackage = [];
    let directoryFilesPackage = "public/packageWindows/";
    if(!devMode){
        directoryFilesPackage = packagePath;
    }
    listPackage = getAllFilesPathAtDirectory(directoryFilesPackage);
    if(listPackage.length === 0) return;
    listPackage.forEach((filepath) => {
        let fileData = readFileSync(filepath);
        if(fileData !== null){
            let pathFolder = removeFilePart(path.join(directory, assets[8].content.displayname, filepath.substring(directoryFilesPackage.length)));
            if(!existFile(pathFolder)){
                fs.mkdirSync(pathFolder, { recursive: true });
            }
            writeFile(path.join(directory, assets[8].content.displayname, filepath.substring(directoryFilesPackage.length)), fileData)
        }
    });
    renamePath(path.join(directory, assets[8].content.displayname, "visualnovelexecutable.exe"), path.join(directory, assets[8].content.displayname, assets[8].content.displayname+".exe"));
    if(assets[8].content.icon !== ""){
        let iconData = readFileSync(path.join(directory, assets[8].content.displayname, "game", assets[8].content.icon));
        if(iconData!==null){
            writeFile(path.join(directory, assets[8].content.displayname, "game", "Assets", "defaultIcon.ico"), iconData);
        }
    }
}

function getAllFilesPathAtDirectory(directory){
    let list = [];
    try{
        fs.readdirSync(directory).forEach(file => {
            if(file.includes('.')){
                list.push(directory+file);
            } else {
                list = list.concat(getAllFilesPathAtDirectory(path.join(directory, file+"/")));
            }
        });
    } catch {
        return list;
    }
    return list;
}

// SOURCE : https://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js/26038979 @ Simon Zyx
function copyFileSync( source, target ) {

    var targetFile = target;

    // If target is a directory, a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

// SOURCE : https://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js/26038979 @ Simon Zyx
function copyFolderRecursiveSync( source, target ) {
    var files = [];

    // Check if folder needs to be created or integrated
    var targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    // Copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}

function saveProperties(properties){
    writeFile(properties.directory+properties.name+".vnc", JSON.stringify(properties));
}

function saveAssets(properties, assets){
    writeFile(properties.directory+"assets.json", JSON.stringify(assets));
    writeFile(properties.directory+"engine_assets.js", "var assets = "+JSON.stringify(assets)+";");
}

// ############################ ASSET DEPENDENCY #############

function removeDependencyVariableAsset(type, oldname, newname, assets, listPages = []){
    assets[5].content.forEach((v) => {
        if(v.type.name === type){
            if(v.value.type === "value"){
                if(v.value.value === oldname){
                    v.value.value = newname;
                }
            }
        }
    });

    listPages.forEach((p) => {
        p.listDialogues.forEach((d) => {

            // ########################## CASE CHARACTER IN DIALOGUE NODE
            if(d.speaker !== undefined){
                checkVariableForAssetDependency(d.speaker, oldname, newname, type);
            }

            // ########################## CASE ASSET FOR CONDITIONNAL DIALOGUE
            if(d.condition !== undefined){
                checkVariableForAssetDependency(d.condition, oldname, newname, type);
            }

            // ########################### CASE ASSET FOR CHOICE DIALOGUE
            if(d.choices !== undefined){
                d.choices.forEach((c) => {
                    if(c.condition !== undefined){
                        checkVariableForAssetDependency(c.condition, oldname, newname, type);
                    }
                    if(c.object !== undefined){
                        checkVariableForAssetDependency(c.object, oldname, newname, type);
                    }
                });
            }

            // ########################### CASE ASSET FOR SCRIPT DIALOGUE
            if(d.action !== undefined){
                d.action.forEach((a) => {
                    checkInputsAssetDependencyFromAction(a, oldname, newname, type);
                });
            }

        });
    });

    // Project preferences
    if(assets[8].content.defaultClickSound !== undefined) checkVariableForAssetDependency(assets[8].content.defaultClickSound, oldname, newname, type);
    if(assets[8].content.defaultTextSound !== undefined) checkVariableForAssetDependency(assets[8].content.defaultTextSound, oldname, newname, type);
}

function checkInputsAssetDependencyFromAction(action, oldname, newname, type){
    if(action.action !== undefined) action.action.forEach((a) => {checkInputsAssetDependencyFromAction(a, oldname, newname, type)});
    else {
        if(action.actionif !== undefined) action.actionif.forEach((a) => {checkInputsAssetDependencyFromAction(a, oldname, newname, type)});
        if(action.actionelse !== undefined) action.actionelse.forEach((a) => {checkInputsAssetDependencyFromAction(a, oldname, newname, type)});
    }

    action.inputs.forEach((i) => {
        checkVariableForAssetDependency(i, oldname, newname, type);
    });
}

function checkVariableForAssetDependency(i, oldname, newname, type){
    if(i.value.type === "arrayElement"){
        if(i.value.value.array !== undefined) checkVariableForAssetDependency(i.value.value.array, oldname, newname, type);
        if(i.value.value.index !== undefined) checkVariableForAssetDependency(i.value.value.index, oldname, newname, type);
        return;
    } else if(i.value.type === "value"){
        if(i.type.name === type && i.value.value === oldname){
            i.value.value = newname;
        } else if(i.type.name === "Array"){
            i.value.value.values.forEach((varArray) => {
                checkVariableForAssetDependency(varArray, oldname, newname, type);
            });
            return;
        } else if(i.value.input1 !== undefined || i.value.input2 !== undefined){
            if(i.value.input1 !== undefined) checkVariableForAssetDependency(i.value.input1, oldname, newname, type);
            if(i.value.input2 !== undefined) checkVariableForAssetDependency(i.value.input2, oldname, newname, type);
            return;
        }
    }
    return false;
}

// ################################################################

// ############################ VARIABLE DEPENDENCY #############

function removeDependencyVariable(type, oldname, newname, listPages, assets) {
    listPages.forEach((p) => {
        p.listDialogues.forEach((d) => {

            // ######################### CASE CONDITIONNAL DIALOGUE
            if (d.condition !== undefined) {
                checkVariableForVariableDependency(d.condition, oldname, newname, type);
            }

            // ######################### CASE DIALOGUE
            if(d.speaker !== undefined){
                checkVariableForVariableDependency(d.speaker, oldname, newname, type);
            }

            // ############################## CASE INPUT DIALOGUE
            if(d.input !== undefined){
                checkVariableForVariableDependency(d.input, oldname, newname, type);
            }

            // ############################# CASE CHOICES DIALOGUE
            if(d.choices !== undefined){
                d.choices.forEach((c) => {
                    if(c.condition !== undefined){
                        checkVariableForVariableDependency(c.condition, oldname, newname, type);
                    }
                    if(c.object !== undefined){
                        checkVariableForVariableDependency(c.object, oldname, newname, type);
                    }
                });
            }

            // ########################### CASE SCRIPT DIALOGUE
            if(d.action !== undefined){
                d.action.forEach((a) => {
                    checkInputsVariableDependencyFromAction(a, oldname, newname, type);
                });
            }

        });
    });

    // Project preferences
    if(assets[8].content.defaultClickSound !== undefined) checkVariableForVariableDependency(assets[8].content.defaultClickSound, oldname, newname, type);
    if(assets[8].content.defaultTextSound !== undefined) checkVariableForVariableDependency(assets[8].content.defaultTextSound, oldname, newname, type);
}

function checkInputsVariableDependencyFromAction(action, oldname, newname, type){
    if(action.action !== undefined) action.action.forEach((a) => {checkInputsVariableDependencyFromAction(a, oldname, newname, type)});
    else {
        if(action.actionif !== undefined) action.actionif.forEach((a) => {checkInputsVariableDependencyFromAction(a, oldname, newname, type)});
        if(action.actionelse !== undefined) action.actionelse.forEach((a) => {checkInputsVariableDependencyFromAction(a, oldname, newname, type)});
    }

    action.inputs.forEach((i) => {
        checkVariableForVariableDependency(i, oldname, newname, type);
    });
}

function checkVariableForVariableDependency(i, oldname, newname, type){
    if((i.value.type === "variable" && i.value.value === oldname) || (i.type.name.toLowerCase() === "variable" && i.value.type === "value" && i.value.value === oldname)){
        if(newname === "null"){
            if(i.onlyvar !== undefined && i.onlyvar){
                i.value.value = "";
                return;
            } else {
                i.value.type = "value";
                i.value.value = JSON.parse(JSON.stringify(i.type.defaultValue));
                return;
            }
        } else {
            i.value.value = newname;
            return;
        }
    } else if(i.value.type === "arrayElement"){
        if(i.value.value.array !== undefined) checkVariableForVariableDependency(i.value.value.array, oldname, newname, type);
        if(i.value.value.index !== undefined) checkVariableForVariableDependency(i.value.value.index, oldname, newname, type);
        return;
    } else if(i.value.type === "value"){
        if(i.type.name === "Array"){
            i.value.value.values.forEach((varArray) => {
                checkVariableForVariableDependency(varArray, oldname, newname, type);
            });
            return;
        } else if(i.value.input1 !== undefined || i.value.input2 !== undefined){
            if(i.value.input1 !== undefined) checkVariableForVariableDependency(i.value.input1, oldname, newname, type);
            if(i.value.input2 !== undefined) checkVariableForVariableDependency(i.value.input2, oldname, newname, type);
            return;
        }
    }
    return false;
}

// ################################################################

function getDisplayNameVariable(variable){
    if(variable.value.type === "variable"){
        return variable.value.value;
    } else if(variable.value.type === "value"){
        if(variable.type.name === "Array"){
            return "<static_array>";
        } else if(variable.value.input1 !== undefined && variable.value.input2 !== undefined){
            let text = "";
            if(variable.value.operation === undefined) return "";
            if(variable.value.operation === "value") return variable.value.value;
            else if(variable.value.operation === "not") return "!("+getDisplayNameVariable(variable.value.input2)+")";
            else if(variable.value.operation === "Random" || variable.value.operation === "Min" || variable.value.operation === "Max") return variable.value.operation + "(" + getDisplayNameVariable(variable.value.input1) + ", " + getDisplayNameVariable(variable.value.input2) + ")";
            else if(variable.value.operation === "array length") return "length("+getDisplayNameVariable(variable.value.input2)+")";
            else if(variable.value.operation === "exp") return "e ^ "+getDisplayNameVariable(variable.value.input2);
            else if(variable.value.operation === "power") return getDisplayNameVariable(variable.value.input2)+" ^ "+getDisplayNameVariable(variable.value.input2);
            else if(variable.value.operation === "Concat") return getDisplayNameVariable(variable.value.input1) + " + " + getDisplayNameVariable(variable.value.input2);
            else if(variable.value.operation === "to String") return "toString("+getDisplayNameVariable(variable.value.input2)+")";
            else text = getDisplayNameVariable(variable.value.input1) + " " +variable.value.operation + " " + getDisplayNameVariable(variable.value.input2);
            return text;
        } else {
            return variable.value.value;
        }
    } else if(variable.value.type === "arrayElement"){
        if(variable.value.value.array === undefined || variable.value.value.index === undefined) return "";
        return getDisplayNameVariable(variable.value.value.array) + "[" + getDisplayNameVariable(variable.value.value.index) + "]";
    }
}

function getCustomFunctionFileText(listCustomF){
    let structure = JSON.parse(JSON.stringify(FileCustomFunction));
    let text = "";
    listCustomF.forEach((f) => {
        text += f.name + "(input = []){\r\n " + f.code + "\r\n },\r\n ";
    })
    return structure.begin + text + structure.end;
}

function checkValidClipboard(type){
    let clipboardObj = null;
    try {
        clipboardObj = JSON.parse(clipboard.readText());
    } catch {
        //empty
    }
    if(!(clipboardObj === null || clipboardObj.type === undefined || clipboardObj.type !== type || clipboardObj.content === undefined)) return clipboardObj;
    return null;
}

export {
    readFileSync,
    writeFile,
    renameFile,
    deleteFile,
    existFile,
    getDate,
    removePreviousDialoguesFromOutput,
    squareIntoSelection,
    createFileProject,
    saveProperties,
    saveAssets,
    removeDependencyVariableAsset,
    removeDependencyVariable,
    getCustomFunctionFileText,
    createPackageWeb,
    createPackageWindows,
    getAllFilesPathAtDirectory,
    sizeChoiceNode,
    checkValidClipboard,
    replaceFileLine,
    getDisplayNameVariable
};