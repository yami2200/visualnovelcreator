<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="800px"
  >
    <v-card>
      <v-card-title>
        <span class="headline" v-text="(editionMode ? 'Edit Object' : 'New Object')"></span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="6">
              <v-text-field
                  v-if="currentObject!=null"
                  label="Name"
                  :rules="[rules.required, rules.counter, rules.existCharName]"
                  v-model="currentObject.name"
                  :value="currentObject.name"
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
            </v-col>

            <v-col cols="6">
              <v-spacer></v-spacer>

              <v-avatar size="300" v-if="baseImage!=null && baseImage.path!=''">
                <img
                    width="100%"
                    :src="baseImage.path"
                    alt="Default Image"
                >
              </v-avatar>
              <v-avatar v-else color="#CCCCCC" size="300">
                <v-icon>
                  mdi-image
                </v-icon>
              </v-avatar>

              <v-spacer></v-spacer>
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
import jsonBaseObject from '../../../assets/base_object.json';
import {deleteFile, getDate, readFileSync, removeDependencyVariableAsset, renameFile, writeFile} from "@/lib";
import {mix_editassetpanel} from "@/mixins/MIX_EditAssetPanel";
import helpButton from "@/components/VSM-HelpButton";

const baseObject = jsonBaseObject;

export default {
  name: "VSM-ObjetEditPanel",

  mixins: [mix_editassetpanel],

  components:{
    "vsm-help-button" : helpButton,
  },

  data () {
    return {
      type: "ObjectEditPanel",
      baseImage: null,
      currentObject: null,
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 20 || 'Max 20 characters',
        existCharName: value => (this.assets[1].content.filter(e => e.name === value).length < 1 || this.previousName == value) || 'Already Exist',
      },
      oldimageinput: {name: "", path: ""},
      filesToDelete : [],
    };
  },

  computed: {
    canSave: function () {
      if(this.editionMode) return (this.currentObject!=null && this.currentObject.name != "" && (this.baseImage!=null) && ((!this.assets[2].content.some(a => a.name == this.currentObject.name)) || this.currentObject.name == this.previousName))
      return (this.currentObject!=null && this.currentObject.name != "" && this.baseImage!=null && !this.assets[2].content.some(a => a.name == this.currentObject.name));
    },
  },

  methods : {
    show(){
      this.currentObject = null;
      this.filesToDelete = [];
      if(this.editionMode){
        this.previousName = this.assets[2].content[this.indexEdition].name;
        this.currentObject = JSON.parse(JSON.stringify(this.assets[2].content[this.indexEdition]));
        this.baseImage = { name: this.currentObject.img, path: this.projectProp.directory + "Assets\\Objects\\"+this.currentObject.img};
      } else {
        this.previousName = "";
        this.currentObject = JSON.parse(JSON.stringify(baseObject));
        this.baseImage = null;
      }
      this.dialog = true;
    },
    save(){
      if(this.canSave) {
        var filename = "";
        var filedata = "";
        if(this.editionMode){
          if(this.currentObject.name != this.previousName){
            if(this.baseImage.name == this.currentObject.img){
              filename = this.currentObject.name + getDate() + "." + this.currentObject.img.split('.').pop();
              renameFile(this.projectProp.directory + "Assets\\Objects\\" + this.currentObject.img, this.projectProp.directory + "Assets\\Objects\\" + filename);
            }

            removeDependencyVariableAsset("Object", this.previousName, this.currentObject.name, this.assets, this.listPages);
          }

          if(this.baseImage.name != this.currentObject.img){
            deleteFile(this.projectProp.directory + "Assets\\Objects\\" + this.currentObject.img);
            filename = this.currentObject.name + getDate() + "." + this.baseImage.name.split('.').pop();
            filedata = readFileSync(this.baseImage.path);
            writeFile(this.projectProp.directory + "Assets\\Objects\\" + filename, filedata);
            this.currentObject.img = filename;
          } else if (filename != "") {
            this.currentObject.img = filename;
          }

          this.assets[2].content[this.indexEdition] = this.currentObject;

        } else {
          filename = this.currentObject.name + getDate() + "." + this.baseImage.name.split('.').pop();
          filedata = readFileSync(this.baseImage.path);
          writeFile(this.projectProp.directory + "Assets\\Objects\\" + filename, filedata);

          this.currentObject.img = filename;

          this.assets[2].content.push(this.currentObject);
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