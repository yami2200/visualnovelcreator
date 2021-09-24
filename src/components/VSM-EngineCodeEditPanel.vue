<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="90%"
      max-height="900px"
  >
    <vsm-confirmation-request-modal @accept="acceptModal" :bus="bus1" :headline="headlineCRM" :text="textCRM"></vsm-confirmation-request-modal>
    <vsm-editfile @refresh="refreshTabs" :bus="bus" :current-files="currentFiles"></vsm-editfile>
    <v-card
        max-height="80vh"
        height="80vh">
      <v-card-title>
        <span class="headline" v-text="'Engine Code :'"></span>
      </v-card-title>
      <v-card-text height="100%">
        <v-card height="100%" width="100%">
          <v-container v-if="assets[7] !== undefined" class="ml-0 mr-0">

            <v-tabs v-model="tab" vertical height="63vh" @change="changeTab">
              <v-tab v-for="(file,index) in  currentFiles" :key="index+file.title">
                <v-icon>{{ file.icon }}</v-icon>
                {{ file.title }}
                <v-btn v-if="currentFiles[tab].uneditable !== undefined && currentFiles[tab].uneditable" icon @click="resetFileRequest(index)">
                  <v-icon color="red lighten-1">mdi-file-refresh</v-icon>
                </v-btn>
              </v-tab>
              <v-tabs-items v-model="tab">
                <v-tab-item
                    v-for="(tab,indexT) in currentFiles"
                    :key="indexT"
                >

                  <MonacoEditor style="width: 100%; height: 60vh" v-model="tab.value" :language="tab.language" theme="vs-dark"/>

                </v-tab-item>
              </v-tabs-items>

              <v-app-bar
                  dense
                  fixed
                  bottom
              >
                <v-spacer></v-spacer>

                <v-btn icon @click="deleteFileRequest" :disabled=disableEditButtons>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>

                <v-btn icon @click="editFileRequest" :disabled=disableEditButtons>
                  <v-icon>mdi-pencil-outline</v-icon>
                </v-btn>

                <v-btn icon @click="newFileRequest">
                  <v-icon>mdi-plus-circle</v-icon>
                </v-btn>

                <v-spacer></v-spacer>
              </v-app-bar>
            </v-tabs>

          </v-container>
        </v-card>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="blue darken-1"
            text
            @click="hide"
        >
          Cancel
        </v-btn>
        <v-btn
            color="blue darken-1"
            text
            @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {writeFile} from "../lib";
import MonacoEditor from 'vue-monaco';
import ConfirmationRequest from "./modalrequest/VSM-ConfirmationRequestModal";
import EditFileEngine from "./VSM-EditFileEngineCode";
import baseAsset from "@/assets/base_assets.json";
import Vue from "vue";
import {mix_modal} from "@/mixins/MIX_Modal";

export default {
  name: "VSM-EngineCodeEditPanel",

  components: {
    MonacoEditor,
    'vsm-confirmation-request-modal' : ConfirmationRequest,
    'vsm-editfile' : EditFileEngine,
  },

  computed:{
    disableEditButtons(){
      return this.tab === null || this.tab === -1 || (this.currentFiles[this.tab].uneditable !== undefined && this.currentFiles[this.tab].uneditable);
    },
  },



  data () {
    return {
      nameText : "EngineCodeEditPanel",
      headlineCRM: "Delete File",
      textCRM: "Are you sure you want to delete this file : ",
      tab: null,
      bus1: new Vue(),
      options: {
        value: "",
        language: "javascript",
      },
      currentFiles : [],
      confirmationModalType : "",
      fileToReset : null,
    };
  },

  props:["assets", "properties"],

  mixins:[mix_modal],

  methods:{
    acceptModal(){
      if(this.confirmationModalType === "reset"){
        this.resetFile();
      } else if(this.confirmationModalType === "delete"){
        this.deleteFile();
      }
    },
    resetFileRequest(index){
      this.confirmationModalType = "reset";
      this.headlineCRM = "Reset File";
      this.textCRM = "Are you sure you want to reset this file : " + this.currentFiles[index].title;
      this.fileToReset = index;
      this.bus1.$emit('showConfirmationRequestModal');
    },
    resetFile(){
      this.currentFiles[this.fileToReset].value = baseAsset[7].content[this.fileToReset].value;
    },
    newFileRequest(){
      this.bus.$emit("showEngineCodeEditFile", false, this.tab);
    },
    editFileRequest(){
      this.bus.$emit("showEngineCodeEditFile", true, this.tab);
    },
    deleteFileRequest(){
      this.confirmationModalType = "delete";
      this.headlineCRM = "Delete File";
      this.textCRM = "Are you sure you want to delete this file : " + this.currentFiles[this.tab].title;
      this.bus1.$emit('showConfirmationRequestModal');
    },
    deleteFile(){
      this.currentFiles.splice(this.tab, 1);
      this.tab--;
    },
    changeTab(value){
        if(this.tab !== null && this.tab !== -1){
          this.options.value = this.currentFiles[value].value;
        }
    },
    save(){
      this.assets[7].content = this.currentFiles;
      this.currentFiles.forEach((f) => {
        writeFile(this.properties.directory+f.title, f.value);
      });
      this.hide();
    },
    show(){
      this.currentFiles = JSON.parse(JSON.stringify(this.assets[7].content));
      this.options = [];
      this.currentFiles.forEach((f) => {
        this.options.push({language : f.language, value : f.value});
      });
      this.tab = 0;
      this.$forceUpdate();
      this.dialog = true;
    },
    hide(){
      this.dialog = false;
    },
    onChange(value){
      if(this.tab !== null && this.tab !== -1){
        this.currentFiles[this.tab].value = value;
      }
    },
    refreshTabs(){
      this.$forceUpdate();
    },
  },
}
</script>

<style scoped>

</style>