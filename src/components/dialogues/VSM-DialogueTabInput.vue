<template>
  <v-card flat height="500">
    <v-row class="mt-4">
      <v-col cols="12" xl="6" md="6" sm="9">
          <v-select
              :items="listTypesInput"
              v-model="selected"
              label="Change Input Type"
              solo
              @change="changeType"
          ></v-select>
      </v-col>
    </v-row>
    <v-row class="mt-4 ml-1">
      <span class="mt-2 mr-4"> Variable : </span>
      <vsm-setter :variable="current.input" :listvar="assets[5].content" :initialval="false" :assets="assets" :only-variable="true"> </vsm-setter>
    </v-row>
  </v-card>
</template>

<script>
import setter from "@/components/variables/VSM-SetterVariable"
import listTypes from "@/assets/listTypesVariables.json"

export default {
  name: "VSM-DialogueTabBasic",

  components:{
    "vsm-setter" : setter
  },

  props:["current", "assets"],

  data : () => ({
    listTypesInput : ["String", "Integer"],
    selected : "String",
  }),

  methods:{
    changeType(){
      var type = listTypes.filter(t => t.name === this.selected);
      if(type.length===0) return;
      this.current.input.type = type[0];
      this.current.input.value.value = "";
    },
  }
}
</script>

<style scoped>

</style>