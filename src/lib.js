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

function removeDependencyVariableAsset(type, oldname, newname, assets){
    assets[5].content.forEach((v) => {
        if(v.type.name === type){
            if(v.value.type === "value"){
                if(v.value.value === oldname){
                    v.value.value = newname;
                }
            }
        }
    });
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
    removeDependencyVariableAsset
};