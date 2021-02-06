<template>
  <v-card :height="sizeTabsPannel">
    <vsm-confirmation-request-modal @accept="deleteAsset" :bus="bus" :headline="headlineCRM" :text="textCRM"></vsm-confirmation-request-modal>
    <vsm-character-edition-modal @accept="saveEditCharacter" :project-prop="project_prop" :assets="assets" :index-edition="EditionIndex" :bus="bus" ></vsm-character-edition-modal>
    <v-tabs
        v-model="tab"
        icon
        show-arrows
        :height="sizeTabs"
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab href="#tab-1">
        <v-icon>mdi-account-multiple</v-icon>
      </v-tab>

      <v-tab href="#tab-2">
        <v-icon>mdi-home-city</v-icon>
      </v-tab>

      <v-tab href="#tab-3">
        <v-icon>mdi-archive</v-icon>
      </v-tab>

      <v-tab href="#tab-4">
        <v-icon>mdi-music-circle-outline</v-icon>
      </v-tab>

      <v-tab href="#tab-5">
        <v-icon>mdi-music-note-outline</v-icon>
      </v-tab>

    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item
          v-for="item in assets"
          :key="item.type"
          :value="'tab-' + (assets.indexOf(item)+1)"
      >

        <v-list shaped :height="sizeList" class="overflow-y-auto">
          <v-subheader> {{ item.type }} : </v-subheader>
          <v-list-item-group
              v-model="selectedItem[assets.indexOf(item)]"
              color="primary"
          >
            <v-list-item
                v-for="(iteml, i) in item.content"
                :key="i"
            >
              <v-list-item-avatar v-if="item.type == 'Characters' || item.type == 'Scenes' || item.type == 'Objects'">
                <v-img :src="project_prop.directory + 'Assets\\' + item.type + '\\' + iteml.img"></v-img>
              </v-list-item-avatar>

              <v-list-item-icon v-else>
                <v-icon> mdi-music-note-outline </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title v-text="iteml.name"></v-list-item-title>
              </v-list-item-content>

            </v-list-item>
          </v-list-item-group>
        </v-list>

      </v-tab-item>
    </v-tabs-items>

    <v-app-bar
        dense
        :height="sizeTabs"
    >
      <v-spacer></v-spacer>

      <v-btn icon @click="deleteAssetsRequest" :disabled=disableEditionButtons>
        <v-icon>mdi-delete</v-icon>
      </v-btn>

      <v-btn icon @click="editAssetRequest" :disabled=disableEditionButtons>
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>

      <v-btn icon @click="newAssetRequest">
        <v-icon>mdi-plus-circle</v-icon>
      </v-btn>

      <v-spacer></v-spacer>
    </v-app-bar>

  </v-card>
</template>

<script>
import ConfirmationRequest from './VSM-ConfirmationRequestModal.vue';
import CharacterEdition from './VSM-CharacterEditionPanel.vue';
import {deleteFile} from './../lib.js';

export default {
  name: "VSM-AssetsPanel",

  props: {
    sizeHeight : {required: true},
    assets : {required: true},
    project_prop: {required: true},
    bus : {required: true},
  },

  components: {
    'vsm-confirmation-request-modal' : ConfirmationRequest,
    'vsm-character-edition-modal' : CharacterEdition,
  },

  computed: {
    sizeTabsPannel: function () {
      return (this.sizeHeight * 0.67)+"px";
    },
    sizeList: function () {
      return (this.sizeHeight * 0.57)+"px";
    },
    sizeTabs: function () {
      return (this.sizeHeight * 0.05)+"px";
    },
    disableEditionButtons : function () {
      return (this.tab==null || !(this.assets[this.tab.substring(4,5)-1].content.length>0 && this.selectedItem[this.tab.substring(4,5)-1]!=null));
    }
  },

  data: () => ({
    tab: null,
    selectedItem: [null,null,null,null,null],
    headlineCRM: "",
    textCRM: "",
    EditionMode: true,
    EditionIndex: 0,
  }),

  methods: {
    deleteAssetsRequest(){
      if(this.tab!=null){
        var indextab = this.tab.substring(4,5)-1;
        var index = this.selectedItem[indextab];
        if(this.assets[indextab].content.length>0 && index!=null){
          this.headlineCRM = "Do you really want to delete this asset ?";
          this.textCRM = "You are trying to delete the asset : "+", are you sure you want to continue ? ";
          this.bus.$emit('showConfirmationRequestModal');
        }
      }
    },
    deleteAsset(){
      if(this.tab!=null){
        var indextab = this.tab.substring(4,5)-1;
        var index = this.selectedItem[indextab];
        if(this.assets[indextab].content.length>0 && index!=null){
          switch (indextab) {
            case 0 :
              this.deleteCharacterDependency(this.assets[indextab].content[index]);
              break;
          }
          this.assets[indextab].content.splice(index,1);
          this.selectedItem[indextab] = undefined;
        }
      }
    },
    deleteCharacterDependency(character) {
      var dir = this.project_prop.directory + "Assets\\Characters\\";
      deleteFile(dir + character.img);
      for(var i = 0; i<character.imgOthers.length; i++){
        deleteFile(dir + character.imgOthers[i].img);
      }
    },
    editAssetRequest(){
      if(!this.disableEditionButtons){
        this.EditionMode = true;
        var indextab = this.tab.substring(4,5)-1;
        var index = this.selectedItem[indextab];
        this.EditionIndex = index;
        this.showEditionPanel(true);
      }
    },
    newAssetRequest(){
      if(this.tab!=null) {
        this.EditionMode = false;
        this.showEditionPanel(false);
      }
    },
    showEditionPanel(editMode){
      var indexTab = this.tab.substring(4,5)-1;
      var index = this.selectedItem[indexTab];
      if(this.assets[indexTab].type == "Characters"){
        this.bus.$emit('showCharacterEditionPanel', {type: editMode, index: index});
      }
    },
    saveEditCharacter(){
      this.$forceUpdate();
    }
  },

}


</script>

<style scoped>

</style>