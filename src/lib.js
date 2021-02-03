const fs = require('fs');

function readFileSync(path) {
    return fs.readFileSync(path);
}

function writeFile(path, data){
    fs.writeFile(path, data, (err) => {
        if(err){
            alert("An error ocurred while saving images ! : " + err.message)
        }
    });
}

export {readFileSync, writeFile};