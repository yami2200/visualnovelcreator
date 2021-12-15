<template>
  <vsm-setterdefault  @changeVarSelecting="changeVarSelecting" @changeChoice="changeChoice" @save="save" @cancel="cancel" :bus="bus" :dialog="dialog" :disable-save-button="disableSaveButton" :list-compatible-variables="listCompatibleVariables" :ref-enabled="refEnabled" :onlyVariable="onlyVariable" :refEnabledArray="refEnabledArray" :assets="assets" :listvariables="listvariables">
    <v-container
        class="px-0"
        fluid
    >

      <v-select
          class="mt-5 ml-3"
          :disabled="disabledInputSpecific"
          :items="listAssetType"
          item-text="name"
          item-value="name"
          v-model="value"
          label="Choose a asset"
          solo
      ></v-select>

    </v-container>
  </vsm-setterdefault>
</template>

<script>
import {mix_settervariable} from "@/mixins/MIX_SetterVariable";
import VarSetterDefault from "./VSM-VarSetterDefault";

export default {
  name: "VSM-VarSetterBoolean",

  mixins: [mix_settervariable],

  computed:{
    listAssetType(){
      this.refreshComputed;
      let array = this.assets.filter((a) => a.type === this.type+"s");
      if(array.length === 0) return [];
      return [{name : "null"}].concat(JSON.parse(JSON.stringify(array[0])).content);
    },
  },

  components: {
    "vsm-setterdefault" : VarSetterDefault,
  },

  data: () => ({
    type: "rezr",
    value: "null",
  }),

  methods: {
    resetDefault(){
      this.value = "null";
      this.select = null;
    },
    showChar(){
      this.type = "Character";
      this.show();
    },
    showScene(){
      this.type = "Scene";
      this.show();
    },
    showObject(){
      this.type = "Object";
      this.show();
    },
    showMusic(){
      this.type = "Music";
      this.show();
    },
    showSound(){
      this.type = "Sound";
      this.show();
    },
  },

  mounted() {
    this.bus.$on('showSetterCharacter', this.showChar);
    this.bus.$on('showSetterScene', this.showScene);
    this.bus.$on('showSetterObject', this.showObject);
    this.bus.$on('showSetterMusic', this.showMusic);
    this.bus.$on('showSetterSound', this.showSound);
  },

}
</script>

<style scoped>

</style>