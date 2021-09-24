<template>
  <div>
    <v-list-item two-line>
      <v-card ref="cardIf" @mouseleave="mouseLeave" @mousemove="mouseHover('if', $event)" :width="getWidthFunctionContainer" :min-width="getWidthFunctionContainer" :style="cssVars" :color="getColor" height="55px" @click="select" @contextmenu="contextMenuDM">
        <v-row align="center" align-content="center" class="mt-2">
          <h2 class="ml-6 mr-5"> If {{ functionAction.inputs.length>0  ? ':' : ''}} </h2>
          <vsm-setter v-for="(setInput, index) in functionAction.inputs" :key="index" :initialval="false" :variable="setInput" :assets="assets" :listvar="assets[5].content"></vsm-setter>
          <v-spacer></v-spacer>
          <v-btn icon class="ml-5 mr-5" @click.stop="deleteF">
            <v-icon color="black">mdi-delete</v-icon>
          </v-btn>
        </v-row>
      </v-card>
    </v-list-item>

    <vsm-scriptlist @toggleSelectionComp="toggleChildSelection" @hoverInsertComp="hoverInsertComp" @deleteFunction="deleteFunction" @rightClickComp="rightClickComp" :assets="assets" :action="functionAction.actionif" :indentation="indentation+3"> </vsm-scriptlist>

    <v-list-item>
      <v-card ref="cardElse" @mouseleave="mouseLeave" @mousemove="mouseHover('else', $event)" :width="getWidthFunctionContainer" :min-width="getWidthFunctionContainer" :style="cssVars" @click="select" @contextmenu="contextMenuDM" :color="getColor" height="30px">
        <h2 class="ml-2 mr-5 mt-1"> Else </h2>
      </v-card>
    </v-list-item>

    <vsm-scriptlist @toggleSelectionComp="toggleChildSelection" @hoverInsertComp="hoverInsertComp" @deleteFunction="deleteFunction" @rightClickComp="rightClickComp" :assets="assets" :action="functionAction.actionelse" :indentation="indentation+3"> </vsm-scriptlist>

    <v-list-item>
      <v-card ref="cardEnd" @mouseleave="mouseLeave" @mousemove="mouseHover('end', $event)" :width="getWidthFunctionContainer" :min-width="getWidthFunctionContainer" :style="cssVars" :color="getColor" @click="select" @contextmenu="contextMenuDM" height="30px">
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
      this.$emit("selectComp", {index: this.index, actions: this.functionAction.actionif.concat(this.functionAction.actionelse), setSelect: this.setSelected, ctrl : e.ctrlKey});
    },

    mouseHover(part, e){
      switch (part){
        case "if":
          if(e.offsetY<15) {
            if(this.mouseDirection !== "if_top") this.switchMouseHoverPart("if_top", "borderTop", "cardIf");
            return;
          } else if(e.offsetY>30) {
            if(this.mouseDirection !== "if_bottom")this.switchMouseHoverPart("if_bottom", "borderBottom", "cardIf");
            return;
          }
          break;
        case "else":
          if(e.offsetY<15) {
            if(this.mouseDirection !== "else_top") this.switchMouseHoverPart("else_top", "borderTop", "cardElse");
            return;
          } else if(e.offsetY>15) {
            if(this.mouseDirection !== "else_bottom")this.switchMouseHoverPart("else_bottom", "borderBottom", "cardElse");
            return;
          }
          break;
        case "end":
          if(e.offsetY<15) {
            if(this.mouseDirection !== "end_top") this.switchMouseHoverPart("end_top", "borderTop", "cardEnd");
            return;
          } else if(e.offsetY>15) {
            if(this.mouseDirection !== "end_bottom")this.switchMouseHoverPart("end_bottom", "borderBottom", "cardEnd");
            return;
          }
      }
      if(this.mouseDirection!=="null") this.mouseLeave();
    },
    mouseLeaverRemoveHoverEffect(){
      if(this.$refs["cardIf"] !== undefined){
        this.$refs["cardIf"].$el.classList.remove("borderTop");
        this.$refs["cardIf"].$el.classList.remove("borderBottom");
      }
      if(this.$refs["cardElse"] !== undefined){
        this.$refs["cardElse"].$el.classList.remove("borderTop");
        this.$refs["cardElse"].$el.classList.remove("borderBottom");
      }
      if(this.$refs["cardEnd"] !== undefined){
        this.$refs["cardEnd"].$el.classList.remove("borderTop");
        this.$refs["cardEnd"].$el.classList.remove("borderBottom");
      }
    },
    getInfoInsertHovering(direction){
      switch(direction){
        case "if_top":
          return {index: Math.max(this.index, 0), stopHover: this.mouseLeave, indentation: this.indentation};
        case "if_bottom":
          return {index: 0, stopHover: this.mouseLeave, indentation: this.indentation+3, fromActions: this.functionAction.actionif};
        case "else_top":
          return {index: this.functionAction.actionif.length, stopHover: this.mouseLeave, indentation: this.indentation+3, fromActions: this.functionAction.actionif};
        case "else_bottom":
          return {index: 0, stopHover: this.mouseLeave, indentation: this.indentation+3, fromActions: this.functionAction.actionelse};
        case "end_top":
          return {index: this.functionAction.actionelse.length, stopHover: this.mouseLeave, indentation: this.indentation+3, fromActions: this.functionAction.actionelse};
        case "end_bottom":
          return {index: this.index+1, stopHover: this.mouseLeave, indentation: this.indentation};
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