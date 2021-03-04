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

export {readFileSync, writeFile, renameFile, deleteFile, existFile, getDate, removePreviousDialoguesFromOutput, squareIntoSelection};