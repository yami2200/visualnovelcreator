<template>

  <vsm-setterdefault  @changeVarSelecting="changeVarSelecting" @changeChoice="changeChoice" @save="save" @cancel="cancel" :bus="bus" :dialog="dialog" :disable-save-button="disableSaveButton" :list-compatible-variables="listCompatibleVariables" :ref-enabled="refEnabled" :onlyVariable="onlyVariable" :refEnabledArray="refEnabledArray" :assets="assets" :listvariables="listvariables">
    <v-row>
      <v-col v-if="operationSelected !== 'exp' && operationSelected !== 'array length'">
        <v-text-field
            v-if="operationSelected === 'value'"
            v-model="value"
            :disabled="disabledInputSpecific"
            label="Float Number"
            append-outer-icon="mdi-plus-circle"
            @click:append-outer="increment"
            prepend-icon="mdi-minus-circle"
            @keydown="changeFloat($event)"
            type="number"
            :rules="[rules.required]"
            @click:prepend="decrement">
        </v-text-field>
        <vsm-settervariable v-else :assets="assets" :variable="input1" :listvar="listvariables" :initialval="!refEnabledInput1"></vsm-settervariable>
      </v-col>
      <v-col>
        <v-select
            :disabled="choice !== '1'"
            class="ml-3"
            :items="listOperator"
            v-model="operationSelected"
            label="Change Float Operation"
            solo
            @change="changeTypeOperator"
        ></v-select>
      </v-col>
      <v-col v-if="operationSelected !== 'value'">
        <vsm-settervariable :assets="assets" :variable="input2" :listvar="listvariables" :initialval="!refEnabledInput2"></vsm-settervariable>
      </v-col>
    </v-row>

  </vsm-setterdefault>

</template>

<script>
import {mix_settervariable} from "@/mixins/MIX_SetterVariable";
import {mix_settervariablenumber} from "@/mixins/MIX_SetterVariableNumber";
import VarSetterDefault from "./VSM-VarSetterDefault";

export default {
  name: "VSM-VarSetterFloat",

  mixins: [mix_settervariable, mix_settervariablenumber],

  components: {
    "vsm-setterdefault" : VarSetterDefault,
    "vsm-settervariable" : () => import("../VSM-SetterVariable"),
  },

  computed:{
    listCompatibleVariables(){
      return this.listvariables.filter((v) => (v.type.name === this.type || v.type.name === "Integer") && v.name !== this.variable.name);
    },
  },

  data: () => ({
    type: "Float",
    value: 0.0,
  }),

  methods: {
    increment() {
      this.value++;
    },
    decrement() {
      this.value--;
    },
    changeFloat(e){
      if(e.key === "Backspace") return;
      if(e.key === "-") return;
      if(!["0","1","2","3","4","5","6","7","8","9"].includes(e.key)){
        if(e.key === "," || e.key === "."){
          if(!this.value.toString().includes(".")) return;
        }
        e.preventDefault();
      }
    },
    resetDefault(){
      this.value = 0;
      this.select = null;
    }
  }

}
</script>

<style scoped>

</style>