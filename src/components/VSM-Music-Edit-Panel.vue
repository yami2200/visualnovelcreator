<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="800px"
  >
    <v-card>
      <v-card-title>
        <span class="headline" v-text="(editionMode ? 'Edit Music' : 'New Music')"></span>
      </v-card-title>
      <v-card-text>
        <v-container>

          <v-text-field
              v-if="currentMusic!=null"
              label="Name"
              :rules="[rules.required, rules.counter, rules.existCharName]"
              v-model="currentMusic.name"
              :value="currentMusic.name"
          ></v-text-field>

          <v-slider
              v-model="volume"
              v-if="currentMusic!=null"
              thumb-label
              class="mt-8"
              label="Volume : "
              min="0"
              step="0.01"
              max="1"
              @change="onChangeVolume"
          >
          </v-slider>

          <v-file-input
              class="mt-4"
              @change="onChangeMusic()"
              @click="onClickFileInput()"
              accept="audio/wav, audio/mp3"
              label="Audio path"
              v-model="soundInputFile"
              :clearable="false"
          ></v-file-input>

          <vsm-audioplayer class="mt-4" v-if="currentMusic != null" :url="getUrl" :volume="currentMusic.volume" :bus="audiobus"></vsm-audioplayer>

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
import jsonBaseMusic from "@/assets/base_music.json";
import Vue from "vue";

const baseMusic = jsonBaseMusic;

export default {
  name: "VSM-Music-Edit-Panel",

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
      currentMusic: null,
      editionMode : false,
      indexEdition: 0,
      previousName: "",
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 20 || 'Max 20 characters',
        existCharName: value => (this.assets[3].content.filter(e => e.name === value).length < 1 || this.previousName == value) || 'Already Exist',
      },
      oldSoundInput: {name: "", path: ""},
      audiobus: new Vue(),
      volume: 0.1,
    };
  },

  computed: {
    canSave: function () {
      if(this.editionMode) return (this.currentMusic!=null && this.currentMusic.name != "" && (this.soundInputFile!=null) && ((!this.assets[3].content.some(a => a.name == this.currentMusic.name)) || this.currentMusic.name == this.previousName))
      return (this.currentMusic!=null && this.currentMusic.name != "" && this.soundInputFile!=null && !this.assets[3].content.some(a => a.name == this.currentMusic.name));
    },
    getUrl: function () {
      if(this.soundInputFile == null) return "";
      if(this.soundInputFile.path != this.currentMusic.path) return this.soundInputFile.path
      return this.currentMusic.path;
    }
  },

  methods : {
    show(){
      this.currentMusic = null;
      if(this.editionMode){
        this.previousName = this.assets[3].content[this.indexEdition].name;
        this.currentMusic = JSON.parse(JSON.stringify(this.assets[3].content[this.indexEdition]));
        this.soundInputFile = { name: this.currentMusic.path, path: this.projectProp.directory + "Assets\\Musics\\"+this.currentMusic.path};
        this.volume = this.currentMusic.volume / 100;
        process.nextTick(this.onChangeMusic);
      } else {
        this.previousName = "";
        this.currentMusic = JSON.parse(JSON.stringify(baseMusic));
        this.volume = this.currentMusic.volume / 100;
        this.soundInputFile = null;
        this.audiobus.$emit('newAudio', null);
      }
      this.dialog = true;
    },
    hide() {
      this.audiobus.$emit('newAudio', null);
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
          if(this.currentMusic.name != this.previousName){
            if(this.soundInputFile.name == this.currentMusic.path){
              filename = this.currentMusic.name + getDate() + "." + this.currentMusic.path.split('.').pop();
              renameFile(this.projectProp.directory + "Assets\\Musics\\" + this.currentMusic.path, this.projectProp.directory + "Assets\\Musics\\" + filename);
            }
          }

          if(this.soundInputFile.name != this.currentMusic.path){
            deleteFile(this.projectProp.directory + "Assets\\Musics\\" + this.currentMusic.path);
            filename = this.currentMusic.name + getDate() + "." + this.soundInputFile.name.split('.').pop();
            filedata = readFileSync(this.soundInputFile.path);
            writeFile(this.projectProp.directory + "Assets\\Musics\\" + filename, filedata);
            this.currentMusic.path = filename;
          } else if (filename != "") {
            this.currentMusic.path = filename;
          }

          this.currentMusic.volume = this.volume*100;

          this.assets[3].content[this.indexEdition] = this.currentMusic;

        } else {
          filename = this.currentMusic.name + getDate() + "." + this.soundInputFile.name.split('.').pop();
          filedata = readFileSync(this.soundInputFile.path);
          writeFile(this.projectProp.directory + "Assets\\Musics\\" + filename, filedata);

          this.currentMusic.path = filename;
          this.currentMusic.volume = this.volume*100;

          this.assets[3].content.push(this.currentMusic);
        }
        this.hide();
        this.$emit("accept");
      }
    },
    onChangeMusic() {
      if(this.soundInputFile==null) this.soundInputFile = this.oldSoundInput;
      else {
        this.audiobus.$emit('newAudio', {path: this.soundInputFile.path, volume: this.volume});
      }
    },
    onClickFileInput() {
      this.oldSoundInput = this.soundInputFile;
    },
    onChangeVolume(){
      this.audiobus.$emit('changeVolume', this.volume);
    },
  },

  mounted() {
    this.bus.$on('showMusicEditPanel', (data) => {
      this.editionMode = data.type;
      this.indexEdition = data.index;
      this.show();
    });
    this.bus.$on('hideMusicEditPanel', this.hide);
  },

}
</script>

<style scoped>

</style>