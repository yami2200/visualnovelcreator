<template>
  <vsm-setterdefault  @changeVarSelecting="changeVarSelecting" @changeChoice="changeChoice" @save="save" @cancel="cancel" :bus="bus" :dialog="dialog" :disable-save-button="disableSaveButton" :list-compatible-variables="listCompatibleVariables" :ref-enabled="refEnabled" :onlyVariable="onlyVariable" :refEnabledArray="refEnabledArray" :assets="assets" :listvariables="listvariables">
    <v-container
        class="px-0"
        fluid
    >
      <v-row>
        <v-col>
          <v-select
              :disabled="choice !== '1'"
              class="ml-3"
              :items="listOperation"
              v-model="operationSelected"
              label="Change String Operation"
              solo
              @change="changeOperation"
          ></v-select>
        </v-col>
        <v-col>
          <v-text-field
              v-model="value"
              v-if="operationSelected === 'value'"
              :disabled="choice !== '1'"
              label="String">
          </v-text-field>
          <v-select
              v-else-if="operationSelected === 'to String'"
              :disabled="choice !== '1'"
              class="ml-3"
              :items="listTypeVar"
              item-text="name"
              v-model="selectTypeVar"
              return-object
              label="Select Type Inputs"
              @change="changeType"
              solo
          ></v-select>
          <vsm-settervariable v-else-if="operationSelected === 'Concat'" :assets="assets" :variable="input1" :listvar="listvariables" :initialval="!refEnabledInput"></vsm-settervariable>
        </v-col>
        <v-col v-if="operationSelected !== 'value'">
          <vsm-settervariable :assets="assets" :variable="input2" :listvar="listvariables" :initialval="!refEnabledInput"></vsm-settervariable>
        </v-col>
      </v-row>
    </v-container>
  </vsm-setterdefault>
</template>

<script>
import {mix_settervariable} from "@/mixins/MIX_SetterVariable";
import VarSetterDefault from "./VSM-VarSetterDefault";
import listVariables from "@/assets/listTypesVariables.json";

export default {
  name: "VSM-VarSetterString",

  mixins: [mix_settervariable],

  components: {
    "vsm-setterdefault" : VarSetterDefault,
    "vsm-settervariable" : () => import("../VSM-SetterVariable"),
  },

  computed:{
    refEnabledInput() {
      return this.refEnable !== undefined && this.refEnable;// && this.listvariables.filter((v) => v.type.name === this.input2.type.name).length > 0;
    }
  },

  data: () => ({
    type: "String",
    value: "",
    operationSelected: "value",
    selectTypeVar: listVariables[0],
    listTypeVar: listVariables,
    listOperation: ["value", "to String", "Concat"],
    input1: {
      type : {
        name : "String",
        icon : "mdi-format-letter-case",
        color : "#e34dd7",
        defaultValue : ""
      },
      name : "input1",
      value: {
        type: "value",
        value: ""
      }
    },
    input2: {
      type : {
        name : "String",
        icon : "mdi-format-letter-case",
        color : "#e34dd7",
        defaultValue : ""
      },
      name : "input1",
      value: {
        type: "value",
        value: ""
      }
    },
  }),

  methods: {
    resetDefault(){
      this.value = "";
      this.operationSelected = "value";
      this.select = null;
      this.selectTypeVar = listVariables[0];
    },
    changeType(){
      this.input1.type = this.selectTypeVar;
      this.input2.type = this.selectTypeVar;
      this.input1.value = {type: "value", value: this.input1.type.defaultValue};
      this.input2.value = {type: "value", value: this.input2.type.defaultValue};
    },
    changeOperation(){
      if(this.operationSelected === "Concat" && this.input2.type.name !== "String"){
        this.input2.type = this.listTypeVar[2];
        this.input2.value = {type: "value", value: this.input2.type.defaultValue};
      } else if(this.operationSelected === "to String"){
        this.selectTypeVar = this.input2.type;
      }
    },
    save(valueArray){
      if(this.disableSaveButton) return;
      if(this.choice === "1") {
        let valText = this.value;
        this.$emit("newval", {type: "value", operation: this.operationSelected ,value: valText, input1 : this.input1, input2: this.input2});
      } else if (this.choice === "2") {
        if(this.select == null) return;
        if(this.select.name === undefined) this.$emit("newval", {type: "variable", value: this.select});
        else this.$emit("newval", {type: "variable", value: this.select.name});
      } else {
        this.$emit("newval", {type: "arrayElement", value: valueArray});
      }
      this.hide();
    },
    show() {
      this.dialog = true;
      this.resetDefault();
      let array_value = null;
      if(this.variable.value.type === "value") {
        this.choice = "1";
        if(this.variable.value.operation === undefined || this.variable.value.operation === "value"){
          this.value = this.variable.value.value;
          this.operationSelected = "value";
        } else {
          this.value = false;
          this.input1 = this.variable.value.input1;
          this.input2 = this.variable.value.input2;
          this.operationSelected = this.variable.value.operation;
          this.selectTypeVar = this.input2.type;
        }
      } else if(this.variable.value.type === "variable" && this.refEnabled) {
        let val = this.listCompatibleVariables.filter((v) => v.name === this.variable.value.value);
        if(val.length === 0){
          this.choice = "1";
          this.operationSelected = "value";
          this.value = this.variable.type.defaultValue;
        } else {
          this.choice = "2";
          this.select = val[0].name;
        }
      } else if (this.variable.value.type === "arrayElement" && this.refEnabledArray){
        if(this.variable.value.value.array !== undefined && this.variable.value.value.index !== undefined){ array_value = JSON.parse(JSON.stringify(this.variable.value.value)); }
        this.choice = "3";
      } else {
        this.choice = "1";
        this.value = this.variable.type.defaultValue;
      }
      this.bus.$emit("setVarSetterInitial", {choice: this.choice, select: this.select, arrayvalue: array_value});
      this.$forceUpdate();
    },
  },

}
</script>

<style scoped>

</style>