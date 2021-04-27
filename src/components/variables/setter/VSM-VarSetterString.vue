<template>
  <vsm-setterdefault  @changeVarSelecting="changeVarSelecting" @changeChoice="changeChoice" @save="save" @cancel="cancel" :bus="bus" :dialog="dialog" :disable-save-button="disableSaveButton" :disabled-input-specific="disabledInputSpecific" :list-compatible-variables="listCompatibleVariables" :ref-enabled="refEnabled" :onlyVariable="onlyVariable">
    <v-text-field
        v-model="value"
        :disabled="choice !== '1'"
        label="String">
    </v-text-field>
  </vsm-setterdefault>
</template>

<script>
import {mix_settervariable} from "@/mixins/MIX_SetterVariable";
import VarSetterDefault from "./VSM-VarSetterDefault";

export default {
  name: "VSM-VarSetterString",

  mixins: [mix_settervariable],

  components: {
    "vsm-setterdefault" : VarSetterDefault,
  },

  data: () => ({
    type: "String",
    value: "",
  }),

  methods: {
    resetDefault(){
      this.value = "";
      this.select = null;
    }
  },

}
</script>

<style scoped>

</style>