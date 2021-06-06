<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="850px"
  >
    <v-card height="750">
      <v-card-title>
        Chose a function :
      </v-card-title>
      <v-card-text style="height: 85%">
        <v-row justify="center">
          <v-col cols="12" sm="6" md="6" xl="6">
            <h2 class="mt-2 mb-2 mx-auto"> Action : </h2>
            <v-btn class="mt-1 mb-1" v-for="t in listVarAction" :key="t.name" width="100%" @click="selectFunction(t)"> {{ t.name }}</v-btn>
          </v-col>
          <v-col cols="12" sm="6" md="6" xl="6">
            <h2 class="mt-2 mb-2 mx-auto"> Variables : </h2>
            <v-btn class="mt-1 mb-1" v-for="t in listVarFunction" :key="t.name" width="100%" @click="selectFunction(t)"> {{ t.name }}</v-btn>
            <h2 class="mt-2 mb-2 mx-auto"> Controls : </h2>
            <v-btn class="mt-1 mb-1" v-for="t in listVarControl" :key="t.name" width="100%" @click="selectFunction(t)"> {{ t.name }}</v-btn>
            <h2 class="mt-2 mb-2 mx-auto"> Custom : </h2>
            <p> Available Soon </p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="blue darken-1"
            text
            @click="cancel"
        >
          Cancel
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import listVarFunction from "@/assets/listFunctionsVariables.json";
import listVarAction from "@/assets/listFunctionsAction.json";
import listVarControl from "@/assets/listFunctionsControl.json";

export default {
  name: "VSM-EditDialoguePanel",

  props:["bus"],

  computed:{
    canSave(){
      return true;
    }
  },

  data: () => ({
    dialog: false,
    index: -1,
    indentation : 0,
    listVarFunction : listVarFunction,
    listVarAction : listVarAction,
    listVarControl : listVarControl
  }),

  methods:{
    cancel(){
      this.hide();
    },
    show(data){
        this.index = data.index;
        this.indentation = data.indentation;
        this.dialog = true;
    },
    hide(){
      this.dialog = false;
    },
    selectFunction(d){
      var f = JSON.parse(JSON.stringify(d));
      f.indentation = this.indentation;
      this.$emit("choseFunction", {index: this.index, function : f});
      this.hide();
    }
  },

  mounted() {
    this.bus.$on("showFunctionScriptSelector", this.show);
  }
}
</script>

<style scoped>

</style>