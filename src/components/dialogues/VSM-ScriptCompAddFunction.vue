<template>
  <v-list-item>
    <v-btn @click="click" :width="getWidth" :style="{marginLeft : getIndentation}" :color="getColor"> </v-btn>
  </v-list-item>
</template>

<script>
import {mix_scriptcomponent} from "@/mixins/MIX_ScriptComponent";

export default {
  name: "VSM-ScriptCompAddFunction",

  mixins: [mix_scriptcomponent],

  data: () => ({
    lightColor : "#e3e3e3",
    darkColor : "#c1c1c1"
  }),

  methods:{
    click(){
      this.$emit("click", this.index, this.indentation);
    },
  },

}
</script>

<style scoped>

</style>