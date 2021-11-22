<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="500px"
  >
    <v-card>
      <v-card-title>
        <span class="headline" v-text="'Package Project :'"></span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">

              <v-select
                  class="mt-5"
                  :items="listPackageType"
                  v-model="project.type"
                  label="Package Platform"
                  solo
              ></v-select>

              <v-text-field
                  label="Directory"
                  :rules="[rules.required]"
                  v-model="project.directory"
                  :value="project.directory"
                  @click="changeDirectory"
              ></v-text-field>

            </v-col>
          </v-row>
        </v-container>
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
        <v-btn
            :disabled=cantSave
            color="blue darken-1"
            text
            @click="save"
        >
          New Project
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {remote} from "electron";
import {existFile} from "@/lib";
import pathM from "path";
const dialog = remote.dialog;

export default {
  name: "VSM-NewProjectModal",

  props: ['bus'],

  data () {
    return {
      dialog: false,
      project: {directory: "", type: "Windows"},
      listPackageType : ["Windows", "Web"],
      rules: {
        required: value => !!value || 'Required.',
      },
    };
  },

  computed: {
    cantSave : function(){
      return (!this.listPackageType.includes(this.project.type) || this.project.directory === "");
    }
  },

  methods:{
    cancel() {
      this.hide();
      this.$emit("cancel");
    },
    save(){
      this.$emit("save", this.project);
      this.hide();
    },
    hide(){
      this.dialog = false;
    },
    show(){
      this.project = {directory: "", type: "Windows"}
      this.dialog = true;
    },
    changeDirectory(){
      var path = dialog.showOpenDialogSync({
        properties: ['openDirectory']
      });
      if(path === null || path === undefined || !existFile(pathM.normalize(path+"\\"))) return;
      if(path.length>0) this.project.directory = path[0];
    },
  },

  mounted() {
    this.bus.$on('hidePackageProjectModal', this.hide);
    this.bus.$on('showPackageProjectModal', this.show);

  },

}
</script>

<style scoped>

</style>