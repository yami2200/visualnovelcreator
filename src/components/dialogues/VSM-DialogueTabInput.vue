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
    <v-row class="ml-1">
      <span class="mt-2 mr-4"> Variable : </span>
      <vsm-setter :variable="current.input" :listvar="assets[5].content" :initialval="false" :assets="assets" :only-variable="true"> </vsm-setter>
    </v-row>
    <v-row class="mt-6">
      <v-col cols="12" sm="6" md="6" xl="6">
        <span class="mt-2 mr-4"> Min {{ addonTextMinMax }} : </span>
        <v-text-field
            v-model.number="current.minInput"
            @keydown="changeInt($event)"
            type="number">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="6" xl="6">
        <span class="mt-2 mr-4"> Max {{ addonTextMinMax }} : </span>
        <v-text-field
            v-model.number="current.maxInput"
            @keydown="changeInt($event)"
            type="number">
        </v-text-field>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import setter from "@/components/variables/VSM-SetterVariable"
import listTypes from "@/assets/listTypesVariables.json"
import {mix_editdialoguetab} from "@/mixins/MIX_EditDialogueTab";

export default {
  name: "VSM-DialogueTabBasic",

  components:{
    "vsm-setter" : setter
  },

  mixins: [mix_editdialoguetab],

  data : () => ({
    listTypesInput : ["String", "Integer"],
    selected : "String",
    addonTextMinMax : "characters",
  }),

  methods:{
    changeType(){
      var type = listTypes.filter(t => t.name === this.selected);
      if(type.length===0) return;
      this.current.input.type = type[0];
      this.current.input.value.value = "";
      if(this.selected === "String"){
        this.addonTextMinMax = "characters";
      } else if(this.selected === "Integer"){
        this.addonTextMinMax = "integer";
      }
    },
    changeInt(e){
      if(e.key === "Backspace") return;
      if(!["0","1","2","3","4","5","6","7","8","9"].includes(e.key)){
        e.preventDefault();
      }
    },
  },

  mounted() {
    if(this.current.input.type.name === "Integer") {
      this.selected = "Integer";
      this.addonTextMinMax = "integer";
    }
  }
}
</script>

<style scoped>

</style>