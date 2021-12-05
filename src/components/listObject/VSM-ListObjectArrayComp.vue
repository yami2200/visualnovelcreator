<template>
  <v-row>
    <p class="ml-2 mt-5 mr-2">{{ index + ' - '}}</p>

    <v-list-item-avatar class="mr-2">
      <v-icon :color="variable.type.color" large> {{ variable.type.icon }} </v-icon>
    </v-list-item-avatar>

    <v-list-item-content>
      <vsm-settervariable :assets="assets" :variable="variable" :listvar="listvariables" :initialval="initialval"> </vsm-settervariable>
    </v-list-item-content>
  </v-row>
</template>

<script>


export default {
  name: "VSM-ListObjectVariableComp",

  props : ["variable", "index", "assets", "listvariables", "initialval"],

  components:{
    "vsm-settervariable" : () => import("@/components/variables/VSM-SetterVariable"),
  },
}
</script>

<style scoped>

</style>