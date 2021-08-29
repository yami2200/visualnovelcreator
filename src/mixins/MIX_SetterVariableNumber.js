import {getTextOperationNumberVariable} from "@/lib";

export const mix_settervariablenumber = {

    props:["assets"],

    data: () => ({
        listOperator : ["value" , "+", "-", "x", "÷", "Random", "Min", "Max"],
        operationSelected : "value",
        rules: {
            required: value => !!value || 'Not Correct.',
        },
        input1 : {
            type: {
                name : "Float",
                icon : "mdi-decimal",
                color : "#4de396",
                defaultValue : 1.0
            },
            name: "input1",
            value: {
                type: "value",
                value: 0.0
            }
        },
        input2 : {
            type: {
                name : "Float",
                icon : "mdi-decimal",
                color : "#4de396",
                defaultValue : 1.0
            },
            name: "input2",
            value: {
                type: "value",
                value: 0.0
            }
        },
    }),

    computed:{
        disableOperation(){
            return !(this.refEnable!=undefined && this.refEnable);
        },
        refEnabledInput1() {
            return this.refEnable!=undefined && this.refEnable && this.listvariables.filter((v) => v.type.name === this.input1.type.name).length > 0;
        },
        refEnabledInput2() {
            return this.refEnable!=undefined && this.refEnable && this.listvariables.filter((v) => v.type.name === this.input2.type.name).length > 0;
        }
    },

    methods:{
        changeTypeOperator(){

        },
        show(){
            this.dialog = true;
            this.resetDefault();
            if(this.onlyVariable){
                this.choice = "2";
                let val = this.listCompatibleVariables.filter((v) => v.name === this.variable.value.value);
                if(val.length === 0){
                    this.select = null;
                } else {
                    this.select = val[0].name;
                }
            } else if(this.variable.value.type === "value") {
                this.choice = "1";
                if(this.variable.value.operation === undefined || this.variable.value.operation === "value"){
                    this.value = this.variable.value.value;
                    this.operationSelected = "value";
                } else {
                    this.value = 0;
                    this.input1 = this.variable.value.input1;
                    this.input2 = this.variable.value.input2;
                    this.operationSelected = this.variable.value.operation;
                }
            } else if(this.variable.value.type === "variable" && this.refEnabled) {
                let val = this.listCompatibleVariables.filter((v) => v.name === this.variable.value.value);
                if(val.length === 0){
                    this.choice = "1";
                    this.value = this.variable.type.defaultValue;
                } else {
                    this.choice = "2";
                    this.select = val[0].name;
                }
            } else {
                this.choice = "1";
                this.value = this.variable.type.defaultValue;
            }
            this.bus.$emit("setVarSetterInitial", {choice: this.choice, select: this.select});
            this.$forceUpdate();
        },
        save(){
            if(this.disableSaveButton) return;
            if(this.choice === "1") {
                let valText = this.value;
                if(this.value === "") valText = this.variable.type.defaultValue;
                if(this.operationSelected !== "value"){
                    valText = getTextOperationNumberVariable(this.input1, this.input2, this.operationSelected);
                }
                this.$emit("newval", {type: "value", operation: this.operationSelected ,value: valText, input1 : this.input1, input2: this.input2});
            } else {
                if(this.select == null) return;
                if(this.select.name === undefined) this.$emit("newval", {type: "variable", value: this.select});
                else this.$emit("newval", {type: "variable", value: this.select.name});
            }
            this.hide();
        },
    },

}