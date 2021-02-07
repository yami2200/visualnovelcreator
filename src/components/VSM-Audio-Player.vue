<template>
  <!-- https://muhammadatt.medium.com/building-an-mp3-audio-player-in-vue-js-c5884207251c -->
  <!-- https://code.tutsplus.com/fr/tutorials/building-a-full-featured-music-player-with-vuetify--cms-31228 -->
  <v-container>
    <audio
        style="display:none"
        ref="player"
        @timeupdate="timeUpdate"
    >
      <source :src="url" type="audio/mpeg" />
    </audio>


      <v-slider
          v-model="timePlayed"
          color="red"
          min="0"
          :readonly="howlPlayer == null"
          step="0.01"
          :max="getSlideDuration"
          @change="changeCurrentTime"
          @mousedown="mouseOnSlider"
      >

        <template v-slot:prepend>
          <v-card-text>
            {{  getCurrentTime }}
          </v-card-text>
        </template>

        <template v-slot:append>
          <v-card-text>
            {{ getDuration }}
          </v-card-text>
        </template>

      </v-slider>

    <v-row>

      <v-spacer></v-spacer>
      <v-btn fab @click="stop" :disabled="disableButton">
        <v-icon large>mdi-stop</v-icon>
      </v-btn>
      <v-btn fab @click="togglePlay" :disabled="disableButton">
        <v-icon large> {{ getIconPlayButton }}</v-icon>
      </v-btn>
      <v-spacer></v-spacer>

    </v-row>

  </v-container>


</template>

<script>
import {Howl} from 'howler';

export default {
  name: "VSM-Audio-Player",

  data () {
    return {
      timePlayed: 0,
      duration: 100,
      pause: true,
      howlPlayer: null,
      wasPlaying: false,
    };
  },

  props: {
    bus: {required: true},
    volume: {required: true},
    url: {required: true},
  },

  watch: {
    pause(pause) {
      this.timePlayed = this.howlPlayer.seek()
      let updateSeek
      if (!pause) {
        updateSeek = setInterval(() => {
          if(!this.pause) this.timePlayed = this.howlPlayer.seek()
        }, 20)
      } else {
        clearInterval(updateSeek)
      }
    },
  },

  computed: {
    getIconPlayButton: function () {
      if(this.pause) return "mdi-play";
      return "mdi-pause";
    },
    disableButton: function () {
      return this.howlPlayer==null;
    },
    getDuration: function () {
      if(this.howlPlayer!=null) return this.durationFormat(this.howlPlayer.duration());
      return '00:00';
    },
    getCurrentTime: function (){
      if(this.howlPlayer!=null) return this.durationFormat(this.timePlayed);
      return '00:00';
    },
    getSlideDuration: function (){
      if(this.howlPlayer!=null) return Math.trunc(this.howlPlayer.duration());
      return 100;
    }
  },

  methods: {
    durationFormat(duration) {
      var min = Math.trunc(duration/60);
      var sec = Math.trunc(duration - min*60);
      return (min<10 ? '0'+min : min) + ":"+(sec<10 ? '0'+sec : sec);
    },
    timeUpdate(){

    },
    togglePlay(){
      if(!this.disableButton){
        this.pause = !this.pause;
        if(this.pause){
          this.howlPlayer.pause();
        } else {
          this.howlPlayer.play();
        }
      }
    },
    stop(){
      this.howlPlayer.stop();
      this.pause = true;
    },
    load(data){
      if(this.howlPlayer!=null){
        this.howlPlayer.stop();
        this.howlPlayer = null;
        if(!this.pause) this.pause = true;
      }
      if(data != null) {
        const ref = this;
        this.howlPlayer = new Howl({
          src: [data.path],
          autoplay: false,
          loop: false,
          volume: data.volume,
          onend: function() {
            ref.pause = true;
          }
        });
      }
    },
    mouseOnSlider(){
      if(this.howlPlayer != null){
        if(this.pause){
          this.wasPlaying = false;
        } else {
          this.wasPlaying = true;
          this.togglePlay();
        }
      }
    },
    changeCurrentTime(){
      if(this.howlPlayer != null){
        this.howlPlayer.seek(this.timePlayed);
        if(this.wasPlaying) this.togglePlay();
      }
    }
  },

  mounted() {
    this.bus.$on('newAudio', (data) => {
      this.load(data);
    });
    this.bus.$on('changeVolume', (data) => {
      if(this.howlPlayer != null){
        this.howlPlayer.volume = data;
      }
    });
  },
}
</script>

<style scoped>

</style>