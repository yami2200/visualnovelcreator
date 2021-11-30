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
                  v-if="currentCharacter!=null"
                  label="Name"
                  :rules="[rules.required, rules.counter, rules.existCharName]"
                  v-model="currentCharacter.name"
                  :value="currentCharacter.name"
              ></v-text-field>
              <v-slider
                  v-if="currentCharacter!=null"
                  class="mt-5"
                  v-model="currentCharacter.size"
                  :max="5"
                  :min="0.1"
                  :step="0.1"
                  :thumb-size="20"
                  thumb-label="always"
                  label="Image size"
              ></v-slider>

              <v-row justify="space-around" class="mb-7 mt-9">

                <v-spacer></v-spacer>
                <span class="mt-10 mr-5" style="font-size: 16px"> Default Image : </span>
                <v-file-input
                    class="mt-6"
                    @change="onChangeImage(-1)"
                    @click="onClickFileInput(baseImage)"
                    accept="image/*"
                    label="Default Image"
                    hide-input
                    v-model="baseImage"
                ></v-file-input>

                <v-avatar v-if="baseImage!=null" size="100">
                  <img
                      :src="baseImage.path"
                      alt="Default Image"
                  >
                </v-avatar>

                <v-avatar v-else color="#CCCCCC" size="100">
                  <v-icon>
                    mdi-image
                  </v-icon>
                </v-avatar>

                <v-spacer></v-spacer>

              </v-row>
            </v-col>
            <v-col cols="6">
              <!--<v-img src="https://culturezvous.com/wp-content/uploads/2019/12/chateau_chambord.jpg"></v-img>-->
              <v-card>
                <v-list dense height="350px" class="mt-2 overflow-y-auto" v-if="currentCharacter!=null">
                  <v-list-item
                      v-for="(imgo, index) in currentCharacter.imgOthers"
                      :key="index"
                  >
                    <v-list-item-avatar v-if="imgo.img !== '' || imageImportList[index].path !== ''">
                      <v-img v-if="imageImportList[index].path !== ''" :src="imageImportList[index].path"></v-img>
                      <v-img v-else :src="projectProp.directory + 'Assets\\Characters\\' +imgo.img" @click="print(projectProp.directory + 'Assets\\Characters\\' +imgo.img)"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-text-field
                          label="Name"
                          v-model="imgo.name"
                          :rules="[rules.required, rules.counter]"
                      ></v-text-field>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-row>
                        <v-file-input
                            @change="onChangeImage(index)"
                            @click="onClickFileInput(imageImportList[index])"
                            hide-input
                            accept="image/*"
                            prepend-icon="mdi-folder-image"
                            color="grey darken-5"
                            v-model="imageImportList[index]"
                        ></v-file-input>
                        <v-btn icon @click="deleteNewImageState(index)">
                          <v-icon color="red lighten-1">mdi-delete</v-icon>
                        </v-btn>

                      </v-row>

                    </v-list-item-action>

                  </v-list-item>
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
        <vsm-help-button link="https://github.com/yami2200/visualnovelcreator/blob/master/DOC/doc_AssetManager.md"></vsm-help-button>
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
import jsonBaseCharacter from '../../../assets/base_characters.json';
import {readFileSync, writeFile, renameFile, deleteFile, getDate, removeDependencyVariableAsset} from '@/lib';
import {mix_editassetpanel} from "@/mixins/MIX_EditAssetPanel";
import helpButton from "@/components/VSM-HelpButton.vue";
import {mix_modal} from "@/mixins/MIX_Modal";
import path from "path";

const baseCharacter = jsonBaseCharacter;

export default {
  name: "VSM-CharacterEditionPanel",

  mixins: [mix_modal, mix_editassetpanel],

  components:{
    "vsm-help-button" : helpButton,
  },

  data () {
    return {
      type:"CharacterEditPanel",
      nameText: "CharacterEditPanel",
      indexAsset: 0,
      baseImage: null,
      currentCharacter: null,
      imageImportList: [],
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 20 || 'Max 20 characters',
        existCharName: value => (this.assets[0].content.filter(e => e.name === value).length < 1 || this.previousName === value) || 'Already Exist',
      },
      oldimageinput: {name: "", path: ""},
      filesToDelete : [],
    };
  },

  computed: {
    canSave: function () {
      if(this.editionMode) return (this.currentCharacter!=null && this.currentCharacter.name !== "" && (this.baseImage!=null || this.currentCharacter.img !== "") && ((!this.assets[0].content.some(a => a.name === this.currentCharacter.name)) || this.currentCharacter.name === this.previousName) && this.listOthersImagesValid)
      return (this.currentCharacter!=null && this.currentCharacter.name !== "" && this.baseImage!=null && !this.assets[0].content.some(a => a.name === this.currentCharacter.name) && this.listOthersImagesValid);
    },
    listOthersImagesValid: function () {
      if(this.currentCharacter==null) return false;
      var names = [];
      for(var i = 0; i<this.currentCharacter.imgOthers.length; i++){
        if(this.currentCharacter.imgOthers[i].name === "" || (this.currentCharacter.imgOthers[i].img === "" && this.imageImportList[i].path === "")) return false;
        if(names.includes(this.currentCharacter.imgOthers[i].name)) return false;
        names.push(this.currentCharacter.imgOthers[i].name);
      }
      return true;
    },
  },

  methods: {
    show() {

      this.filesToDelete = [];
      this.currentCharacter = null;
      this.imageImportList = [];

      if(this.editionMode){
        this.previousName = this.assets[0].content[this.indexEdition].name;
        this.currentCharacter = JSON.parse(JSON.stringify(this.assets[0].content[this.indexEdition]));
        this.baseImage = { name: this.currentCharacter.img, path: path.join(this.projectProp.directory, "Assets", "Characters", this.currentCharacter.img)};
        this.currentCharacter.imgOthers.forEach(element => {
          this.imageImportList.push({name: element.img, path: path.join(this.projectProp.directory, "Assets", "Characters", element.img) });
        });
      } else {
        this.previousName = "";
        this.currentCharacter = JSON.parse(JSON.stringify(baseCharacter));
        this.currentCharacter.imgOthers = [];
        this.baseImage = null;
      }
      this.dialog = true;
    },
    save() {
      if(this.canSave) {
        var char = this.assets[0].content[this.indexEdition];
        var filename = "";
        var filedata = "";
        var imgName = "";
        var imgdata = "";
        var i = 0;
        if (this.editionMode) {

          // Case change the name
          if (this.currentCharacter.name !== char.name) {

            // change image name or delete the old one
            if (this.baseImage.name === this.currentCharacter.img) {
              filename = this.currentCharacter.name + "_Normal_" + getDate() + "." + this.currentCharacter.img.split('.').pop();
              renameFile(path.join(this.projectProp.directory, "Assets", "Characters", this.currentCharacter.img), path.join(this.projectProp.directory, "Assets", "Characters", filename));
            }

            // change others image
            for (i = 0; i < this.currentCharacter.imgOthers.length; i++) {
              if (this.currentCharacter.imgOthers[i].img !== "") {
                if (this.imageImportList[i].name !== this.currentCharacter.imgOthers[i].img) {
                  deleteFile(path.join(this.projectProp.directory, "Assets", "Characters", this.currentCharacter.imgOthers[i].img));
                } else {
                  renameFile(path.join(this.projectProp.directory, "Assets", "Characters", this.currentCharacter.imgOthers[i].img), path.join(this.projectProp.directory, "Assets", "Characters", this.currentCharacter.name + "_" + this.currentCharacter.imgOthers[i].name + "_" + new Date() + "." + this.currentCharacter.imgOthers[i].img.split('.').pop()));
                }
              }
            }

            removeDependencyVariableAsset("Character", char.name, this.currentCharacter.name, this.assets, this.listPages);
          }

            // Case change the image
            if (this.baseImage.name !== this.currentCharacter.img) {
              deleteFile(path.join(this.projectProp.directory, "Assets", "Characters", this.currentCharacter.img));
              filename = this.currentCharacter.name + "_Normal_" + getDate() + "." + this.baseImage.name.split('.').pop();
              filedata = readFileSync(this.baseImage.path);
              writeFile(path.join(this.projectProp.directory, "Assets", "Characters", filename), filedata);
              this.currentCharacter.img = filename;
            } else if (filename !== "") {
              this.currentCharacter.img = filename;
            }

            // add new others images files and replace old images
            for (i = 0; i < this.currentCharacter.imgOthers.length; i++) {
              if (this.imageImportList[i].name !== this.currentCharacter.imgOthers[i].img) {
                if (this.currentCharacter.imgOthers[i].img !== "") {
                  deleteFile(path.join(this.projectProp.directory, "Assets", "Characters", this.currentCharacter.imgOthers[i].img));
                }
                imgName = this.currentCharacter.name + "_" + this.currentCharacter.imgOthers[i].name + "_" + getDate() + "." + this.imageImportList[i].name.split('.').pop();
                imgdata = readFileSync(this.imageImportList[i].path);
                writeFile(path.join(this.projectProp.directory, "Assets", "Characters", imgName), imgdata);
                this.currentCharacter.imgOthers[i].img = imgName;
              } else if(!this.currentCharacter.imgOthers[i].img.includes(this.currentCharacter.name+"_"+this.currentCharacter.imgOthers[i].name+"_")){
                imgName = this.currentCharacter.name + "_" + this.currentCharacter.imgOthers[i].name + "_" + getDate() + "." + this.currentCharacter.imgOthers[i].img.split('.').pop();
                var oldDir = path.join(this.projectProp.directory, "Assets", "Characters", this.currentCharacter.imgOthers[i].img);
                imgdata = readFileSync(oldDir);
                writeFile(path.join(this.projectProp.directory, "Assets", "Characters", imgName), imgdata);
                deleteFile(oldDir);
                this.currentCharacter.imgOthers[i].img = imgName;
              }
            }

            // deletes local files from deleted assets
            for(i = 0; i < this.filesToDelete.length ; i++){
              deleteFile(path.join(this.projectProp.directory, "Assets", "Characters", this.filesToDelete[i]));
            }

            this.assets[0].content[this.indexEdition] = this.currentCharacter;

          } else {
            // Copy Image Character in directory
            filename = this.currentCharacter.name + "_Normal_" + getDate() + "." + this.baseImage.name.split('.').pop();
            filedata = readFileSync(this.baseImage.path);
            writeFile(path.join(this.projectProp.directory, "Assets", "Characters", filename), filedata);

            for (i = 0; i < this.currentCharacter.imgOthers.length; i++) {
              imgName = this.currentCharacter.name + "_" + this.currentCharacter.imgOthers[i].name + "_" + getDate() + "." + this.imageImportList[i].name.split('.').pop();
              imgdata = readFileSync(this.imageImportList[i].path);
              writeFile(path.join(this.projectProp.directory, "Assets", "Characters", imgName), imgdata);
              this.currentCharacter.imgOthers[i].img = imgName;
            }

            this.currentCharacter.img = filename;

            this.assets[0].content.push(this.currentCharacter);
          }
          this.hide();
          this.$emit("accept");
        }
    },
    print(text){
      console.log(text);
    },
    addNewImageState(){
      this.imageImportList.push({ name: "", path: "" });
      this.currentCharacter.imgOthers.push({name : "", img : ""});
    },
    deleteNewImageState(index){
      if(this.currentCharacter.imgOthers[index].img !== "") this.filesToDelete.push(this.currentCharacter.imgOthers[index].img);
      this.imageImportList.splice(index, 1);
      this.currentCharacter.imgOthers.splice(index, 1);
    },
    onChangeImage(index){
      if(index === -1){
        if(this.baseImage === undefined || this.baseImage.path === ""){
          this.baseImage = this.oldimageinput;
        }
      } else {
        if(this.imageImportList[index] === undefined || this.imageImportList[index].path === "") {
          this.imageImportList[index] = this.oldimageinput;
        }
      }
    },
    onClickFileInput(image){
      this.oldimageinput = image;
    }
  },

}
</script>

<style scoped>

</style>