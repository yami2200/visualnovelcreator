<template>
  <vsm-setterdefault  @changeVarSelecting="changeVarSelecting" @changeChoice="changeChoice" @save="save" @cancel="cancel" :bus="bus" :dialog="dialog" :disable-save-button="disableSaveButton" :disabled-input-specific="disabledInputSpecific" :list-compatible-variables="listCompatibleVariables" :ref-enabled="refEnabled">
    <v-container
        class="px-0"
        fluid
    >
      <v-checkbox
          v-model="value"
          :label="`Value Boolean : ${value.toString()}`"
      ></v-checkbox>
    </v-container>
  </vsm-setterdefault>
</template>

<script>
import {mix_settervariable} from "@/mixins/MIX_SetterVariable";
import VarSetterDefault from "./VSM-VarSetterDefault";

export default {
  name: "VSM-VarSetterBoolean",

  mixins: [mix_settervariable],

  components: {
    "vsm-setterdefault" : VarSetterDefault,
  },

  data: () => ({
    type: "Boolean",
    value: false,
  }),

  methods: {
    resetDefault(){
      this.value = false;
      this.select = null;
    }
  },

}
</script>

<style scoped>

</style>