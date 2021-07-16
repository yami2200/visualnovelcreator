<template>
  <v-dialog
      v-model="dialog"
      persistent
      width="40%"
  >
    <v-card min-height="20vh">
      <v-card-title class="headline">
        Visual Novel Creator :
      </v-card-title>
      <v-card-text>
      <v-row style="min-height: 20vh">
        <v-col cols="12" md="6" xl="6" sm="6">
          <h3 class="mb-6"> New/Open Project :</h3>
          <v-spacer></v-spacer>
          <v-btn width="100%" class="mb-5" @click="$emit('newProject')"> New Project </v-btn>
          <v-btn width="100%" @click="$emit('openProject')"> Open Project </v-btn>
          <v-spacer></v-spacer>
        </v-col>
        <v-col cols="12" md="6" xl="6" sm="6">
          <h3 class="mb-3"> Recent Project :</h3>
          <div class="mb-1" style="width: 100%" v-for="(project, index) in listRecentProject" :key="index" >
            <a @click="recentProject(project)"> - {{ project.name }} </a>
          </div>
          <v-row v-if="listRecentProject.length === 0" align="center" style="height: 75%">
            <h4 class="ml-10"> No Recent Project ...</h4>
          </v-row>
        </v-col>
      </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import {readFileSync} from "../../lib";

export default {
  name: "VSM-ProjectOpeningModal",

  props: {
    bus : {required: true},
    preferences : {required: true},
  },

  data () {
    return {
      dialog: false,
      listRecentProject: [],
    }
  },

  methods: {
    show() {
      this.listRecentProject = [];
      for(var i = 0; i<Math.min(this.preferences.recentProjects.length, 5); i++){
        let p = readFileSync(this.preferences.recentProjects[i]);
        if(p!==null){
          try{
            let project = JSON.parse(p);
            this.listRecentProject.push({name : project.name, project : project});
          } catch{
            console.log("Error loading project at : "+this.preferences.recentProjects[i]);
          }
        }
      }
      this.dialog = true;
    },
    hide() {
      this.dialog = false;
    },
    recentProject(project){
      this.$emit("openRecent", project.project, [project.project.directory+"azeqsd"]);
    },
  },

  mounted() {
    this.bus.$on('showOpeningAppProject', this.show);
    this.bus.$on('hideOpeningAppProject', this.hide)
  },
}
</script>

<style scoped>

</style>