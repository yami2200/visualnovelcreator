<template>
  <v-card height="67vh">
    <vsm-confirmation-request-modal @accept="deleteAsset" :bus="bus" :headline="headlineCRM" :text="textCRM"></vsm-confirmation-request-modal>

    <vsm-character-edition-modal @accept="saveEdit" @initShortcut="addShortcutPanelList" :project-prop="project_prop" :assets="assets" :bus="bus" :listPages="listPages"></vsm-character-edition-modal>
    <vsm-scene-edit-modal @accept="saveEdit" @initShortcut="addShortcutPanelList" :height="sizeHeight" :project-prop="project_prop" :assets="assets" :bus="bus" :listPages="listPages">  </vsm-scene-edit-modal>
    <vsm-object-edit-modal @accept="saveEdit" @initShortcut="addShortcutPanelList" :project-prop="project_prop" :assets="assets" :bus="bus" :listPages="listPages"></vsm-object-edit-modal>
    <vsm-sound-edit-modal @accept="saveEdit" @initShortcut="addShortcutPanelList" :project-prop="project_prop" :assets="assets" :bus="bus" :listPages="listPages"></vsm-sound-edit-modal>
    <vsm-music-edit-modal @accept="saveEdit" @initShortcut="addShortcutPanelList" :project-prop="project_prop" :assets="assets" :bus="bus" :listPages="listPages"></vsm-music-edit-modal>

    <vsm-contextmenu
        id="5"
        :bus="bus"
        :item-context-menu="itemsMenu"
        @editasset="editAssetRequest(contextMenuIndex)"
        @deleteasset="deleteAssetsRequest(contextMenuIndex)"
    > </vsm-contextmenu>

    <v-tabs
        ref="tabs"
        v-model="tab"
        icon
        show-arrows
        height="5vh"
    >

      <v-tab href="#tab-1" style="min-width: unset!important; width: 20%!important">
        <v-icon>mdi-account-multiple</v-icon>
      </v-tab>

      <v-tab href="#tab-2" style="min-width: unset!important; width: 20%!important">
        <v-icon>mdi-home-city</v-icon>
      </v-tab>

      <v-tab href="#tab-3" style="min-width: unset!important; width: 20%!important">
        <v-icon>mdi-archive</v-icon>
      </v-tab>

      <v-tab href="#tab-4" style="min-width: unset!important; width: 20%!important">
        <v-icon>mdi-music-circle-outline</v-icon>
      </v-tab>

      <v-tab href="#tab-5" style="min-width: unset!important; width: 20%!important">
        <v-icon>mdi-music-note-outline</v-icon>
      </v-tab>

    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item
          v-for="item in assets"
          :key="item.type"
          :value="'tab-' + (assets.indexOf(item)+1)"
      >

            <vsm-listobject
                v-if="item.type === 'Characters' || item.type === 'Scenes' || item.type === 'Objects'"
                height="62vh"
                :items="item.content"
                :bus="bus1"
                searchAttribrute="name"
                @newObject="newAssetRequest"
                @contextMenuClick="contextMenuClick"
                @editObject="editAssetRequest"
                @deleteObject="deleteAssetsRequest">

              <template v-slot:default="slotProps">
                <vsm-listobjectassetimage :img="project_prop.directory + 'Assets\\' + item.type + '\\' + slotProps.itemList.img" :name="slotProps.itemList.name"></vsm-listobjectassetimage>
              </template>

            </vsm-listobject>

            <vsm-listobject
                v-else
                height="62vh"
                :items="item.content"
                :bus="bus1"
                searchAttribrute="name"
                @newObject="newAssetRequest"
                @contextMenuClick="contextMenuClick"
                @editObject="editAssetRequest"
                @deleteObject="deleteAssetsRequest">

              <template v-slot:default="slotProps">
                <vsm-listobjectassetsound :name="slotProps.itemList.name" icon="mdi-music-note-outline"></vsm-listobjectassetsound>
              </template>

            </vsm-listobject>

      </v-tab-item>
    </v-tabs-items>

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
import ListObjectComp from "@/components/VSM-ListObjectComponent";
import ListObjectAssetImageComp from "@/components/listObject/VSM-ListObjectAssetImageComp";
import ListObjectAssetSoundComp from "@/components/listObject/VSM-ListObjectAssetIconComp";
import Vue from "vue";

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
    "vsm-listobject" : ListObjectComp,
    "vsm-listobjectassetimage" : ListObjectAssetImageComp,
    "vsm-listobjectassetsound" : ListObjectAssetSoundComp,
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
  },

  data: () => ({
    tab: null,
    selectedItem: [null,null,null,null,null],
    headlineCRM: "",
    textCRM: "",
    EditionMode: true,
    EditionIndex: 0,
    itemsMenu: [],
    contextMenuIndex: 0,
    deleteIndex: 0,
    bus1: new Vue(),
    ro: null,
    timeoutUpdate: null,
  }),

  mounted() {
    this.bus.$on("updateAssetPanel", this.update);
  },

  methods: {
    update(){
      this.$refs.tabs.callSlider();
    },
    addShortcutPanelList(panel){
      this.$emit("initShortcut", panel);
    },
    deleteAssetsRequest(index){
      if(this.tab!=null){
        var indextab = this.tab.substring(4,5)-1;
        this.deleteIndex = index;
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
        var index = this.deleteIndex;
        if(this.assets[indextab].content.length>0 && index!==null && index!==-1){
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
          this.bus1.$emit("resetSelectItem");
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
    editAssetRequest(index){
      this.EditionMode = true;
      this.EditionIndex = index;
      this.showEditionPanel(true, index);
    },
    newAssetRequest(){
      if(this.tab!=null) {
        this.EditionMode = false;
        this.showEditionPanel(false);
      }
    },
    showEditionPanel(editMode, index = 0){
      var indexTab = this.tab.substring(4,5)-1;
      this.bus.$emit('show'+this.assets[indexTab].type.slice(0, -1)+'EditPanel', {type: editMode, index: index});
    },
    saveEdit(){
      this.$forceUpdate();
      this.$emit("saveAssets");
    },

    contextMenuClick(e, index){
      this.itemsMenu = [{title: "Edit Asset", action: "editasset"},{title: "Delete Asset", action: "deleteasset"}]
      this.contextMenuIndex = index;
      this.bus.$emit("showContextMenu5", e);
    },
  },

}


</script>

<style scoped>

</style>
