const fs = require('fs');

function readFileSync(path) {
    return fs.readFileSync(path);
}

function writeFile(path, data){
    fs.writeFileSync(path, data);
}

function renameFile(oldPath, newPath){
    fs.renameSync(oldPath, newPath);
}

function deleteFile(path){
    fs.unlinkSync(path);
}

function existFile(path){
    return fs.existsSync(path);
}

export {readFileSync, writeFile, renameFile, deleteFile, existFile};