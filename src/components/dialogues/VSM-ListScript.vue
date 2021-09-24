<template>
  <div>
    <vsm-scriptselector :bus="bus" :listCustom="assets[9].content" @choseFunction="addFunction"> </vsm-scriptselector>
      <div v-for="(f, index) in action" :key="index">
        <vsm-scriptcompbasic v-if="f.component === 'Basic'" @deleteFunction="deleteFunction" @hoverInsertComp="hoverCompInsert" @selectComp="toggleSelectionComp" @rightClickComp="rightClickFunctionComponent" :index="index" @delete="deleteFunction" :indentation="f.indentation" :functionAction="f" :key="f.name" :lightcolormode="index%2===0" :assets="assets"></vsm-scriptcompbasic>
        <vsm-scriptcompif v-if="f.component === 'ControlIf'" @deleteFunction="deleteFunction" @hoverInsertComp="hoverCompInsert" @selectComp="toggleSelectionComp" @rightClickComp="rightClickFunctionComponent" :index="index" @delete="deleteFunction" :indentation="f.indentation" :functionAction="f" :key="f.name" :lightcolormode="index%2===0" :assets="assets"> </vsm-scriptcompif>
        <vsm-scriptcompifelse v-if="f.component === 'ControlIfElse'" @deleteFunction="deleteFunction" @hoverInsertComp="hoverCompInsert" @selectComp="toggleSelectionComp" @rightClickComp="rightClickFunctionComponent" :index="index" @delete="deleteFunction" :indentation="f.indentation" :functionAction="f" :key="f.name" :lightcolormode="index%2===0" :assets="assets"> </vsm-scriptcompifelse>
        <vsm-scriptcompset v-if="f.component === 'CompSet'" @deleteFunction="deleteFunction" @hoverInsertComp="hoverCompInsert" @selectComp="toggleSelectionComp" @rightClickComp="rightClickFunctionComponent" :index="index" @delete="deleteFunction" :indentation="f.indentation" :functionAction="f" :key="f.name" :lightcolormode="index%2===0" :assets="assets"> </vsm-scriptcompset>
      </div>
      <vsm-scriptcompadd @click="addScriptFunctionRequest" @contextmenu="rightClickAdd" :indentation="indentation" :index="action.length" :functionAction="scriptCompAdd" :lightcolormode="action.length%2===0"></vsm-scriptcompadd>
  </div>
</template>

<script>
import scriptCompAddfunction from "@/assets/base_addscriptcomp.json";
import scriptCompAdd from "@/components/dialogues/VSM-ScriptCompAddFunction";
import scriptCompBasic from "@/components/dialogues/VSM-ScriptCompBasic";
import scriptCompIf from "@/components/dialogues/VSM-ScriptCompIf";
import scriptCompIfElse from "@/components/dialogues/VSM-ScriptCompIfElse";
import scriptCompSet from "@/components/dialogues/VSM-ScriptCompSetVariable"
import Vue from "vue";

export default {
  name: "VSM-ListScript",

  props:["assets", "action", "indentation"],

  components:{
    "vsm-scriptcompadd" : scriptCompAdd,
    "vsm-scriptcompbasic" : scriptCompBasic,
    "vsm-scriptcompif" : scriptCompIf,
    "vsm-scriptcompifelse" : scriptCompIfElse,
    "vsm-scriptcompset" : scriptCompSet,
    "vsm-scriptselector" : () => import("@/components/dialogues/VSM-FunctionScriptSelector"),
  },

  data: () => ({
    bus: new Vue(),
    scriptCompAdd : JSON.parse(JSON.stringify(scriptCompAddfunction)),
    listSelection : [],
  }),

  methods:{
    update(){
      this.$forceUpdate();
    },
    hoverCompInsert(comp){
      if(comp !== null && comp !== undefined && comp.fromActions === undefined){
        comp.fromActions = this.action;
      }
      this.$emit("hoverInsertComp", comp);
    },
    toggleSelectionComp(comp){
      if(comp.fromActions === undefined){
        comp.fromActions = this.action;
      }
      this.$emit("toggleSelectionComp", comp);
    },
    deleteFunction(f){
      if(f.fromActions === undefined){
        f.fromActions = this.action;
      }
      this.$emit("deleteFunction", f);
    },
    rightClickAdd(e){
      let d = {e: e, index: this.action.length, indentation: this.indentation, actions : this.action};
      this.$emit("rightClickComp",d);
    },
    addScriptFunctionRequest(index, indentation){
      this.bus.$emit("showFunctionScriptSelector", {index : index, indentation : indentation});
    },
    addFunction(data){
      this.action.splice(data.index, 0, data.function);
    },
    rightClickFunctionComponent(data){
      let d = {e: data.e, index: data.index, setSelect: data.setSelect, indentation: data.indentation, actions : (data.actions===undefined || data.actions===null ? this.action : data.actions)};
      this.$emit("rightClickComp",d);
    }
  },
}
</script>

<style scoped>

</style>