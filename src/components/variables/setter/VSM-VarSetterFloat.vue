<template>

  <vsm-setterdefault  @changeVarSelecting="changeVarSelecting" @changeChoice="changeChoice" @save="save" @cancel="cancel" :bus="bus" :dialog="dialog" :disable-save-button="disableSaveButton" :disabled-input-specific="disabledInputSpecific" :list-compatible-variables="listCompatibleVariables" :ref-enabled="refEnabled">
    <v-text-field
        v-model.number="value"
        :disabled="disabledInputSpecific"
        label="Float Number"
        append-outer-icon="mdi-plus-circle"
        @click:append-outer="increment"
        prepend-icon="mdi-minus-circle"
        @keydown="changeFloat($event)"
        type="number"
        @click:prepend="decrement">
    </v-text-field>
  </vsm-setterdefault>

</template>

<script>
import {mix_settervariable} from "@/mixins/MIX_SetterVariable";
import VarSetterDefault from "./VSM-VarSetterDefault";

export default {
  name: "VSM-VarSetterFloat",

  mixins: [mix_settervariable],

  components: {
    "vsm-setterdefault" : VarSetterDefault,
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