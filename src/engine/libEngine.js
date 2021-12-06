function getDialogue(page, index, assets){
    var pageA = assets[6].content.filter((p) => p.title === page);
    if(pageA.length === 0) return null;
    return pageA[0].listDialogues[index];
}

function getTransitionDialogue(page, id, assets){
    var pageA = assets[6].content.filter((p) => p.title === page);
    if(pageA.length === 0) return null;
    for(var i = 0; i<pageA[0].listDialogues.length; i++){
        if(pageA[0].listDialogues[i].id === id) return {d : pageA[0].listDialogues[i], index : i};
    }
    return null;
}

function getCharacter(name, assets){
    return getAssetIndex(0, name, assets);
}

function getScene(name, assets){
    return getAssetIndex(1, name, assets);
}

function getObject(name, assets){
    return getAssetIndex(2, name, assets);
}

function getMusic(name, assets){
    return getAssetIndex(3, name, assets);
}

function getSound(name, assets){
    return getAssetIndex(4, name, assets);
}

function setValueVariableByName(name, value, assets){
    var varA = assets[5].content.filter((p) => p.name === name);
    if(varA.length === 0) return null;
    var variable = varA[0];
    variable.value = {value : value, type : "value"};
}

function getVariableValueByName(name, assets){
    var varA = assets[5].content.filter((p) => p.name === name);
    if(varA.length === 0) return null;
    var variable = varA[0];
    return getVariableValue(variable, assets);
}

function getVariableValue(variable, assets){
    if(variable.value.type === "value" || variable.type.name === "Variable"){
        if(variable.type.name === "Boolean" && (variable.value.operation !== undefined && variable.value.operation !== "value")){
            switch (variable.value.operation) {
                case "==":
                    return getVariableValue(variable.value.input1, assets) === getVariableValue(variable.value.input2, assets);
                case ">":
                    return getVariableValue(variable.value.input1, assets) > getVariableValue(variable.value.input2, assets);
                case ">=":
                    return getVariableValue(variable.value.input1, assets) >= getVariableValue(variable.value.input2, assets);
                case "<":
                    return getVariableValue(variable.value.input1, assets) < getVariableValue(variable.value.input2, assets);
                case "<=":
                    return getVariableValue(variable.value.input1, assets) <= getVariableValue(variable.value.input2, assets);
            }
            return false;
        } else if((variable.type.name === "Integer" || variable.type.name === "Float") && (variable.value.operation !== undefined && variable.value.operation !== "value")){
            let input1 = (variable.type.name === "Integer" ? Math.trunc(getVariableValue(variable.value.input1, assets)) : getVariableValue(variable.value.input1, assets));
            let input2 = (variable.type.name === "Integer" ? Math.trunc(getVariableValue(variable.value.input2, assets)) : getVariableValue(variable.value.input2, assets));
            switch (variable.value.operation) {
                case "+":
                    return input1 + input2;
                case "-":
                    return input1 - input2;
                case "x":
                    return input1 * input2;
                case "÷":
                    return (variable.type.name === "Integer" ? Math.trunc(input1 / input2) : input1 / input2);
                case "Random":
                    let min = Math.min(input1, input2);
                    let max = Math.max(input1, input2);
                    return (variable.type.name === "Integer" ? Math.floor(Math.random() * (max - min) + min) : Math.random() * (max - min) + min);
                case "Min" :
                    return Math.min(input1, input2);
                case "Max" :
                    return Math.max(input1, input2);
            }
            return false;
        }
        return variable.value.value;
    }
    if(variable.value.type === "variable"){
        if(variable.type.name === "Integer") return Math.trunc(getVariableValueByName(variable.value.value, assets));
        return getVariableValueByName(variable.value.value, assets);
    }
}

function getArrayElement(array, index, assets){
    if(array.values !== undefined && array.values.length > 0 && array.values.length > index && index >= 0){
        let int_index = Math.trunc(index);
        return getVariableValue(array.values[int_index], assets);
    } else {return null}
}

function getAssetIndex(index, name, assets){
    var asset = assets[index].content.filter((c) => c.name === name);
    if(asset.length === 0) return null;
    return asset[0];
}