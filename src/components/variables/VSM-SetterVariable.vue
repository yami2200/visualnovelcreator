<template>
  <v-card height="40px">

    <vsm-setter-integer @newval="setNewValue" :bus="bus1" :variable="variable" :listvariables="listvar" :refEnable="!initialval"> </vsm-setter-integer>
    <vsm-setter-string @newval="setNewValue" :bus="bus1" :variable="variable" :listvariables="listvar" :refEnable="!initialval"> </vsm-setter-string>
    <vsm-setter-float @newval="setNewValue" :bus="bus1" :variable="variable" :listvariables="listvar" :refEnable="!initialval"> </vsm-setter-float>
    <vsm-setter-boolean @newval="setNewValue" :assets="assets" :bus="bus1" :variable="variable" :listvariables="listvar" :refEnable="!initialval"> </vsm-setter-boolean>
    <vsm-setter-asset @newval="setNewValue" :bus="bus1" :variable="variable" :listvariables="listvar" :refEnable="!initialval" :assets="assets"> </vsm-setter-asset>

    <v-card-text>
      <v-row justify="center" align="center">
        <p class="ml-5" style="float: left" v-if="variable!==undefined"> <strong> {{ valueShow }} </strong> </p>
        <v-spacer></v-spacer>
        <v-btn icon class="mb-3" @click="editVar">
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
      </v-row>
    </v-card-text>

  </v-card>
</template>

<script>
import SetterInteger from "./setter/VSM-VarSetterInteger";
import SetterString from "./setter/VSM-VarSetterString";
import SetterFloat from "./setter/VSM-VarSetterFloat";
import SetterBoolean from "./setter/VSM-VarSetterBoolean";
import SetterAsset from "./setter/VSM-VarSetterAsset";

import Vue from "vue";

export default {
  name: "VSM-SetterInteger",

  data: () => ({
    bus1: new Vue(),
  }),

  computed:{
    valueShow(){
      return this.variable.value.value;
    }
  },

  components:{
    "vsm-setter-integer" : SetterInteger,
    "vsm-setter-string" : SetterString,
    "vsm-setter-float" : SetterFloat,
    "vsm-setter-boolean" :SetterBoolean,
    "vsm-setter-asset" : SetterAsset,
  },

  props:["variable", "listvar", "initialval", "assets"],

  methods:{
    editVar(){
      this.bus1.$emit("showSetter"+this.variable.type.name);
    },
    setNewValue(data){
      if(data==null) return;
      this.variable.value = data;
    }
  },

}
</script>

<style scoped>

</style>