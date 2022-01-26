<template>
  <div>
    <v-list-item two-line>
      <v-card :width="getWidth" :min-width="getWidth" :style="{marginLeft : getIndentation, boxShadow: getBorder}" :color="getColor" height="55px" @contextmenu="contextMenuDM" @click="select">
        <v-row>
          <h2 class="ml-6 mr-1 mt-7"> {{ functionAction.name }} {{ functionAction.inputs.length>0  ? ':' : ''}} </h2>

          <vsm-setter :initialval="false" :variable="functionAction.inputs[0]" :assets="assets" :listvar="assets[5].content" class="mt-5 ml-2" :onlyVariable="functionAction.inputs[0].onlyvar !== undefined && functionAction.inputs[0].onlyvar" :showName="true"></vsm-setter>
          <vsm-setter :initialval="false" :variable="functionAction.inputs[1]" :assets="assets" :listvar="assets[5].content" class="mt-5 ml-2" :onlyVariable="functionAction.inputs[1].onlyvar !== undefined && functionAction.inputs[1].onlyvar" :showName="true"></vsm-setter>

          <v-col cols="12" xl="4" sm="4">
            <v-select
                class="mt-2"
                dense
                :items="listTypeVariables"
                item-text="name"
                item-value="name"
                v-model="functionAction.inputs[2].value.value"
                label="Choose a type to push"
                solo
                @click.stop
                @change="changeVar"
            ></v-select>
          </v-col>

          <vsm-setter v-if="functionAction.inputs[2].value.value !== ''" :initialval="false" :variable="functionAction.inputs[3]" :assets="assets" :listvar="assets[5].content" class="mt-5" :showName="true"></vsm-setter>
          <v-spacer></v-spacer>
          <v-btn icon class="ml-5 mr-5 mt-5" @click.stop="deleteF">
            <v-icon color="black">mdi-delete</v-icon>
          </v-btn>
        </v-row>
      </v-card>
    </v-list-item>
  </div>
</template>

<script>
import {mix_scriptcomponent} from "@/mixins/MIX_ScriptComponent";
import setter from "@/components/variables/VSM-SetterVariable";
import listTypeVariables from "@/assets/listTypesVariables.json";

export default {
  name: "VSM-ScriptCompBasic",

  mixins: [mix_scriptcomponent],

  computed:{
    listTypeVariables(){
      return listTypeVariables;
    },
  },

  components:{
    "vsm-setter" : setter,
  },

  methods:{
    changeVar(){
      var list = listTypeVariables.filter((v) => v.name === this.functionAction.inputs[2].value.value);
      if(list.length===0) return;
      var variableSelected = list[0];
      this.functionAction.inputs[3].type = variableSelected;
      this.functionAction.inputs[3].value = {
        type: "value",
        value: variableSelected.defaultValue
      };
    },
    click(){
      this.$emit("click", this.index);
    },
  },

}
</script>

<style scoped>

</style>