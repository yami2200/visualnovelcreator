<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="800px"
  >
    <v-card>
      <v-card-title>
        <span class="headline" v-text="(editionMode ? 'Edit Scene' : 'New Scene')"></span>
      </v-card-title>
      <v-card-text>
        <v-container>
              <v-text-field
                  v-if="currentScene!=null"
                  label="Name"
                  :rules="[rules.required, rules.counter, rules.existCharName]"
                  v-model="currentScene.name"
                  :value="currentScene.name"
              ></v-text-field>
                <v-file-input
                    class="mt-6"
                    @change="onChangeImage()"
                    @click="onClickFileInput()"
                    accept="image/*"
                    label="Default Image"
                    v-model="baseImage"
                    :clearable="false"
                ></v-file-input>
          <v-row>

            <v-spacer></v-spacer>

            <v-img
                v-if="baseImage!=null && baseImage.path !== ''"
                :height="maxHeightImage"
                :src="baseImage.path"
                contain
                alt="Default Image"
            ></v-img>

            <v-avatar v-else tile color="#CCCCCC" size="300" style="width: 100%!important;" class="ma-2">
              <v-icon>
                mdi-image
              </v-icon>
            </v-avatar>

            <v-spacer></v-spacer>

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
import helpButton from "@/components/VSM-HelpButton";
import {mix_modal} from "@/mixins/MIX_Modal";
import path from "path";

const baseScene = jsonBaseCharacter;

export default {
  name: "VSM-SceneEditPanel",

  props: {
    height: {required: true},
  },

  components:{
    "vsm-help-button" : helpButton,
  },

  mixins: [mix_modal, mix_editassetpanel],

  data () {
    return {
      type:"SceneEditPanel",
      nameText: "SceneEditPanel",
      baseImage: null,
      currentScene: null,
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 20 || 'Max 20 characters',
        existCharName: value => (this.assets[1].content.filter(e => e.name === value).length < 1 || this.previousName === value) || 'Already Exist',
      },
      oldimageinput: {name: "", path: ""},
      filesToDelete : [],
    };
  },

  computed: {
    canSave: function () {
      if(this.editionMode) return (this.currentScene!=null && this.currentScene.name !== "" && (this.baseImage!=null) && ((!this.assets[1].content.some(a => a.name === this.currentScene.name)) || this.currentScene.name === this.previousName))
      return (this.currentScene!=null && this.currentScene.name !== "" && this.baseImage!=null && !this.assets[1].content.some(a => a.name === this.currentScene.name));
    },
    maxHeightImage: function () {
      return this.height * 0.4;
    }
  },

  methods : {
    show(){
      this.currentScene = null;
      this.filesToDelete = [];
      if(this.editionMode){
        this.previousName = this.assets[1].content[this.indexEdition].name;
        this.currentScene = JSON.parse(JSON.stringify(this.assets[1].content[this.indexEdition]));
        this.baseImage = { name: this.currentScene.img, path: path.join(this.projectProp.directory, "Assets", "Scenes", this.currentScene.img)};
      } else {
        this.previousName = "";
        this.currentScene = JSON.parse(JSON.stringify(baseScene));
        this.baseImage = null;
      }
      this.dialog = true;
    },
    save(){
      if(this.canSave) {
        var filename = "";
        var filedata = "";
        if(this.editionMode){
          if(this.currentScene.name !== this.previousName){
            if(this.baseImage.name === this.currentScene.img){
              filename = this.currentScene.name + getDate() + "." + this.currentScene.img.split('.').pop();
              renameFile(path.join(this.projectProp.directory, "Assets", "Scenes", this.currentScene.img), path.join(this.projectProp.directory, "Assets", "Scenes", filename));
            }

            removeDependencyVariableAsset("Scene", this.previousName, this.currentScene.name, this.assets, this.listPages);
          }

          if(this.baseImage.name !== this.currentScene.img){
            deleteFile(path.join(this.projectProp.directory, "Assets", "Scenes", this.currentScene.img));
            filename = this.currentScene.name + getDate() + "." + this.baseImage.name.split('.').pop();
            filedata = readFileSync(this.baseImage.path);
            writeFile(path.join(this.projectProp.directory, "Assets", "Scenes", filename), filedata);
            this.currentScene.img = filename;
          } else if (filename !== "") {
            this.currentScene.img = filename;
          }

          this.assets[1].content[this.indexEdition] = this.currentScene;

        } else {
          filename = this.currentScene.name + getDate() + "." + this.baseImage.name.split('.').pop();
          filedata = readFileSync(this.baseImage.path);
          writeFile(path.join(this.projectProp.directory, "Assets", "Scenes", filename), filedata);

          this.currentScene.img = filename;

          this.assets[1].content.push(this.currentScene);
        }
        this.hide();
        this.$emit("accept");
      }
    },
    onChangeImage() {
      if(this.baseImage==null) this.baseImage = this.oldimageinput;
    },
    onClickFileInput() {
      this.oldimageinput = this.baseImage;
    }
  },

}
</script>

<style scoped>

</style>