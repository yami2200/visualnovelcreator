<template>
  <v-btn
      color="blue darken-1"
      icon
      @click="openHelp"
  >
    <v-icon>mdi-help-circle-outline</v-icon>
  </v-btn>
</template>

<script>
import {shell} from "electron";

export default {
  name: "VSM-HelpButton",

  props:["link"],

  methods:{
    openHelp(){
      if(this.link !== undefined && this.link !== ""){
        shell.openExternal(this.link);
      }
    },
  },
}
</script>

<style scoped>

</style>