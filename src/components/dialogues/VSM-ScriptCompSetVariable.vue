<template>
  <div>
    <vsm-contextmenu
      :bus="busCM"
      :item-context-menu="itemsContextMenu"
      @insertnew="insertNewFunctionTop"
      @movetop="moveFunctionTop"
    >
    </vsm-contextmenu>
    <v-list-item two-line>
      <v-card :width="getWidth" :min-width="getWidth" :style="{marginLeft : getIndentation}" :color="getColor" height="55px" @contextmenu="contextMenuDM">
        <v-row>
          <h2 class="ml-6 mr-1 mt-7"> {{ functionAction.name }} {{ functionAction.inputs.length>0  ? ':' : ''}} </h2>

          <v-col cols="12" xl="4" sm="4">
            <v-select
                class="mt-2"
                dense
                :items="listVariables"
                item-text="name"
                item-value="name"
                v-model="functionAction.inputs[0].value.value"
                label="Choose a variable"
                solo
                @change="changeVar"
            ></v-select>
          </v-col>

          <vsm-setter v-if="functionAction.inputs[0].value.value !== ''" :key="index" :initialval="false" :variable="functionAction.inputs[1]" :assets="assets" :listvar="assets[5].content" class="ml-2 mt-5" :showName="true"></vsm-setter>
          <v-spacer></v-spacer>
          <v-btn icon class="ml-5 mr-5 mt-5" @click="deleteF">
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
import contextmenu from "@/components/VSM-ContextMenu"

export default {
  name: "VSM-ScriptCompBasic",

  mixins: [mix_scriptcomponent],

  computed:{
    listVariables(){
      return this.assets[5].content;
    },
  },

  components:{
    "vsm-setter" : setter,
    "vsm-contextmenu" : contextmenu
  },

  methods:{
    changeVar(){
      var list = this.assets[5].content.filter((v) => v.name === this.functionAction.inputs[0].value.value);
      if(list.length===0) return;
      var variableSelected = list[0];
      this.functionAction.inputs[1].type = variableSelected.type;
      this.functionAction.inputs[1].value = {
        type: "value",
        value: variableSelected.type.defaultValue
      };
    },
    click(){
      this.$emit("click", this.index);
    },
    deleteF(){
      this.$emit("delete", this.index);
    }
  },

}
</script>

<style scoped>

</style>