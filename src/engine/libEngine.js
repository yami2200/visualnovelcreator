function getDialogue(page, index, assets){
    var pageA = assets[6].content.filter((p) => p.title === page);
    if(pageA.length === 0) return null;
    return pageA[0].listDialogues[index];
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

function getVariableValueByName(name, assets){
    var varA = assets[6].content.filter((p) => p.name === name);
    if(varA.length === 0) return null;
    var variable = varA[0];
    return getVariableValue(variable, assets);
}

function getVariableValue(variable, assets){
    if(variable.value.type === "value"){
        if(variable.type.name === "Boolean" && variable.value.operation !== "value"){
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
            return null;
        }
        return variable.value.value;
    }
    if(variable.value.type === "variable"){
        return getVariableValue(variable.value.value, assets);
    }
}

function getAssetIndex(index, name, assets){
    var asset = assets[index].content.filter((c) => c.name === name);
    if(asset.length === 0) return null;
    return asset[0];
}