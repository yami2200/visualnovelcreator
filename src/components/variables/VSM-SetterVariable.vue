<template>
  <v-card height="40px" @click.stop="editVar" min-width="50">

    <vsm-setter-integer @newval="setNewValue" :assets="assets" :bus="bus1" :variable="variable" :listvariables="listvar" :refEnable="!initialval" :onlyVariable="onlyVariable"> </vsm-setter-integer>
    <vsm-setter-string @newval="setNewValue" :assets="assets" :bus="bus1" :variable="variable" :listvariables="listvar" :refEnable="!initialval" :onlyVariable="onlyVariable"> </vsm-setter-string>
    <vsm-setter-float @newval="setNewValue" :assets="assets" :bus="bus1" :variable="variable" :listvariables="listvar" :refEnable="!initialval" :onlyVariable="onlyVariable"> </vsm-setter-float>
    <vsm-setter-boolean @newval="setNewValue" :assets="assets" :bus="bus1" :variable="variable" :listvariables="listvar" :refEnable="!initialval" :onlyVariable="onlyVariable"> </vsm-setter-boolean>
    <vsm-setter-asset @newval="setNewValue" :bus="bus1" :variable="variable" :listvariables="listvar" :refEnable="!initialval" :assets="assets" :onlyVariable="onlyVariable"> </vsm-setter-asset>
    <vsm-setter-array @newval="setNewValue" :bus="bus1" :variable="variable" :listvariables="listvar" :refEnable="!initialval" :assets="assets" :onlyVariable="onlyVariable" :prefer-variable="preferVariable"></vsm-setter-array>

    <v-tooltip top :disabled="disableTooltip">
      <template v-slot:activator="{ on }">
        <v-card-text v-on="on">
          <v-row justify="center" align="center">
            <p class="ml-1 mr-1" style="float: left; margin-top: 5px; user-select: none;" :style="{color: colorText}" v-if="variable!==undefined"> <strong> {{ valueShow }} </strong> </p>
          </v-row>
        </v-card-text>
      </template>
      <span>{{ tooltipText }}</span>
    </v-tooltip>

  </v-card>
</template>

<script>
import SetterInteger from "./setter/VSM-VarSetterInteger";
import SetterString from "./setter/VSM-VarSetterString";
import SetterFloat from "./setter/VSM-VarSetterFloat";
import SetterBoolean from "./setter/VSM-VarSetterBoolean";
import SetterAsset from "./setter/VSM-VarSetterAsset";
import SetterArray from "./setter/VSM-VarSetterArray";

import Vue from "vue";

export default {
  name: "VSM-SetterInteger",

  data: () => ({
    bus1: new Vue(),
  }),

  computed:{
    valueShow(){
      if(this.variable.value.value === "") return "none";
      if(this.variable.type.name === "Array" && this.variable.value.type === "value") return "array of [" +this.variable.value.value.values.length+ "]";
      if(this.variable.value.type === "arrayElement"){
        if(this.variable.value.value.array !== undefined && this.variable.value.value.index !== undefined) return (this.variable.value.value.array.value.type === "variable" ? this.variable.value.value.array.value.value : "staticArray") + "[" + this.variable.value.value.index.value.value + "]";
        return "none";
      }
      return this.variable.value.value;
    },
    colorText(){
      if(this.valueShow === "null" || this.variable.value.value === ""){
        return "#960000";
      }
      return this.$vuetify.theme.themes[this.theme].text;
    },
    theme(){
      return (this.$vuetify.theme.dark) ? 'dark' : 'light'
    },
    tooltipText(){
      return "Edit "+this.variable.name;
    },
    disableTooltip(){
      return this.showName === undefined || !this.showName;
    },
  },

  components:{
    "vsm-setter-integer" : SetterInteger,
    "vsm-setter-string" : SetterString,
    "vsm-setter-float" : SetterFloat,
    "vsm-setter-boolean" :SetterBoolean,
    "vsm-setter-asset" : SetterAsset,
    "vsm-setter-array" : SetterArray,
  },

  props:["variable", "listvar", "initialval", "assets", "onlyVariable", "showName", "preferVariable"],

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