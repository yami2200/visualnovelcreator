<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="40%"
      max-height="900px"
  >
    <vsm-confirmation-request-modal @accept="deleteFunction" :bus="bus1" :headline="headlineCRM" :text="textCRM"></vsm-confirmation-request-modal>
    <vsm-editcustomfunction :bus="bus1" :assets="assets" @save="saveCustomFunction"></vsm-editcustomfunction>
    <v-card
        max-height="80vh">
      <v-card-title>
        <span class="headline" v-text="'Custom functions :'"></span>
      </v-card-title>
      <v-card-text>
        <v-card>

          <vsm-listobject
              height="39vh"
              :items="currentFunctions"
              :bus="bus1"
              searchAttribrute="name"
              @newObject="newFunction"
              @editObject="edit"
              @deleteObject="deleteFunctionRequest"
              @changeItem="changeItem">

            <template v-slot:default="slotProps">
              <vsm-listobjectfunction :functionC="slotProps.itemList"></vsm-listobjectfunction>
            </template>

          </vsm-listobject>

        </v-card>
      </v-card-text>
      <v-card-actions>
        <vsm-help-button link="https://github.com/yami2200/visualnovelcreator/blob/master/DOC/doc_CustomFunctions.md"></vsm-help-button>
        <v-spacer></v-spacer>
        <v-btn
            color="blue darken-1"
            text
            @click="close"
        >
          Close & Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ConfirmationRequest from "./modalrequest/VSM-ConfirmationRequestModal";
import EditCustomFunction from "./VSM-EditCustomFunctionPanel";

import Vue from "vue";
import helpButton from "@/components/VSM-HelpButton";
import ListObjectComp from "@/components/VSM-ListObjectComponent";
import ListObjectCustomFunctionComp from "@/components/listObject/VSM-ListObjectCustomFunctionComp";

export default {
  name: "VSM-EngineCodeEditPanel",

  components: {
    'vsm-confirmation-request-modal' : ConfirmationRequest,
    "vsm-editcustomfunction" : EditCustomFunction,
    "vsm-help-button" : helpButton,
    "vsm-listobject" : ListObjectComp,
    "vsm-listobjectfunction" : ListObjectCustomFunctionComp,
  },

  data () {
    return {
      dialog: false,
      headlineCRM: "Delete Custom Function",
      textCRM: "Are you sure you want to delete this function : ",
      bus1: new Vue(),
      currentFunctions : [],
      deleteIndex: 0,
      editIndex:0,
    };
  },

  props:["assets", "bus"],

  mounted() {
    this.bus.$on('showCustomFunctionEditPanel', this.show);
    this.bus.$on('hideCustomFunctionEditPanel', this.hide);
  },

  methods:{
    newFunction(){
      this.bus1.$emit('showEditCustomFunction', {edit : false});
    },
    edit(index){
      this.editIndex = index;
      this.bus1.$emit('showEditCustomFunction', {edit : true, f: this.currentFunctions[index]});
    },
    deleteFunctionRequest(index){
      this.textCRM = "Are you sure you want to delete this custom function : " + this.currentFunctions[index].name;
      this.deleteIndex = index;
      this.bus1.$emit('showConfirmationRequestModal');
    },
    deleteFunction(){
      if(this.deleteIndex === -1 || this.deleteIndex === null) return;

      this.assets[6].content.forEach((p) => {
        p.listDialogues.forEach((d) => {
          if(d.action !== undefined){
            d.action = this.deleteFunctionCall(d.action);
          }
        });
      });

      this.currentFunctions.splice(this.deleteIndex,1);
      this.bus1.$emit("setSelectItem", null);
      this.$forceUpdate();
    },

    deleteFunctionCall(listAction){
      listAction = listAction.filter((s) => s.code === undefined || (s.name !== this.currentFunctions[this.deleteIndex].name));
      listAction.forEach((f) => {
        if(f.action !== undefined) f.action = this.deleteFunctionCall(f.action);
        if(f.actionif !== undefined) f.actionif = this.deleteFunctionCall(f.actionif);
        if(f.actionelse !== undefined) f.actionelse = this.deleteFunctionCall(f.actionelse);
      });
      return listAction;
    },

    hide(){
      this.dialog = false;
    },
    close(){
      this.$emit("save");
      this.hide();
    },
    show(){
      this.currentFunctions = this.assets[9].content;
      this.dialog = true;
    },
    saveCustomFunction(data){
      if(data.edit){
        // If the user change the name of the custom function
        if(this.currentFunctions[this.editIndex].name !== data.f.name){
          //let ref = this;
          this.assets[6].content.forEach((p) => {
            p.listDialogues.forEach((d) => {
              if(d.action !== undefined){
                d.action = this.renameCustomFunction(d.action, data.f.name);
              }
            });
          });
        }
        // If the user change the type/name of an input
        if(JSON.stringify(this.currentFunctions[this.editIndex].inputs) !== JSON.stringify(data.f.inputs)){
          this.assets[6].content.forEach((p) => {
            p.listDialogues.forEach((d) => {
              if(d.action !== undefined){
                d.action = this.changeInputFunction(d.action, data);
              }

            });
          });
        }
        this.currentFunctions[this.editIndex] = data.f;
      } else {
        this.currentFunctions.push(data.f);
      }
      this.bus1.$emit("updateList");
    },

    renameCustomFunction(listAction, newname){
      listAction.forEach((s) => {
        if(s.code !== undefined){
          if(s.name === this.currentFunctions[this.editIndex].name) s.name = newname;
        }
        if(s.action !== undefined) s.action = this.renameCustomFunction(s.action, newname);
        if(s.actionif !== undefined) s.actionif = this.renameCustomFunction(s.actionif, newname);
        if(s.actionelse !== undefined) s.actionelse = this.renameCustomFunction(s.actionelse, newname);
      });
      return listAction;
    },

    changeInputFunction(listAction, data){
      listAction.forEach((s) => {
        if(s.code !== undefined){
          if(s.name === data.f.name) {
            let oldInputs = s.inputs;
            s.inputs = [];
            for(var i = 0;i<data.f.inputs.length;i++){
              if(oldInputs[i] !== undefined && oldInputs[i].type.name === data.f.inputs[i].type.name){
                let input = data.f.inputs[i];
                input.value = oldInputs[i].value;
                s.inputs.push(input);
              } else {
                s.inputs.push(data.f.inputs[i]);
              }
            }
          }
        }
        if(s.action !== undefined) s.action = this.changeInputFunction(s.action, data);
        if(s.actionif !== undefined) s.actionif = this.changeInputFunction(s.actionif, data);
        if(s.actionelse !== undefined) s.actionelse = this.changeInputFunction(s.actionelse, data);
      });
      return listAction;
    },
    changeItem(index){
      this.editIndex = index;
    },
  },
}
</script>

<style scoped>

</style>