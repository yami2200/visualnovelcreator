<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="800px"
  >
    <v-card>
      <v-card-title>
        <span class="headline" v-text="(editionMode ? 'Edit Sound' : 'New Sound')"></span>
      </v-card-title>
      <v-card-text>
        <v-container>

          <v-text-field
              v-if="currentSound!=null"
              label="Name"
              :rules="[rules.required, rules.counter, rules.existCharName]"
              v-model="currentSound.name"
              :value="currentSound.name"
          ></v-text-field>

          <v-file-input
              class="mt-6"
              @change="onChangeSound()"
              @click="onClickFileInput()"
              accept="audio/wav, audio/mp3"
              label="Default Image"
              v-model="soundInputFile"
              :clearable="false"
          ></v-file-input>

          <v-slider
          min="0"
          step="0.01"
          max="1"
          @change="onChangeVolume"
          >

          </v-slider>

          <vsm-audioplayer v-if="currentSound != null" :url="getUrl" :volume="currentSound.volume" :bus="audiobus"></vsm-audioplayer>

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
import {deleteFile, getDate, readFileSync, renameFile, writeFile} from "@/lib";
import AudioPlayer from './VSM-Audio-Player';
import jsonBaseSound from "@/assets/base_characters.json";
import Vue from "vue";

const baseSound = jsonBaseSound;

export default {
  name: "VSM-Sound-Edit-Panel",

  components: {
    'vsm-audioplayer' : AudioPlayer,
  },

  props: {
    bus: {required: true},
    assets: {required: true},
    projectProp : {required: true},
  },

  data () {
    return {
      dialog: false,
      soundInputFile: null,
      currentSound: null,
      editionMode : false,
      indexEdition: 0,
      previousName: "",
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 20 || 'Max 20 characters',
        existCharName: value => (this.assets[4].content.filter(e => e.name === value).length < 1 || this.previousName == value) || 'Already Exist',
      },
      oldSoundInput: {name: "", path: ""},
      audiobus: new Vue(),
    };
  },

  computed: {
    canSave: function () {
      if(this.editionMode) return (this.currentSound!=null && this.currentSound.name != "" && (this.soundInputFile!=null) && ((!this.assets[4].content.some(a => a.name == this.currentSound.name)) || this.currentSound.name == this.previousName))
      return (this.currentSound!=null && this.currentSound.name != "" && this.soundInputFile!=null && !this.assets[4].content.some(a => a.name == this.currentSound.name));
    },
    getUrl: function () {
      if(this.soundInputFile == null) return "";
      if(this.soundInputFile.path != this.currentSound.path) return this.soundInputFile.path
      return this.currentSound.path;
    }
  },

  methods : {
    show(){
      this.currentSound = null;
      this.filesToDelete = [];
      if(this.editionMode){
        this.previousName = this.assets[4].content[this.indexEdition].name;
        this.currentSound = JSON.parse(JSON.stringify(this.assets[4].content[this.indexEdition]));
        this.soundInputFile = { name: this.currentSound.path, path: this.projectProp.directory + "Assets\\Scenes\\"+this.currentSound.path};
      } else {
        this.previousName = "";
        this.currentSound = JSON.parse(JSON.stringify(baseSound));
        this.soundInputFile = null;
        this.audiobus.$emit('newAudio', null);
      }
      this.dialog = true;
    },
    hide() {
      this.dialog = false;
    },
    cancel(){
      this.hide();
      this.$emit("cancel");
    },
    save(){
      if(this.canSave) {
        var filename = "";
        var filedata = "";
        if(this.editionMode){
          if(this.currentSound.name != this.previousName){
            if(this.soundInputFile.name == this.currentSound.path){
              filename = this.currentSound.name + getDate() + "." + this.currentSound.path.split('.').pop();
              renameFile(this.projectProp.directory + "Assets\\Sounds\\" + this.currentSound.path, this.projectProp.directory + "Assets\\Sounds\\" + filename);
            }
          }

          if(this.soundInputFile.name != this.currentSound.path){
            deleteFile(this.projectProp.directory + "Assets\\Sounds\\" + this.currentSound.path);
            filename = this.currentSound.name + getDate() + "." + this.soundInputFile.name.split('.').pop();
            filedata = readFileSync(this.soundInputFile.path);
            writeFile(this.projectProp.directory + "Assets\\Sounds\\" + filename, filedata);
            this.currentSound.path = filename;
          } else if (filename != "") {
            this.currentSound.path = filename;
          }

          this.assets[4].content[this.indexEdition] = this.currentSound;

        } else {
          filename = this.currentSound.name + getDate() + "." + this.soundInputFile.name.split('.').pop();
          filedata = readFileSync(this.soundInputFile.path);
          writeFile(this.projectProp.directory + "Assets\\Sounds\\" + filename, filedata);

          this.currentSound.path = filename;

          this.assets[4].content.push(this.currentSound);
        }
        this.hide();
        this.$emit("accept");
      }
    },
    onChangeSound() {
      if(this.soundInputFile==null) this.soundInputFile = this.oldSoundInput;
      else {
        this.audiobus.$emit('newAudio', {path: this.soundInputFile.path, volume: 0.5});
      }
    },
    onClickFileInput() {
      this.oldSoundInput = this.soundInputFile;
    },
    onChangeVolume(){

    },
  },

  mounted() {
    this.bus.$on('showSoundEditPanel', (data) => {
      this.editionMode = data.type;
      this.indexEdition = data.index;
      this.show();
    });
    this.bus.$on('hideSoundEditPanel', this.hide);
  },

}
</script>

<style scoped>

</style>