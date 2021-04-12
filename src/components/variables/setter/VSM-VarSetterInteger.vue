<template>

  <vsm-setterdefault  @changeVarSelecting="changeVarSelecting" @changeChoice="changeChoice" @save="save" @cancel="cancel" :bus="bus" :dialog="dialog" :disable-save-button="disableSaveButton" :disabled-input-specific="disabledInputSpecific" :list-compatible-variables="listCompatibleVariables" :ref-enabled="refEnabled">
    <v-text-field
        v-model.number="value"
        :disabled="disabledInputSpecific"
        label="Number"
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
    resetDefault(){
      this.value = 0;
      this.select = null;
    }
  }

}
</script>

<style scoped>

</style>