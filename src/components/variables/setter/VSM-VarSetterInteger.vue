<template>

  <vsm-setterdefault  @changeVarSelecting="changeVarSelecting" @changeChoice="changeChoice" @save="save" @cancel="cancel" :bus="bus" :dialog="dialog" :disable-save-button="disableSaveButton" :disabled-input-specific="disabledInputSpecific" :list-compatible-variables="listCompatibleVariables" :ref-enabled="refEnabled" :onlyVariable="onlyVariable">
    <v-text-field
        v-model.number="value"
        :disabled="disabledInputSpecific"
        label="Number"
        @keydown="changeInt($event)"
        append-outer-icon="mdi-plus-circle"
        @click:append-outer="increment"
        prepend-icon="mdi-minus-circle"
        type="number"
        @click:prepend="decrement">
    </v-text-field>
  </vsm-setterdefault>

</template>

<script>
import {mix_settervariable} from "@/mixins/MIX_SetterVariable";
import VarSetterDefault from "./VSM-VarSetterDefault";

export default {
  name: "VSM-VarSetterInteger",

  mixins: [mix_settervariable],

  components: {
    "vsm-setterdefault" : VarSetterDefault,
  },

  data: () => ({
    type: "Integer",
    value: 0,
  }),

  methods: {
    increment() {
      this.value++;
    },
    decrement() {
      this.value--;
    },
    changeInt(e){
      if(e.key === "Backspace") return;
      if(!["0","1","2","3","4","5","6","7","8","9"].includes(e.key)){
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