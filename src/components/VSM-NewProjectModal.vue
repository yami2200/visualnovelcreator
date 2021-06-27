<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="500px"
  >
    <v-card>
      <v-card-title>
        <span class="headline" v-text="'New Project :'"></span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                  v-if="project!=null"
                  label="Name"
                  :rules="[rules.required, rules.counter]"
                  v-model="project.name"
                  :value="project.name"
              ></v-text-field>

              <v-text-field
                  v-if="project!=null"
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
import baseProject from './../assets/base_projectproperties.json'
import {remote} from "electron";
const dialog = remote.dialog;

export default {
  name: "VSM-NewProjectModal",

  props: ['bus'],

  data () {
    return {
      dialog: false,
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 20 || 'Max 20 characters',
      },
      project: null,
    };
  },

  computed: {
    cantSave : function(){
      return (this.project==null || this.project.name === "" || this.project.name.length>20 || this.project.directory === "");
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
      this.project = JSON.parse(JSON.stringify(baseProject));
      var d = new Date();
      this.project.date = String(d.getDate()).padStart(2, '0')+"/"+String(d.getMonth() + 1).padStart(2, '0')+"/"+d.getFullYear();
      this.dialog = true;
    },
    changeDirectory(){
      var path = dialog.showOpenDialogSync({
        properties: ['openDirectory']
      });
      if(path == null || path == undefined) return;
      if(path.length>0) this.project.directory = path[0];
    },
  },

  mounted() {
    this.bus.$on('hideNewProjectModal', this.hide);
    this.bus.$on('showNewProjectModal', this.show);

  },

}
</script>

<style scoped>

</style>