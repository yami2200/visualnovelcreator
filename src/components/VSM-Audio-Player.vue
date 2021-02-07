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
          readonly
          min="0"
          :max="duration"
      >

        <template v-slot:prepend>
          <v-card-text>
            00:00
          </v-card-text>
        </template>

        <template v-slot:append>
          <v-card-text>
            00:00
          </v-card-text>
        </template>

      </v-slider>

    <v-row>

      <v-spacer></v-spacer>
      <v-btn outline fab @click="stop" :disabled="disableButton">
        <v-icon large>mdi-stop</v-icon>
      </v-btn>
      <v-btn outline fab @click="togglePlay" :disabled="disableButton">
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
    };
  },

  props: {
    bus: {required: true},
    volume: {required: true},
    url: {required: true},
  },

  computed: {
    getIconPlayButton: function () {
      if(this.pause) return "mdi-pause";
      return "mdi-play";
    },
    disableButton: function () {
      return this.howlPlayer==null;
    }
  },

  methods: {
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

    },
    load(data){
      console.log(data);
      if(data == null) {
        console.log("no sound");
      } else {
        console.log("load sound");
        this.howlPlayer = new Howl({
          src: [data.path],
          autoplay: false,
          loop: false,
          volume: data.volume,
        });
      }
    },

  },

  mounted() {
    this.bus.$on('newAudio', (data) => {
      this.load(data);
    });
  },
}
</script>

<style scoped>

</style>