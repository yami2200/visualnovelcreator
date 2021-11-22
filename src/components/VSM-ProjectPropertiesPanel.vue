<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="60%"
      max-height="900px"
  >
    <v-card
        max-height="80vh"
        height="80vh">
      <v-card-title>
        <span class="headline" v-text="'Project properties :'"></span>
      </v-card-title>
      <v-card-text height="100%">
        <v-card height="66vh" flat class="pr-10">

          <v-tabs vertical height="65vh">
            <v-tab>
              <v-icon left>
                mdi-cog
              </v-icon>
              Game
            </v-tab>
            <v-tab>
              <v-icon left>
                mdi-volume-high
              </v-icon>
              Sounds
            </v-tab>

            <v-tab-item >
              <v-card height="64vh" width="100%">
                  <v-col cols="12" sm="12" md="8" xl="6" class="ml-5 mr-5">
                    <v-text-field
                        v-if="currentProperties!=null"
                        label="Display Name"
                        v-model="currentProperties.displayname"
                        :value="currentProperties.displayname"
                    ></v-text-field>
                    <v-text-field
                        v-if="currentProperties!=null"
                        label="Directory"
                        v-model="currentProperties.directory"
                        append-outer-icon="mdi-folder"
                        @click:append-outer="goDirectory"
                        readonly
                    ></v-text-field>
                    <v-textarea
                        v-if="currentProperties!=null"
                        class="mt-1"
                        name="Description"
                        label="Description"
                        v-model="currentProperties.description"
                    ></v-textarea>
                    <v-row align="center" justify="center" class="mt-5">
                      <span class="mr-5" style="font-size: 20px"> Default Icon : </span>
                      <v-file-input
                          class="mr-5"
                          @change="onChangeIcon"
                          @click="onClickFileInputIcon(icon)"
                          accept=".ico"
                          label="Default Image"
                          hide-input
                          v-model="icon"
                      ></v-file-input>

                      <v-avatar v-if="icon!=null" size="100">
                        <img
                            :src="icon.path"
                            alt="Default Icon"
                        >
                      </v-avatar>
                      <v-avatar v-else color="#CCCCCC" size="100">
                        <v-icon>
                          mdi-image
                        </v-icon>
                      </v-avatar>
                      <v-spacer></v-spacer>
                      <v-spacer></v-spacer>
                    </v-row>

                    <v-row align="center" justify="center" class="mt-5">
                      <span class="mt-2 mr-5" style="font-size: 20px"> Default Banner : </span>
                      <v-file-input
                          class="mt-2"
                          @change="onChangeBanner"
                          @click="onClickFileInputBanner(banner)"
                          accept="image/*"
                          label="Default Image"
                          hide-input
                          v-model="banner"
                      ></v-file-input>

                      <v-avatar v-if="banner!=null" size="100">
                        <img
                            :src="banner.path"
                            alt="Default Icon"
                        >
                      </v-avatar>
                      <v-avatar v-else color="#CCCCCC" size="100">
                        <v-icon>
                          mdi-image
                        </v-icon>
                      </v-avatar>
                      <v-spacer></v-spacer>
                      <v-spacer></v-spacer>
                    </v-row>

                  </v-col>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card height="64vh" width="100%">
                  <v-col cols="12" sm="12" md="6" xl="6" class="ml-5 mr-5" v-if="currentProperties!==null">
                    <v-row>
                      <span class="mt-2 mr-4"> Text Sound : </span>
                      <vsm-setter :variable="currentProperties.defaultTextSound" :listvar="assets[5].content" :initialval="false" :assets="assets"> </vsm-setter>
                    </v-row>
                    <v-row class="mt-7">
                      <span class="mt-2 mr-4"> Click Sound : </span>
                      <vsm-setter :variable="currentProperties.defaultClickSound" :listvar="assets[5].content" :initialval="false" :assets="assets"> </vsm-setter>
                    </v-row>
                  </v-col>
              </v-card>
            </v-tab-item>
          </v-tabs>

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
import {shell} from "electron";
import Setter from "@/components/variables/VSM-SetterVariable";
import {deleteFile, getDate, readFileSync, writeFile} from "../lib";
import {mix_modal} from "@/mixins/MIX_Modal";
import path from "path";

export default {
  name: "VSM-EngineCodeEditPanel",

  data () {
    return {
      currentProperties : null,
      icon: null,
      oldiconinput: null,
      banner: null,
      oldbannerinput: null,
      nameText: "ProjectPropertiesPanel",
    };
  },

  components: {
    'vsm-setter' : Setter,
  },

  mixins:[mix_modal],

  props:["properties", "assets"],

  methods:{
    onClickFileInputIcon(i){
      this.oldiconinput = i;
    },
    onChangeIcon(){
      if(this.icon===undefined || this.icon.path===""){
        this.icon = this.oldiconinput;
      }
    },
    onClickFileInputBanner(i){
      this.oldbannerinput = i;
    },
    onChangeBanner(){
      if(this.banner===undefined || this.banner.path===""){
        this.banner = this.oldbannerinput;
      }
    },
    save(){
      if(this.banner !== null && this.banner.path !== "" && this.currentProperties.directory + this.currentProperties.banner !== this.banner.path){
        deleteFile(this.currentProperties.directory + this.currentProperties.banner);
        let filename = "DefaultBanner" + getDate() + "." + this.banner.name.split('.').pop();
        let filedata = readFileSync(this.banner.path);
        this.currentProperties.banner = path.normalize("Assets\\Properties\\"+filename);
        writeFile(this.currentProperties.directory + this.currentProperties.banner, filedata);
      }
      if(this.icon !== null && this.icon.path !== "" && this.currentProperties.directory + this.currentProperties.icon !== this.icon.path){
        deleteFile(this.currentProperties.directory + this.currentProperties.icon);
        let filename = "DefaultIcon" + getDate() + "." + this.icon.name.split('.').pop();
        let filedata = readFileSync(this.icon.path);
        this.currentProperties.icon = path.normalize("Assets\\Properties\\"+filename);
        writeFile(this.currentProperties.directory + this.currentProperties.icon, filedata);
      }
      this.$emit("save", this.currentProperties);
      this.hide();
    },
    show(){
      if(this.properties=== null) return;
      this.currentProperties = JSON.parse(JSON.stringify(this.properties));
      if(this.currentProperties.banner !== "") this.banner = {path : this.currentProperties.directory + this.currentProperties.banner};
      else this.banner = null;
      if(this.currentProperties.icon !== "") this.icon = {path : this.currentProperties.directory + this.currentProperties.icon};
      else this.icon = null;
      this.dialog = true;
    },
    hide(){
      this.dialog = false;
    },
    goDirectory(){
      shell.openPath(this.currentProperties.directory);
    },
  },
}
</script>

<style scoped>

</style>