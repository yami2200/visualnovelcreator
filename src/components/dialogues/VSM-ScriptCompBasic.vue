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
        <v-row align="center" align-content="center" class="mt-2">
          <h2 class="ml-6 mr-5" :class="{'mt-2' : functionAction.inputs.length === 0}"> {{ functionAction.name }} {{ functionAction.inputs.length>0  ? ':' : ''}} </h2>
          <vsm-setter v-for="(setInput, index) in functionAction.inputs" :key="index" :initialval="false" :variable="setInput" :assets="assets" :listvar="assets[5].content" class="ml-2" :onlyVariable="setInput.onlyvar !== undefined && setInput.onlyvar" :showName="true"></vsm-setter>
          <v-spacer></v-spacer>
          <v-btn icon class="ml-5 mr-5" @click="deleteF">
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

  components:{
    "vsm-setter" : setter,
    "vsm-contextmenu" : contextmenu
  },

  methods:{
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