<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="90%"
      max-height="900px"
  >
    <v-card
        max-height="80vh"
        height="80vh">
      <v-card-title>
        <span class="headline" v-text="'Engine Code Edition :'"></span>
      </v-card-title>
      <v-card-text height="100%">
        <v-card height="100%">
          <v-container v-if="assets[7] !== undefined">

            <v-tabs v-model="tab" vertical height="63vh">
              <v-tab v-for="(file,index) in  assets[7].content" :key="index+file.title">
                <v-icon>{{ file.icon }}</v-icon>
                {{ file.title }}
              </v-tab>
              <v-tabs-items v-model="tab">
                <v-tab-item
                    v-for="(tab,indexT) in assets[7].content"
                    :key="indexT"
                >
                  <MonacoEditor
                      theme="vs-dark"
                      width="100%"
                      height="60vh"
                      language="javascript"
                      @change="onChange"
                      :options="options"
                  ></MonacoEditor>
                </v-tab-item>
              </v-tabs-items>
            </v-tabs>

          </v-container>
        </v-card>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="blue darken-1"
            text
            @click="hide"
        >
          Close
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import MonacoEditor from 'monaco-editor-vue';

export default {
  name: "VSM-EngineCodeEditPanel",

  components: {
    MonacoEditor
  },

  data () {
    return {
      dialog: false,
      tab: null,
      options: {
        value: "",
        language: "javascript",
      },
    };
  },

  props:["assets", "bus"],

  mounted() {
    this.bus.$on('showEngineCodeEditPanel', this.show);
    this.bus.$on('hideEngineCodeEditPanel', this.hide);
  },

  methods:{
    show(){
      this.dialog = true;
    },
    hide(){
      this.dialog = false;
    },
    onChange(value){
      console.log(value);
    }
  },
}
</script>

<style scoped>

</style>