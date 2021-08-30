<template>
  <v-card flat height="500">
    <vsm-scriptselector :bus="bus" @choseFunction="addFunctionTop"> </vsm-scriptselector>
    <vsm-contextmenu
        :bus="bus"
        :item-context-menu="itemsContextMenu"
        @insertnew="insertNewFunctionTopRequest"
        @movetop="moveFunctionTop"
    >
    </vsm-contextmenu>
    <v-row justify="space-between">
      <v-checkbox
          class="ml-2"
          v-model="current.waitEndScript"
          label="Wait the end of all script before leaving the dialogue:"
      ></v-checkbox>
      <vsm-help-button class="mt-3 mr-3" link="https://github.com/yami2200/visualnovelcreator/blob/master/DOC/doc_Scripting.md"></vsm-help-button>
    </v-row>
      <v-card
          class="mx-auto"
          width="100%"
          height="450"
          tile
      >
        <v-list class="mt-2 overflow-y-auto" max-height="450" dense>
          <vsm-scriptlist @rightClickComp="rightClickOnFunction" :assets="assets" :action="current.action" :indentation="0"> </vsm-scriptlist>
        </v-list>

      </v-card>
  </v-card>
</template>

<script>
import listScript from "@/components/dialogues/VSM-ListScript";
import contextmenu from "@/components/VSM-ContextMenu";
import Vue from "vue";
import helpButton from "@/components/VSM-HelpButton";

export default {
  name: "VSM-DialogueTabBasic",

  components:{
    "vsm-scriptlist" : listScript,
    "vsm-contextmenu" : contextmenu,
    "vsm-scriptselector" : () => import("@/components/dialogues/VSM-FunctionScriptSelector"),
    "vsm-help-button" : helpButton,
  },

  data: () => ({
    bus: new Vue(),
    itemsContextMenu: [{title : "Insert New on Top", action : "insertnew"}, {title : "Move on Top", action : "movetop"}],
    CMinfo : null,
  }),

  props:["current", "assets"],

  methods:{
    rightClickOnFunction(data){
      this.CMinfo = data;
      this.bus.$emit("showContextMenu", data.e);
    },
    insertNewFunctionTopRequest(){
      if(this.CMinfo===null)return;
      this.bus.$emit("showFunctionScriptSelector", {index : this.CMinfo.index, indentation : this.CMinfo.indentation});
    },
    addFunctionTop(data){
      if(this.CMinfo===null)return;
      this.CMinfo.actions.splice(data.index, 0, data.function);
    },
    moveFunctionTop(){
      if(this.CMinfo===null)return;
      if(this.CMinfo.index<=0) return;
      var f = this.CMinfo.actions[this.CMinfo.index];
      this.CMinfo.actions.splice(this.CMinfo.index, 1);
      this.CMinfo.actions.splice(this.CMinfo.index-1, 0, f);
    },
  }
}
</script>

<style scoped>

</style>