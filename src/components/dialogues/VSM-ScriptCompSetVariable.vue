<template>
  <div>
    <v-list-item two-line>
      <v-card ref="card" @mousemove="mouseHover" @mouseleave="mouseLeave" :width="getWidth" :min-width="getWidth" :style="cssVars" :color="getColor" height="55px" @contextmenu="contextMenuDM" @click="select">
        <v-row>
          <h2 class="ml-6 mr-1 mt-7" style="user-select: none;"> {{ functionAction.name }} {{ functionAction.inputs.length>0  ? ':' : ''}} </h2>

          <v-col cols="12" xl="4" sm="4">
            <v-select
                style="user-select: none;"
                class="mt-2"
                dense
                :items="listVariables"
                item-text="name"
                item-value="name"
                v-model="functionAction.inputs[0].value.value"
                label="Choose a variable"

                solo
                @click.stop
                @change="changeVar"
            ></v-select>
          </v-col>

          <vsm-setter v-if="functionAction.inputs[0].value.value !== ''" :initialval="false" :variable="functionAction.inputs[1]" :assets="assets" :listvar="assets[5].content" class="mt-5" :showName="true"></vsm-setter>
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
  },

  methods:{
    changeVar(){
      var list = this.assets[5].content.filter((v) => v.name === this.functionAction.inputs[0].value.value);
      if(list.length===0) return;
      var variableSelected = list[0];
      if(this.functionAction.inputs[1].type.name !== variableSelected.type.name){
        this.functionAction.inputs[1].type = variableSelected.type;
        this.functionAction.inputs[1].value = {
          type: "value",
          value: JSON.parse(JSON.stringify(variableSelected.type.defaultValue))
        };
      }
    },
    click(){
      this.$emit("click", this.index);
    },
    mouseHover(e){
      if(e.offsetY<25) {
        if(this.mouseDirection !== "top"){
          this.switchMouseHoverPart("top", "borderTop", "card");
        }
      } else if(e.offsetY>50) {
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