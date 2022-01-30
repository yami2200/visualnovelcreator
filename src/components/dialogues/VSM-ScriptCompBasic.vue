<template>
  <div>
    <v-list-item two-line>
      <v-card ref="card" @mousemove="mouseHover" @mouseleave="mouseLeave" :width="getWidth" :min-width="getWidth" :style="cssVars" :color="getColor" height="55px" @contextmenu="contextMenuDM" @click="select">
        <v-row align="center" align-content="center" class="mt-2">
          <h2 class="ml-6 mr-5" style="user-select: none;" :class="{'mt-2' : functionAction.inputs.length === 0}"> {{ functionAction.name }} {{ functionAction.inputs.length>0  ? ':' : ''}} </h2>
          <vsm-setter v-for="(setInput, index) in functionAction.inputs" :key="index" :initialval="false" :variable="setInput" :assets="assets" :listvar="assets[5].content" class="ml-2" :onlyVariable="setInput.onlyvar !== undefined && setInput.onlyvar" :showName="true"></vsm-setter>
          <v-spacer></v-spacer>
          <h2 v-if="!functionAction.enable" :class="{'mt-2' : functionAction.inputs.length === 0}" style="color: darkred;"> Disabled </h2>
          <v-btn icon class="ml-5 mr-5" @click.stop="deleteF">
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

export default {
  name: "VSM-ScriptCompBasic",

  mixins: [mix_scriptcomponent],

  components:{
    "vsm-setter" : setter,
  },

  methods:{
    mouseHover(e){
      if(e.offsetY<15) {
        if(this.mouseDirection !== "top"){
          this.switchMouseHoverPart("top", "borderTop", "card");
        }
      } else if(e.offsetY>30) {
        if(this.mouseDirection !== "bottom"){
          this.switchMouseHoverPart("bottom", "borderBottom", "card");
        }
      } else {
        if(this.mouseDirection!=="null"){
          this.mouseLeave();
        }
      }
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