import fs from "fs";
import path from "path";
import FileCustomFunction from "@/assets/base_customFunctionFile.json";
import {clipboard} from "electron";
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
    } catch {
        return;
    }
}

function renameFile(oldPath, newPath){
    try{
        fs.renameSync(oldPath, newPath);
    } catch {
        return;
    }
}

function deleteFile(path){
    try{
        fs.unlinkSync(path);
    } catch {
        return;
    }
}

function renamePath(oldPath, newPath){
    try {
        fs.renameSync(oldPath, newPath);
    } catch(err) {
        console.log(err)
    }
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
    propertiesWrite.directory = directory+"\\"+properties.name+"\\";

    var folderAssets = ["Characters","Musics","Objects","Scenes","Sounds"];

    folderAssets.forEach((dir) => {
        try {
            fs.mkdirSync(propertiesWrite.directory+"Assets\\"+dir+"\\", { recursive: true });
        } catch (err) {
            if (err.code !== 'EEXIST') throw err
        }
    });

    fs.mkdirSync(propertiesWrite.directory+"Assets\\Properties\\", { recursive: true });
    writeFile(propertiesWrite.directory+properties.name+".vnc", JSON.stringify(propertiesWrite));
    writeFile(propertiesWrite.directory+"assets.json", JSON.stringify(assets));
    writeFile(propertiesWrite.directory+"engine_assets.js", "var assets = "+JSON.stringify(assets)+";");
    writeFile(propertiesWrite.directory+"customFunction.js", getCustomFunctionFileText([]));
}

function createPackageWeb(directory, assets){
    if(!fs.existsSync(directory)) return;
    fs.mkdirSync(directory+"\\"+assets[8].content.displayname+"\\", { recursive: true });
    copyFolderRecursiveSync(assets[8].content.directory, directory);
    deleteFile(directory+"\\"+assets[8].content.name+"\\"+assets[8].content.name+".vnc");
}

function createPackageWindows(directory, assets, devMode, packagePath = ""){
    if(!fs.existsSync(directory)) return;
    fs.mkdirSync(directory+"\\"+assets[8].content.displayname+"\\", { recursive: true });
    copyFolderRecursiveSync(assets[8].content.directory, directory+"\\"+assets[8].content.displayname+"\\");
    renamePath(directory+"\\"+assets[8].content.displayname+"\\"+assets[8].content.name, directory+"\\"+assets[8].content.displayname+"\\game");
    deleteFile(directory+"\\"+assets[8].content.displayname+"\\game\\"+assets[8].content.name+".vnc");
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
            let pathFolder = removeFilePart(directory+"\\"+assets[8].content.displayname+"\\"+filepath.substring(directoryFilesPackage.length));
            if(!existFile(pathFolder)){
                fs.mkdirSync(pathFolder, { recursive: true });
            }
            writeFile(directory+"\\"+assets[8].content.displayname+"\\"+filepath.substring(directoryFilesPackage.length), fileData)
        }
    });
    renamePath(directory+"\\"+assets[8].content.displayname+"\\visualnovelexecutable.exe", directory+"\\"+assets[8].content.displayname+"\\"+assets[8].content.displayname+".exe");
    if(assets[8].content.icon !== ""){
        let iconData = readFileSync(path.join(directory+"\\"+assets[8].content.displayname+"\\game\\",assets[8].content.icon));
        if(iconData!==null){
            writeFile(directory+"\\"+assets[8].content.displayname+"\\game\\Assets\\defaultIcon.ico", iconData);
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
            if(type === "Character" && d.speaker !== undefined && d.speaker.value.type === "value"){
                if(d.speaker.value.value !== "null" && d.speaker.value.value === oldname){
                    d.speaker.value.value = newname;
                }
            }

            // ########################## CASE ASSET FOR CONDITIONNAL DIALOGUE
            if(d.condition !== undefined){
                if(d.condition.value.type === "value") {
                    checkConditionForAssetDependency(d, oldname, newname);
                }
            }

            // ########################### CASE ASSET FOR CHOICE DIALOGUE
            if(d.choices !== undefined){
                d.choices.forEach((c) => {
                    if(c.condition !== undefined && c.condition.value.type === "value"){
                        checkConditionForAssetDependency(c, oldname, newname);
                    }
                    if(c.object !== undefined && type === "Object" && c.object.value.type === "value"){
                        if(c.object.value.value !== "null" && c.object.value.value === oldname){
                            c.object.value.value = newname;
                        }
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
    if(type === "Sound" && assets[8].content.defaultClickSound.value.type === "value" && assets[8].content.defaultClickSound.value.value === oldname){
        assets[8].content.defaultClickSound.value.value = newname;
    }
    if(type === "Sound" && assets[8].content.defaultTextSound.value.type === "value" && assets[8].content.defaultTextSound.value.value === oldname){
        assets[8].content.defaultTextSound.value.value = newname;
    }
}

function checkInputsAssetDependencyFromAction(action, oldname, newname, type){
    if(action.action !== undefined) action.action.forEach((a) => {checkInputsAssetDependencyFromAction(a, oldname, newname, type)});
    else {
        if(action.actionif !== undefined) action.actionif.forEach((a) => {checkInputsAssetDependencyFromAction(a, oldname, newname, type)});
        if(action.actionelse !== undefined) action.actionelse.forEach((a) => {checkInputsAssetDependencyFromAction(a, oldname, newname, type)});
    }

    action.inputs.forEach((i) => {
        if(i.type.name === type && i.value.type === "value" && i.value.value !== "null" && i.value.value === oldname){
            i.value.value = newname;
        }
        if(i.type.name === "Boolean" && i.value.type === "value"){
            checkConditionForAssetDependency({condition : i}, oldname, newname);
        }
    });
}

function checkConditionForAssetDependency(d, oldname, newname){
    if(d.condition.value.operation !== undefined && d.condition.value.operation !== "value"){
        if(d.condition.value.input1 !== undefined && d.condition.value.input1.value.type === "value" && d.condition.value.input1.value.value === oldname) dependencyBooleanInputs(newname, d.condition.value.input1);
        if(d.condition.value.input2 !== undefined && d.condition.value.input2.value.type === "value" && d.condition.value.input2.value.value === oldname) dependencyBooleanInputs(newname, d.condition.value.input2);
        d.condition.value.value = d.condition.value.input1.value.value + " " + d.condition.value.operation + " " +d.condition.value.input2.value.value;
    }
}

function removeDependencyVariable(type, oldname, newname, listPages, assets) {
    listPages.forEach((p) => {
        p.listDialogues.forEach((d) => {

            // ######################### CASE CONDITIONNAL DIALOGUE
            if (d.condition !== undefined) {
                checkConditionForVariableDependency(d, oldname, newname, type);
            }

            // ######################### CASE DIALOGUE
            if(type === "Character" && d.speaker !== undefined && d.speaker.value.type === "variable"){
                if(d.speaker.value.value === oldname){
                    if(newname==="null"){
                        d.speaker.value.type = "value";
                        d.speaker.value.value = d.speaker.type.defaultValue;
                    } else {
                        d.speaker.value.value = newname;
                    }
                }
            }

            // ############################## CASE INPUT DIALOGUE
            if(d.input !== undefined && d.input.type.name === type && d.input.value.value === oldname){
                if(newname === "null"){
                    d.input.value.value = "";
                } else {
                    d.input.value.value = newname;
                }
            }

            // ############################# CASE CHOICES DIALOGUE
            if(d.choices !== undefined){
                d.choices.forEach((c) => {
                    if(c.condition !== undefined){
                        checkConditionForVariableDependency(c, oldname, newname, type);
                    }
                    if(c.object !== undefined && type === "Object" && c.object.value.type === "variable"){
                        if(c.object.value.value === oldname){
                            if(newname === "null"){
                                c.object.value.type = "value";
                                c.object.value.value = "null";
                            } else {
                                c.object.value.value = newname;
                            }
                        }
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
    if(type === "Sound" && assets[8].content.defaultClickSound.value.type === "variable" && assets[8].content.defaultClickSound.value.value === oldname){
        if(newname === "null"){
            assets[8].content.defaultClickSound.value.type = "value";
            assets[8].content.defaultClickSound.value.value = "null";
        } else {
            assets[8].content.defaultClickSound.value.value = newname;
        }
    }
    if(type === "Sound" && assets[8].content.defaultTextSound.value.type === "variable" && assets[8].content.defaultTextSound.value.value === oldname){
        if(newname === "null"){
            assets[8].content.defaultTextSound.value.type = "value";
            assets[8].content.defaultTextSound.value.value = "null";
        } else {
            assets[8].content.defaultTextSound.value.value = newname;
        }
    }
}

function checkInputsVariableDependencyFromAction(action, oldname, newname, type){
    if(action.action !== undefined) action.action.forEach((a) => {checkInputsVariableDependencyFromAction(a, oldname, newname, type)});
    else {
        if(action.actionif !== undefined) action.actionif.forEach((a) => {checkInputsVariableDependencyFromAction(a, oldname, newname, type)});
        if(action.actionelse !== undefined) action.actionelse.forEach((a) => {checkInputsVariableDependencyFromAction(a, oldname, newname, type)});
    }

    action.inputs.forEach((i) => {
        if((i.type.name === type || i.type.name === "variable") && i.value.type === "variable" && i.value.value === oldname){
            if(newname === "null"){
                if(i.onlyvar !== undefined && i.onlyvar){
                    i.value.value = "";
                } else {
                    i.value.type = "value";
                    i.value.value = i.type.defaultValue;
                }
            } else {
                i.value.value = newname;
            }
        } else if((type === "Integer" || type === "Float") && (i.type.name === "Integer" || i.type.name === "Float") && i.value.type === "value" && i.value.operation !== undefined && i.value.operation !== "value"){
            checkNumberForVariableDependency(i, oldname, newname, type, i.type.defaultValue);
        }

        if(i.type.name === "variable" && i.value.value === oldname){
            if(newname === "null") i.value.value = "";
            else i.value.value = newname;
        }

        if(i.type.name === "Boolean" && i.value.type === "value"){
            checkConditionForVariableDependency({condition : i}, oldname, newname, type);
        }

    });

}

function checkConditionForVariableDependency(d, oldname, newname, type){
    if(d.condition.value.type === "value") {
        if(d.condition.value.operation !== undefined && d.condition.value.operation !== "value"){
            if(d.condition.value.input1 !== undefined && d.condition.value.input1.value.type === "variable" && d.condition.value.input1.value.value === oldname) dependencyBooleanInputs(newname, d.condition.value.input1);
            if(d.condition.value.input2 !== undefined && d.condition.value.input2.value.type === "variable" && d.condition.value.input2.value.value === oldname) dependencyBooleanInputs(newname, d.condition.value.input2);
            d.condition.value.value = d.condition.value.input1.value.value + " " + d.condition.value.operation + " " +d.condition.value.input2.value.value;
        }
    } else if(type === "Boolean") {
        if(d.condition.value.value === oldname) {
            if(newname === "null"){
                d.condition.value.type = "value";
                d.condition.value.value = d.condition.type.defaultValue;
            } else {
                d.condition.value.value = newname;
            }
        }
    }
}

function dependencyBooleanInputs(newname, input){
    if(input!==null){
        if(newname === "null"){
            input.value.type = "value";
            input.value.value = input.type.defaultValue;
        } else {
            input.value.value = newname;
        }
    }
}

function checkNumberForVariableDependency(v, oldname, newname, type, defaultValue){
    let newText = newname;
    if(newname === "null") newText = defaultValue;
    if(v.value.input1 !== undefined && v.value.input1.value.type === "value" && v.value.input1.value.operation !== undefined && v.value.input1.value.operation !== "value") checkNumberForVariableDependency(v.value.input1, oldname, newText, type, defaultValue);
    if(v.value.input2 !== undefined && v.value.input1.value.type === "value" && v.value.input2.value.operation !== undefined && v.value.input2.value.operation !== "value") checkNumberForVariableDependency(v.value.input2, oldname, newText, type, defaultValue);

    if(v.value.input1.value.type === "variable" && v.value.input1.value.value === oldname) {
        if(newText === defaultValue){
            v.value.input1.value.type = "value";
            v.value.input1.value.operation = "value";
        }
        v.value.input1.value.value = newText;
    }
    if(v.value.input2.value.type === "variable" && v.value.input2.value.value === oldname) {
        if (newText === defaultValue) {
            v.value.input2.value.type = "value";
            v.value.input2.value.operation = "value";
        }
        v.value.input2.value.value = newText;
    }
    v.value.value = getTextOperationNumberVariable(v.value.input1, v.value.input2, v.value.operation);
}

function getTextOperationNumberVariable(input1, input2, operation){
    if(operation === "Random" || operation === "Min" || operation === "Max"){
        return operation + "(" + input1.value.value + ", " + input2.value.value +")";
    } else {
        return input1.value.value + " " + operation + " " + input2.value.value;
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
    getTextOperationNumberVariable,
    sizeChoiceNode,
    checkValidClipboard
};