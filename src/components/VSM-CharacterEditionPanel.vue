<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="800px"
  >
    <v-card>
      <v-card-title>
        <span class="headline" v-text="(editionMode ? 'Edit Character' : 'New Character')"></span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-text-field
                  label="Name"
                  required
                  v-model="currentCharacter.name"
                  :value="(currentCharacter!=null ? currentCharacter.name : '')"
              ></v-text-field>
              <v-slider
                  class="mt-5"
                  v-model="sliderSizeX"
                  :max="100"
                  :min="1"
                  :thumb-size="20"
                  thumb-label="always"
                  label="Horizontal size"
              ></v-slider>
              <v-slider
                  class="mt-5"
                  :max="100"
                  :min="1"
                  :thumb-size="20"
                  v-model="sliderSizeY"
                  thumb-label="always"
                  label="Vertical size"
              ></v-slider>
            </v-col>
            <v-col cols="6">
              <v-img src="https://culturezvous.com/wp-content/uploads/2019/12/chateau_chambord.jpg"></v-img>
            </v-col>

            <v-col cols="6">
              <v-row justify="space-around" class="mb-7 mt-3">

                <v-spacer></v-spacer>

                <v-avatar v-if="baseImage!=null" size="100">
                  <img
                      :src="baseImage.path"
                      alt="Default Image"
                  >
                </v-avatar>

                <v-avatar v-else size="100">
                  <img
                      :src="require('../assets/logo.svg')"
                  >
                </v-avatar>

                <v-spacer></v-spacer>

              </v-row>
              <v-file-input
                  accept="image/*"
                  label="Default Image"
                  v-model="baseImage"
              ></v-file-input>
            </v-col>
            <v-col cols="6">
              <v-card>
              <v-list dense height="200px" class="mt-2 overflow-y-auto" >
                <v-list-item-group
                    color="primary"
                    v-model="selectedItemStateImage"
                >
                  <v-list-item
                      v-for="(imgo, index) in currentCharacter.imgOthers"
                      :key="index"
                  >
                    <v-list-item-avatar v-if="imgo.img != ''">
                      <v-img :src="projectProp.directory + 'Assets\\Characters\\' +imgo.img"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-text-field
                          label="Name"
                          v-model="imgo.name"
                      ></v-text-field>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-row>
                        <v-file-input
                            hide-input
                            prepend-icon="mdi-folder-image"
                            color="grey darken-5"
                            v-model="imageImportList[index]"
                        ></v-file-input>
                        <v-btn icon>
                          <v-icon color="red lighten-1">mdi-delete</v-icon>
                        </v-btn>

                      </v-row>

                    </v-list-item-action>

                  </v-list-item>
                </v-list-item-group>
              </v-list>
              </v-card>
              <v-row class="mt-3">
                <v-spacer></v-spacer>
                <v-btn @click="addNewImageState"> Add new Image </v-btn>
                <v-spacer></v-spacer>
              </v-row>

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
            :disabled=!canSave
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
import jsonBaseCharacter from './../assets/base_characters.json';

const baseCharacter = jsonBaseCharacter;
var fs = require('fs');

export default {
  name: "VSM-CharacterEditionPanel",

  data () {
    return {
      dialog: false,
      sliderSizeX : 10,
      sliderSizeY : 10,
      baseImage: null,
      currentCharacter: null,
      editionMode : false,
      indexEdition: 0,
      previousName: "",
      selectedItemStateImage: 1,
      imageImportList: []
    }
  },

  computed: {
    canSave: function () {
      if(this.editionMode) return (this.currentCharacter!=null && this.currentCharacter.name != "" && this.baseImage!=null && (!this.assets[0].content.some(a => a.name == this.currentCharacter.name)) || this.currentCharacter.name == this.previousName)
      return (this.currentCharacter!=null && this.currentCharacter.name != "" && this.baseImage!=null && !this.assets[0].content.some(a => a.name == this.currentCharacter.name));
    },
  },

  props: {
    bus: {required: true},
    assets: {required: true},
    projectProp : {required: true},
  },

  methods: {
    show() {
      if(this.editionMode){
        this.previousName = this.assets[0].content[this.indexEdition].name;
        this.currentCharacter = Object.assign({}, this.assets[0].content[this.indexEdition]);
        this.baseImage = { name: this.currentCharacter.img, path: this.projectProp.directory + "Assets\\Characters\\"+this.currentCharacter.img};
        this.imageImportList = null;
        this.currentCharacter.imgOthers.forEach(element => {
          this.imageImportList.push({name: element.img, path: this.projectProp.directory + "Assets\\Characters\\"+element.img });
        });
        console.log("edit asset");
      } else {
        this.currentCharacter = null;
        this.imageImportList = null;
        this.currentCharacter = Object.assign({}, baseCharacter);
        this.baseImage = null;
        console.log("new asset");
      }
      this.dialog = true;
    },
    hide() {
      this.dialog = false;
    },
    cancel() {
      this.hide();
      this.$emit("cancel");
    },
    save() {
      if(this.canSave){
        var char = this.assets[0].content[this.indexEdition];
        if(this.editionMode){
          if(this.currentCharacter.name != char.name){
            console.log("");
          }
        } else {
          var filename = this.currentCharacter.name + "_Normal." + this.baseImage.name.split('.').pop();
          fs.readFile(this.baseImage.path, (err, data) => {
            if(err){
              alert("An error ocurred reading the image :" + err.message);
              return;
            }
            fs.writeFile(this.projectProp.directory + "Assets\\Characters\\" + filename, data, (err) => {
              if(err){
                alert("An error ocurred while saving images !" + " #" +err.code)
              }
            });
          });

          this.currentCharacter.img = filename;

          this.assets[0].content.push(this.currentCharacter);
        }
        this.hide();
        this.$emit("accept");
      }
    },
    print(){
      console.log(this.baseImage);
    },
    addNewImageState(){
      this.imageImportList.push({ name: "", path: "" });
      this.currentCharacter.imgOthers.push({name : "", img : ""});
    }
  },

  mounted() {
    this.bus.$on('showCharacterEditionPanel', (data) => {
      this.editionMode = data.type;
      this.indexEdition = data.index;
      this.show();
    });
    this.bus.$on('hideCharacterEditionPanel', this.hide)
  },
}
</script>

<style scoped>

</style>