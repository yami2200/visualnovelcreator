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
          <v-container>

            <v-list max-height="39vh" class="mt-1 overflow-y-auto">
              <v-list-item-group v-model="selectedItem">
                <v-list-item
                    v-for="(functionC, index) in currentFunctions"
                    :key="index"
                >

                  <v-list-item-content>
                    <v-list-item-title style="overflow: visible;" class="text-h6"> <strong :style="{color: functionC.color}" style="text-shadow: 1px 1px 2px black;"> {{ functionC.name }}</strong> </v-list-item-title>
                  </v-list-item-content>

                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-container>
          <v-app-bar
              dense
              bottom
              width="100%"
              height="50px"
          >
            <v-spacer></v-spacer>

            <v-btn icon @click="deleteFunctionRequest" :disabled="disableEditButton">
              <v-icon>mdi-delete</v-icon>
            </v-btn>

            <v-btn icon @click="edit" :disabled="disableEditButton">
              <v-icon>mdi-pencil-outline</v-icon>
            </v-btn>

            <v-btn icon @click="newFunction">
              <v-icon>mdi-plus-circle</v-icon>
            </v-btn>

            <v-spacer></v-spacer>
          </v-app-bar>
        </v-card>
      </v-card-text>
      <v-card-actions>
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

export default {
  name: "VSM-EngineCodeEditPanel",

  components: {
    'vsm-confirmation-request-modal' : ConfirmationRequest,
    "vsm-editcustomfunction" : EditCustomFunction
  },

  computed:{
    disableEditButton() {
      return this.selectedItem == null;
    },
  },

  data () {
    return {
      dialog: false,
      headlineCRM: "Delete Custom Function",
      textCRM: "Are you sure you want to delete this function : ",
      bus1: new Vue(),
      currentFunctions : [],
      selectedItem : null,
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
    edit(){
      this.bus1.$emit('showEditCustomFunction', {edit : true, f: this.currentFunctions[this.selectedItem]});
    },
    deleteFunctionRequest(){
      this.textCRM = "Are you sure you want to delete this custom function : " + this.currentFunctions[this.selectedItem].name;
      this.bus1.$emit('showConfirmationRequestModal');
    },
    deleteFunction(){
      if(this.selectedItem === -1 || this.selectedItem === null) return;
      this.currentFunctions.splice(this.selectedItem,1);
      this.selectedItem = null;
      this.$forceUpdate();
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
        if(this.currentFunctions[this.selectedItem].name !== data.f.name){
          let ref = this;
          this.assets[6].content.forEach((p) => {
            p.listDialogues.forEach((d) => {
              if(d.action !== undefined){
                d.action.forEach((s) => {
                  if(s.code !== undefined){
                    if(s.name === ref.currentFunctions[this.selectedItem].name) s.name = data.f.name;
                  }
                });
              }

            });
          });
        }
        // If the user change the type/name of an input
        if(JSON.stringify(this.currentFunctions[this.selectedItem].inputs) !== JSON.stringify(data.f.inputs)){
          this.assets[6].content.forEach((p) => {
            p.listDialogues.forEach((d) => {
              if(d.action !== undefined){
                d.action.forEach((s) => {
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
                });
              }

            });
          });
        }
        this.currentFunctions[this.selectedItem] = data.f;
      } else {
        this.currentFunctions.push(data.f);
      }
      this.$forceUpdate();
    },
  },
}
</script>

<style scoped>

</style>