const fs = require('fs');

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
        (((x+width >= minX && x+width <=maxX) || (x >= minX && x <= maxX)) && ((y >=minY && y <= maxY) || (y+height >=minY && y+height <= maxY)))
    );
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

    writeFile(propertiesWrite.directory+properties.name+".vsm", JSON.stringify(propertiesWrite));
    writeFile(propertiesWrite.directory+"assets.json", JSON.stringify(assets));

}

function saveProperties(properties){
    writeFile(properties.directory+properties.name+".vsm", JSON.stringify(properties));
}

function saveAssets(properties, assets){
    writeFile(properties.directory+"Assets.json", JSON.stringify(assets));
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
                    if(d.condition.value.operation !== undefined & d.condition.value.operation !== "value"){
                        if(d.condition.value.input1 !== undefined && d.condition.value.input1.value.type === "value" && d.condition.value.input1.value.value === oldname) dependencyBooleanInputs(newname, d.condition.value.input1);
                        if(d.condition.value.input2 !== undefined && d.condition.value.input2.value.type === "value" && d.condition.value.input2.value.value === oldname) dependencyBooleanInputs(newname, d.condition.value.input2);
                        d.condition.value.value = d.condition.value.input1.value.value + " " + d.condition.value.operation + " " +d.condition.value.input2.value.value;
                    }
                }
            }

        });
    });
}

function removeDependencyVariable(type, oldname, newname, listPages) {
    listPages.forEach((p) => {
        p.listDialogues.forEach((d) => {

            // ######################### CASE CONDITIONNAL DIALOGUE
            if (d.condition !== undefined) {
                if(d.condition.value.type === "value") {
                    if(d.condition.value.operation !== undefined & d.condition.value.operation !== "value"){
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
        });
    });
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
    removeDependencyVariable
};