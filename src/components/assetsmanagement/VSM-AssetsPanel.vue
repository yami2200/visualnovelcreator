<template>
  <v-card height="67vh">
    <vsm-confirmation-request-modal @accept="deleteAsset" :bus="bus" :headline="headlineCRM" :text="textCRM"></vsm-confirmation-request-modal>

    <vsm-character-edition-modal @accept="saveEdit" :project-prop="project_prop" :assets="assets" :bus="bus" :listPages="listPages"></vsm-character-edition-modal>
    <vsm-scene-edit-modal @accept="saveEdit" :height="sizeHeight" :project-prop="project_prop" :assets="assets" :bus="bus" :listPages="listPages">  </vsm-scene-edit-modal>
    <vsm-object-edit-modal @accept="saveEdit" :project-prop="project_prop" :assets="assets" :bus="bus" :listPages="listPages"></vsm-object-edit-modal>
    <vsm-sound-edit-modal @accept="saveEdit" :project-prop="project_prop" :assets="assets" :bus="bus" :listPages="listPages"></vsm-sound-edit-modal>
    <vsm-music-edit-modal @accept="saveEdit" :project-prop="project_prop" :assets="assets" :bus="bus" :listPages="listPages"></vsm-music-edit-modal>

    <vsm-contextmenu
        id="5"
        :bus="bus"
        :item-context-menu="itemsMenu"
        @editasset="editAssetRequest"
        @deleteasset="deleteAssetsRequest"
    > </vsm-contextmenu>

    <v-tabs
        v-model="tab"
        icon
        show-arrows
        height="5vh"
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

        <v-list shaped height="57vh" class="overflow-y-auto">
          <v-subheader> {{ item.type }} : </v-subheader>
          <v-list-item-group
              v-model="selectedItem[assets.indexOf(item)]"
              color="primary"
          >
            <v-list-item
                v-for="(iteml, i) in item.content"
                :key="i"
                @contextmenu="contextMenuClick($event, i)"
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
        height="50vh"
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
import ConfirmationRequest from '../modalrequest/VSM-ConfirmationRequestModal.vue';
import CharacterEdition from './editpanel/VSM-CharacterEditionPanel.vue';
import SceneEditPanel from './editpanel/VSM-SceneEditPanel';
import ObjectEditPanel from './editpanel/VSM-ObjetEditPanel';
import SoundEditPanel from './editpanel/VSM-Sound-Edit-Panel';
import MusicEditPanel from './editpanel/VSM-Music-Edit-Panel';
import {deleteFile, removeDependencyVariableAsset} from '../../lib.js';
import contextMenu from "@/components/VSM-ContextMenu";

export default {
  name: "VSM-AssetsPanel",

  props: {
    sizeHeight : {required: true},
    assets : {required: true},
    project_prop: {required: true},
    bus : {required: true},
    listPages : {required: true}
  },

  components: {
    'vsm-confirmation-request-modal' : ConfirmationRequest,
    'vsm-character-edition-modal' : CharacterEdition,
    'vsm-scene-edit-modal' : SceneEditPanel,
    'vsm-object-edit-modal' :ObjectEditPanel,
    'vsm-sound-edit-modal' : SoundEditPanel,
    'vsm-music-edit-modal' : MusicEditPanel,
    'vsm-contextmenu' : contextMenu,
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
    itemsMenu: [],
  }),

  methods: {
    deleteAssetsRequest(){
      if(this.tab!=null){
        var indextab = this.tab.substring(4,5)-1;
        var index = this.selectedItem[indextab];
        if(this.assets[indextab].content.length>0 && index!=null){
          this.headlineCRM = "Do you really want to delete this asset ?";
          this.textCRM = "You are trying to delete the "+this.assets[indextab].type.slice(0, -1)+" : "+this.assets[indextab].content[index].name +", are you sure you want to continue ? ";
          this.bus.$emit('showConfirmationRequestModal');
        }
      }
    },
    deleteAsset(){
      if(this.tab!=null){
        var indextab = this.tab.substring(4,5)-1;
        var index = this.selectedItem[indextab];
        if(this.assets[indextab].content.length>0 && index!=null){
          switch (this.assets[indextab].type) {
            case "Characters" :
              this.deleteCharacterDependency(this.assets[indextab].content[index]);
              break;
            case "Scenes" :
              this.deleteSceneDependency(this.assets[indextab].content[index]);
              break;
            case "Objects" :
              this.deleteObjectDependency(this.assets[indextab].content[index]);
              break;
            case "Sounds" :
              this.deleteSoundDependency(this.assets[indextab].content[index]);
              break;
            case "Musics" :
              this.deleteMusicDependency(this.assets[indextab].content[index]);
              break;
          }
          this.assets[indextab].content.splice(index,1);
          this.selectedItem[indextab] = undefined;
          this.$emit("saveAssets");
        }
      }
    },
    deleteCharacterDependency(character) {
      var dir = this.project_prop.directory + "Assets\\Characters\\";
      deleteFile(dir + character.img);
      for(var i = 0; i<character.imgOthers.length; i++){
        deleteFile(dir + character.imgOthers[i].img);
      }
      removeDependencyVariableAsset("Character", character.name, "null", this.assets, this.listPages);
    },
    deleteSceneDependency(scene){
      deleteFile(this.project_prop.directory + "Assets\\Scenes\\" + scene.img);
      removeDependencyVariableAsset("Scene", scene.name, "null", this.assets, this.listPages);
    },
    deleteSoundDependency(sound){
      deleteFile(this.project_prop.directory + "Assets\\Sounds\\" + sound.path);
      removeDependencyVariableAsset("Sound", sound.name, "null", this.assets, this.listPages);
    },
    deleteMusicDependency(music){
      deleteFile(this.project_prop.directory + "Assets\\Musics\\" + music.path);
      removeDependencyVariableAsset("Music", music.name, "null", this.assets, this.listPages);
    },
    deleteObjectDependency(object){
      deleteFile(this.project_prop.directory + "Assets\\Objects\\" + object.img);
      removeDependencyVariableAsset("Object", object.name, "null", this.assets, this.listPages);
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
      this.bus.$emit('show'+this.assets[indexTab].type.slice(0, -1)+'EditPanel', {type: editMode, index: index});
    },
    saveEdit(){
      this.$forceUpdate();
      this.$emit("saveAssets");
    },

    contextMenuClick(e, index){
      this.itemsMenu = [{title: "Edit Asset", action: "editasset"},{title: "Delete Asset", action: "deleteasset"}]
      var indextab = this.tab.substring(4,5)-1;
      this.selectedItem[indextab] = index;
      this.bus.$emit("showContextMenu5", e);
    },
  },

}


</script>

<style scoped>

</style>