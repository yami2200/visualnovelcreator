export const mix_settervariable = {

    data: () => ({
        dialog: false,
        type: "",
        choice: "1",
        value: null,
        select: null,
        refreshComputed: true,
    }),

    computed:{
        refEnabled(){
            return this.refEnable !== undefined && this.refEnable && this.listCompatibleVariables.length > 0;
        },
        refEnabledArray(){
            return this.refEnable !== undefined && this.refEnable && this.listArrayVariables.length > 0;
        },

        listCompatibleVariables(){
            return this.listvariables.filter((v) => v.type.name === this.type && v.name !== this.variable.name);
        },
        listArrayVariables(){
            return this.listvariables.filter((v) => v.type.name === "Array" && v.name !== this.variable.name);
        },

        disabledInputSpecific(){
            return this.choice === "2" && this.listCompatibleVariables.length > 0;
        },
        disableSaveButton(){
            return (this.choice === "1" && this.value==null) || (this.choice === "2" && this.select==null);
        },
    },

    methods: {
        show(preferVariable) {
            this.dialog = true;
            let array_value = null;
            this.resetDefault();
            this.refreshComputed = !this.refreshComputed;
            if (this.variable.value.type === "arrayElement" && this.refEnabledArray) {
                if (this.variable.value.value.array !== undefined && this.variable.value.value.index !== undefined) {
                    array_value = JSON.parse(JSON.stringify(this.variable.value.value));
                }
                this.choice = "3";
            } else if(this.onlyVariable){
                this.choice = "2";
                let val = this.listCompatibleVariables.filter((v) => v.name === this.variable.value.value);
                if(val.length === 0){
                    this.select = null;
                } else {
                    this.select = val[0].name;
                }
            } else if( this.variable.value.type === "variable" && this.refEnabled) {
                let val = this.listCompatibleVariables.filter((v) => v.name === this.variable.value.value);
                if (val.length === 0) {
                    this.choice = "1";
                    this.value = this.variable.type.defaultValue;
                } else {
                    this.choice = "2";
                    this.select = val[0].name;
                }
            } else if(this.variable.value.type === "value") {
                this.choice = "1";
                this.value = this.variable.value.value;
            } else {
                this.choice = "1";
                this.value = this.variable.type.defaultValue;
            }

            if((preferVariable !== undefined && preferVariable) && this.variable.value.type === "value" && (this.variable.value.value.values === undefined || (this.variable.value.value.values !== undefined && this.variable.value.value.values.length < 1))){
                this.choice = "2";
                this.select = null;
            }

            this.bus.$emit("setVarSetterInitial", {choice: this.choice, select: this.select, arrayvalue: array_value});
            this.$forceUpdate();
        },
        hide() {
            this.dialog = false;
        },
        resetDefault(){
          console.log("reset Default not implemented !")  ;
        },
        save(valueArray){
            if(this.disableSaveButton) return;
            if(this.choice === "1") {
                this.$emit("newval", {type: "value", value: this.value});
            } else if(this.choice === "3"){
                if(valueArray === undefined || valueArray === null || valueArray.array === undefined || valueArray.index === undefined) return;
                this.$emit("newval", {type: "arrayElement", value: valueArray});
            } else {
                if(this.select == null) return;
                if(this.select.name === undefined) this.$emit("newval", {type: "variable", value: this.select});
                else this.$emit("newval", {type: "variable", value: this.select.name});
            }
            this.hide();
        },
        cancel(){
            this.hide();
        },
        changeChoice(c){
            this.choice = c;
        },
        changeVarSelecting(s){
          this.select = s;
        },
    },

    mounted() {
        this.bus.$on('showSetter' + this.type, this.show);
        this.bus.$on('hideSetter' + this.type, this.hide);
    },

    props: ["bus", "variable", "refEnable", "listvariables", "onlyVariable", "assets"],
}