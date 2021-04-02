<template>
  <v-card width="150px" height="40px">
    <vsm-setter-integer :bus="bus1" :variable="variable"> </vsm-setter-integer>
    <v-card-text>
      <v-row justify="center" align="center">
        <p class="ml-5" style="float: left" v-if="variable!=undefined"> <strong> {{ variable.initialValue }} </strong> </p>
        <v-spacer></v-spacer>
        <v-btn icon class="mb-3" @click="editVar">
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
      </v-row>
    </v-card-text>

  </v-card>
</template>

<script>
import SetterInteger from "./variables/setter/VSM-VarSetterInteger";
import Vue from "vue";

export default {
  name: "VSM-SetterInteger",

  data: () => ({
    bus1: new Vue(),
  }),

  components:{
    "vsm-setter-integer" : SetterInteger,
  },

  props:["variable"],

  methods:{
    editVar(){
      this.bus1.$emit("showSetter"+this.variable.type.name);
    },
  },

}
</script>

<style scoped>

</style>