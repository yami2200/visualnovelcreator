<template>
  <v-list-item>
    <v-btn @click="click" @mouseover="hover" @contextmenu="$emit('contextmenu', $event)" :width="getWidth" :style="{marginLeft : getIndentation}" :color="getColor"> </v-btn>
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
    hover(){
      this.switchMouseHoverPart("top", "", "", 0);
    },
    getInfoInsertHovering(direction){
      switch(direction){
        case "top":
        case "bottom":
          return {index: Math.max(this.index, 0), stopHover: this.mouseLeave, indentation: this.indentation};
      }
      return null;
    },
  },

}
</script>

<style scoped>

</style>