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

          <v-slider
              v-model="volume"
              v-if="currentSound!=null"
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
              @change="onChangeSound()"
              @click="onClickFileInput()"
              accept="audio/wav, audio/mp3"
              label="Audio path"
              v-model="soundInputFile"
              :clearable="false"
          ></v-file-input>

          <vsm-audioplayer class="mt-4" v-if="currentSound != null" :url="getUrl" :volume="currentSound.volume" :bus="audiobus"></vsm-audioplayer>

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
import {deleteFile, getDate, readFileSync, removeDependencyVariableAsset, renameFile, writeFile} from "@/lib";
import AudioPlayer from '../../VSM-Audio-Player';
import jsonBaseSound from "@/assets/base_sound.json";
import Vue from "vue";
import {mix_editassetpanel} from "@/mixins/MIX_EditAssetPanel";
import helpButton from "@/components/VSM-HelpButton";
import {mix_modal} from "@/mixins/MIX_Modal";
import path from "path";

const baseSound = jsonBaseSound;

export default {
  name: "VSM-Sound-Edit-Panel",

  components: {
    'vsm-audioplayer' : AudioPlayer,
    "vsm-help-button" : helpButton,
  },

  mixins: [mix_modal, mix_editassetpanel],

  data () {
    return {
      type:"SoundEditPanel",
      nameText: "SoundEditPanel",
      soundInputFile: null,
      currentSound: null,
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 20 || 'Max 20 characters',
        existCharName: value => (this.assets[4].content.filter(e => e.name === value).length < 1 || this.previousName === value) || 'Already Exist',
      },
      oldSoundInput: {name: "", path: ""},
      audiobus: new Vue(),
      volume: 0.1,
    };
  },

  computed: {
    canSave: function () {
      if(this.editionMode) return (this.currentSound!=null && this.currentSound.name !== "" && (this.soundInputFile!=null) && ((!this.assets[4].content.some(a => a.name === this.currentSound.name)) || this.currentSound.name === this.previousName))
      return (this.currentSound!=null && this.currentSound.name !== "" && this.soundInputFile!=null && !this.assets[4].content.some(a => a.name === this.currentSound.name));
    },
    getUrl: function () {
      if(this.soundInputFile == null) return "";
      if(this.soundInputFile.path !== this.currentSound.path) return this.soundInputFile.path
      return this.currentSound.path;
    }
  },

  methods : {
    show(){
      this.currentSound = null;
      if(this.editionMode){
        this.previousName = this.assets[4].content[this.indexEdition].name;
        this.currentSound = JSON.parse(JSON.stringify(this.assets[4].content[this.indexEdition]));
        this.soundInputFile = { name: this.currentSound.path, path: path.normalize(this.projectProp.directory + "Assets\\Sounds\\"+this.currentSound.path)};
        this.volume = this.currentSound.volume / 100;
        process.nextTick(this.onChangeSound);
      } else {
        this.previousName = "";
        this.currentSound = JSON.parse(JSON.stringify(baseSound));
        this.volume = this.currentSound.volume / 100;
        this.soundInputFile = null;
        this.audiobus.$emit('newAudio', null);
      }
      this.dialog = true;
    },
    hide() {
      this.audiobus.$emit('newAudio', null);
      this.dialog = false;
    },
    save(){
      if(this.canSave) {
        var filename = "";
        var filedata = "";
        if(this.editionMode){
          if(this.currentSound.name !== this.previousName){
            if(this.soundInputFile.name === this.currentSound.path){
              filename = this.currentSound.name + getDate() + "." + this.currentSound.path.split('.').pop();
              renameFile(path.normalize(this.projectProp.directory + "Assets\\Sounds\\" + this.currentSound.path), path.normalize(this.projectProp.directory + "Assets\\Sounds\\" + filename));
            }

            removeDependencyVariableAsset("Sound", this.previousName, this.currentSound.name, this.assets, this.listPages);
          }

          if(this.soundInputFile.name !== this.currentSound.path){
            deleteFile(path.normalize(this.projectProp.directory + "Assets\\Sounds\\" + this.currentSound.path));
            filename = this.currentSound.name + getDate() + "." + this.soundInputFile.name.split('.').pop();
            filedata = readFileSync(this.soundInputFile.path);
            writeFile(path.normalize(this.projectProp.directory + "Assets\\Sounds\\" + filename), filedata);
            this.currentSound.path = filename;
          } else if (filename !== "") {
            this.currentSound.path = filename;
          }

          this.currentSound.volume = this.volume*100;

          this.assets[4].content[this.indexEdition] = this.currentSound;

        } else {
          filename = this.currentSound.name + getDate() + "." + this.soundInputFile.name.split('.').pop();
          filedata = readFileSync(this.soundInputFile.path);
          writeFile(path.normalize(this.projectProp.directory + "Assets\\Sounds\\" + filename), filedata);

          this.currentSound.path = filename;
          this.currentSound.volume = this.volume*100;

          this.assets[4].content.push(this.currentSound);
        }
        this.hide();
        this.$emit("accept");
      }
    },
    onChangeSound() {
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

}
</script>

<style scoped>

</style>