<template>
  <v-row>
    <v-list-item-avatar>
      <v-icon :color="getColor(dialogue.type)" small> {{ getIcon(dialogue.type) }} </v-icon>
    </v-list-item-avatar>

    <v-list-item-content>
      <v-list-item-title style="overflow: visible;" class="text-h8"> {{dialogue.title}} </v-list-item-title>
    </v-list-item-content>

    <v-list-item-action>
      <v-btn rounded icon @click="goTo">
        <v-icon>
          mdi-eye
        </v-icon>
      </v-btn>
    </v-list-item-action>
  </v-row>
</template>

<script>
export default {
  name: "VSM-ListObjectVariableComp",

  props : ["dialogue"],

  methods:{
    getIcon(type){
      switch(type){
        case "dialogue":
          return "mdi-message-outline";
        case "choices":
          return "mdi-order-bool-descending-variant";
        case "condition":
          return "mdi-checkbox-outline";
        case "function":
          return "mdi-function";
        case "input":
          return "mdi-tooltip-edit";
        case "transition":
          return "mdi-swap-horizontal";
      }
      return "mdi-message-outline";
    },
    getColor(type){
      switch(type){
        case "dialogue":
          return "#519e24";
        case "choices":
          return "#097791";
        case "condition":
          return "#b30d02";
        case "function":
          return "#ba5e14";
        case "input":
          return "#d6d206";
        case "transition":
          return "#251499";
      }
      return "#000000";
    },
    goTo(){
      this.$emit("goToDialogue", this.dialogue)
    },
  },
}
</script>

<style scoped>

</style>