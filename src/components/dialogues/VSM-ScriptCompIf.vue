<template>
  <div>
    <v-list-item two-line>
      <v-card ref="card" @mouseleave="mouseLeave" @mousemove="mouseHover('start', $event)" :width="getWidthFunctionContainer" :min-width="getWidthFunctionContainer" :style="cssVars" :color="getColor" height="55px" @contextmenu="contextMenuDM" @click="select">
        <v-row align="center" align-content="center" class="mt-2">
          <h2 class="ml-6 mr-5"> {{ functionAction.name }} {{ functionAction.inputs.length>0  ? ':' : ''}} </h2>
          <vsm-setter v-for="(setInput, index) in functionAction.inputs" :key="index" :initialval="false" :variable="setInput" :assets="assets" :listvar="assets[5].content"></vsm-setter>
          <v-spacer></v-spacer>
          <v-btn icon class="ml-5 mr-5" @click.stop="deleteF">
            <v-icon color="black">mdi-delete</v-icon>
          </v-btn>
        </v-row>
      </v-card>
    </v-list-item>

    <vsm-scriptlist @deleteFunction="deleteFunction" @hoverInsertComp="hoverInsertComp" @toggleSelectionComp="toggleChildSelection" @rightClickComp="rightClickComp" :assets="assets" :action="functionAction.action" :indentation="indentation+3"> </vsm-scriptlist>

    <v-list-item>
      <v-card ref="cardEnd" @mouseleave="mouseLeave" @mousemove="mouseHover('end', $event)" :width="getWidthFunctionContainer" :min-width="getWidthFunctionContainer" :style="cssVars" :color="getColor" height="30px" @contextmenu="contextMenuDM" @click="select">
        <h2 class="ml-2 mr-5 mt-1"> End if </h2>
      </v-card>
    </v-list-item>
  </div>
</template>

<script>
import {mix_scriptcomponent, mix_scriptcomponentcontainer} from "@/mixins/MIX_ScriptComponent";
import setter from "@/components/variables/VSM-SetterVariable";

export default {
  name: "VSM-ScriptCompBasic",

  mixins: [mix_scriptcomponent, mix_scriptcomponentcontainer],

  components:{
    "vsm-setter" : setter,
    "vsm-scriptlist" : () => import("@/components/dialogues/VSM-ListScript"),
  },

  methods:{
    select(e){
      this.selected = !this.selected;
      this.$emit("selectComp", {index: this.index, actions: this.functionAction.action, setSelect: this.setSelected, ctrl : e.ctrlKey});
    },


    mouseHover(part, e){
      switch (part){
        case "end":
          if(e.offsetY<15) {
            if(this.mouseDirection !== "end_top"){
              this.switchMouseHoverPart("end_top", "borderTop", "cardEnd");
            }
          } else if(e.offsetY>15) {
            if(this.mouseDirection !== "end_bottom"){
              this.switchMouseHoverPart("end_bottom", "borderBottom", "cardEnd");
            }
          } else {
            if(this.mouseDirection!=="null"){
              this.mouseLeave();
            }
          }
          break;
        case "start":
          if(e.offsetY<15) {
            if(this.mouseDirection !== "start_top"){
              this.switchMouseHoverPart("start_top", "borderTop", "card");
            }
          } else if(e.offsetY>30) {
            if(this.mouseDirection !== "start_bottom"){
              this.switchMouseHoverPart("start_bottom", "borderBottom", "card");
            }
          } else {
            if(this.mouseDirection!=="null"){
              this.mouseLeave();
            }
          }
          break;
      }
    },
    mouseLeaverRemoveHoverEffect(){
      if(this.$refs["card"] !== undefined){
        this.$refs["card"].$el.classList.remove("borderTop");
        this.$refs["card"].$el.classList.remove("borderBottom");
      }
      if(this.$refs["cardEnd"] !== undefined){
        this.$refs["cardEnd"].$el.classList.remove("borderTop");
        this.$refs["cardEnd"].$el.classList.remove("borderBottom");
      }
    },

    getInfoInsertHovering(direction){
      switch(direction){
        case "start_top":
          return {index: Math.max(this.index, 0), stopHover: this.mouseLeave, indentation: this.indentation};
        case "start_bottom":
          return {index: 0, stopHover: this.mouseLeave, indentation: this.indentation+3, fromActions: this.functionAction.action};
        case "end_bottom":
          return {index: this.index+1, stopHover: this.mouseLeave, indentation: this.indentation};
        case "end_top":
          return {index: this.functionAction.action.length, stopHover: this.mouseLeave, indentation: this.indentation+3, fromActions: this.functionAction.action};
      }
      return null;
    },
  },

}
</script>

<style scoped>

.borderTop{
  background: linear-gradient(var(--bg-color-insert), rgba(0, 0, 0, 0));
  cursor:alias;
}

.borderBottom{
  background: linear-gradient(rgba(0, 0, 0, 0), var(--bg-color-insert));
  cursor:alias;
}

</style>