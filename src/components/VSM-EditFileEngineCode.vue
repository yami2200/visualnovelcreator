<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
  >
    <v-card>
      <v-card-title class="headline">
        {{ textvalid }} File
      </v-card-title>
      <v-card-text>
        <v-text-field
            v-if="file!=null"
            label="Name"
            :rules="[rules.required]"
            v-model="file.name"
            :value="file.name"
        ></v-text-field>
        <v-select
            :items="listLanguagesName"
            v-model="select"
            label="Select Type"
            solo
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="green darken-1"
            text
            @click="cancel"
        >
          Cancel
        </v-btn>
        <v-btn
            color="green darken-1"
            text
            @click="accept"
            :disabled="disableAcceptButton"
        >
          {{ textvalid }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import baseFile from "@/assets/base_file.json";
import listLanguages from "@/assets/listLanguageEngineFile.json";

export default {
  name: "VSM-EditFileEngineCode",

  props:["bus", "currentFiles"],

  data () {
    return {
      dialog: false,
      textvalid : "Add",
      index : -1,
      editMode : false,
      select: null,
      file : null,
      rules: {
        required: value => !!value || 'Required.',
      },
    }
  },

  computed:{
    disableAcceptButton(){
      return this.file === null || this.file.name === "" || this.select === "" || this.select === null || this.isDuplicateName;
    },
    listLanguagesName(){
      return listLanguages.map((l) => l.language);
    },
    isDuplicateName(){
      let fInfo = this.currentFiles.filter((f) => f.title === this.getTitle);
      return fInfo.length >0;
    },
    getLanguage(){
      let languageInfo = listLanguages.filter((l) => l.language === this.select);
      if(languageInfo.length === 0) return "";
      return languageInfo[0];
    },
    getTitle(){
      let l = this.getLanguage;
      if(l === "") return "";
      return this.file.name + "." + this.getLanguage.extension;
    },
  },

  methods:{
    accept(){
      if(this.disableAcceptButton) return;
      this.file.language = this.select;
      this.file.title = this.getTitle;
      if(this.file.title === "") return;
      this.file.icon = this.getLanguage.icon;
      if(this.editMode){
        this.currentFiles[this.index] = this.file;
      } else {
        this.currentFiles.push(this.file);
      }
      this.hide();
      this.$emit("refresh");
    },
    cancel(){
      this.hide();
    },
    show(edit, index){
      if(index === -1) return;
      this.index = index;
      this.editMode = edit;
      if(edit){
        this.textvalid = "Edit";
        this.file = JSON.parse(JSON.stringify(this.currentFiles[index]));
      } else {
        this.textvalid = "Add";
        this.file = JSON.parse(JSON.stringify(baseFile));
      }
      this.select = this.file.language;
      this.dialog = true;
    },
    hide(){
      this.dialog = false;
    }
  },

  mounted() {
    this.bus.$on('showEngineCodeEditFile', this.show);
    this.bus.$on('hideEngineCodeEditFile', this.hide);
  }
}
</script>

<style scoped>

</style>