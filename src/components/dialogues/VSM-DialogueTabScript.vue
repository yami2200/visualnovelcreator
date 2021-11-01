<template>
  <v-card flat height="500">
    <vsm-confirmation-request-modal @accept="deleteSelection" :bus="bus" :headline="headlineCRM" :text="textCRM"></vsm-confirmation-request-modal>
    <vsm-scriptselector :bus="bus" @choseFunction="addFunctionTop"> </vsm-scriptselector>
    <vsm-contextmenu
        :bus="bus"
        :item-context-menu="itemsContextMenu"
        @insertnew="insertNewFunctionTopRequest"
        @paste="pasteScript(true)"
        @delete="deleteSelectionRequest(listSelection)"
        @copy="copyScript"
        @cut="cutScript"
        @disable="toggleEnableFunction"
    >
    </vsm-contextmenu>

    <v-row justify="space-between">
      <v-checkbox
          class="ml-6"
          v-model="current.waitEndScript"
          label="Wait the end of all script before leaving the dialogue:"
      ></v-checkbox>
      <vsm-help-button class="mt-3 mr-3" link="https://github.com/yami2200/visualnovelcreator/blob/master/DOC/doc_Scripting.md"></vsm-help-button>
    </v-row>
      <v-card
          class="mx-auto"
          width="100%"
          height="450"
          tile
      >
        <v-list class="mt-2 overflow-y-auto" max-height="400" dense v-scroll.self="stopCurrentInsertionMouse">
          <vsm-scriptlist ref="majorList" @deleteFunction="deleteSingleFunction" @hoverInsertComp="hoverInsertComp" @toggleSelectionComp="toggleSelectionComp" @rightClickComp="rightClickOnFunction" :assets="assets" :action="current.action" :indentation="0"> </vsm-scriptlist>
        </v-list>
        <p class="mt-2 ml-4" :style="{color : colorTextSelection}" style="font-size: 18px"> {{listSelection.length}} function{{getS}} selected ... </p>
      </v-card>
  </v-card>
</template>

<script>
import listScript from "@/components/dialogues/VSM-ListScript";
import contextmenu from "@/components/VSM-ContextMenu";
import Vue from "vue";
import helpButton from "@/components/VSM-HelpButton";
import {mix_editdialoguetab} from "@/mixins/MIX_EditDialogueTab";
import jsonClipboard from "@/assets/base_clipboard.json";
import {clipboard} from "electron";
import {checkValidClipboard} from "@/lib";
import ConfirmationRequest from "@/components/modalrequest/VSM-ConfirmationRequestModal";

export default {
  name: "VSM-DialogueTabBasic",

  components: {
    'vsm-confirmation-request-modal' : ConfirmationRequest,
    "vsm-scriptlist" : listScript,
    "vsm-contextmenu" : contextmenu,
    "vsm-scriptselector" : () => import("@/components/dialogues/VSM-FunctionScriptSelector"),
    "vsm-help-button" : helpButton,
  },

  computed:{
    colorTextSelection(){
      if(this.listSelection.length>0)return this.$vuetify.theme.themes[this.theme].primary;
      return this.$vuetify.theme.themes[this.theme].text;
    },
    getS(){
      return this.listSelection.length <= 1 ? "" : "s";
    },
    theme(){
      return (this.$vuetify.theme.dark) ? 'dark' : 'light'
    }
  },

  data: () => ({
    bus: new Vue(),
    itemsContextMenu: [{title : "Insert New on Top", action : "insertnew"}, {title : "Move on Top", action : "movetop"}],
    CMinfo : null,
    listSelection: [],
    insertLocation: null,
    listDelete : [],
    headlineCRM: "",
    textCRM: "",

  }),

  mixins: [mix_editdialoguetab],

  methods:{
    handleShortcut(e){
      if(e.control && e.key === "c"){
        this.copyScript();
      } else if(e.control && e.key === "v"){
        this.pasteScript();
      } else if(e.control && e.key === "x"){
        this.cutScript();
      } else if(e.key === "Delete"){
        this.deleteSelectionRequest(this.listSelection);
      }
    },
    cutScript(){
      if(this.listSelection.length === 0) return;
      this.copyScript();
      this.listDelete = this.listSelection;
      this.deleteSelection();
    },
    copyScript(){
      if(this.listSelection.length === 0) return;
      let clipoardObj = JSON.parse(JSON.stringify(jsonClipboard));
      clipoardObj.type = "script";
      clipoardObj.content = [];
      this.listSelection.forEach((s) => {
        clipoardObj.content.push(s.fromActions[s.index]);
      });
      clipboard.writeText(JSON.stringify(clipoardObj));
    },
    toggleEnableFunction(){
      if(this.listSelection.length === 0) return;
      this.listSelection.forEach((s) => {
        this.disableFunction(s.fromActions[s.index], (s.fromActions[s.index].enable !== undefined ? !s.fromActions[s.index].enable : false));
      });
    },
    disableFunction(f, newVal){
      f.enable = newVal;
      if(f.action !== undefined) f.action.forEach((a) => {this.disableFunction(a, newVal);})
      if(f.actionif !== undefined) f.actionif.forEach((a) => {this.disableFunction(a, newVal);})
      if(f.actionelse !== undefined) f.actionelse.forEach((a) => {this.disableFunction(a, newVal);})
    },
    pasteScript(cm = false){
      let clipboardObj = checkValidClipboard("script");
      if(clipboardObj === null) return;

      if(this.insertLocation !== null){
        for(let i = clipboardObj.content.length-1; i >= 0;i--){
          clipboardObj.content[i].indentation = this.insertLocation.indentation;
          this.insertLocation.fromActions.splice(this.insertLocation.index, 0, clipboardObj.content[i]);
        }
      } else if(cm){
        for(let i = clipboardObj.content.length-1; i >= 0;i--){
          clipboardObj.content[i].indentation = this.CMinfo.indentation;
          this.CMinfo.actions.splice(this.CMinfo.index, 0, clipboardObj.content[i]);
        }
      } else return;

      this.unselectAll();
      this.stopCurrentInsertionMouse();
    },
    hoverInsertComp(comp){
      this.insertLocation = comp;
    },
    stopCurrentInsertionMouse(){
      if(this.insertLocation !== undefined && this.insertLocation !== null){
        this.insertLocation.stopHover();
      }
    },
    toggleSelectionComp(comp){
      let v = this.listSelection.filter(c => c.index === comp.index && c.fromActions === comp.fromActions);
      if(v.length>0){
        this.listSelection.splice(this.listSelection.indexOf(v[0]),1);
        if(!comp.ctrl && this.listSelection.length>0){
          this.unselectAll();
          this.addComponentToSelection(comp);
          comp.setSelect(true);
        }
      } else {
        if(comp.ctrl){
          this.addComponentToSelection(comp);
        } else {
          this.unselectAll();
          this.addComponentToSelection(comp);
        }
      }
    },
    addComponentToSelection(comp){
      if(comp === null) return;
      if(comp.fromActions === undefined) comp.fromActions = this.current.action;
      this.listSelection.push(comp);
    },
    rightClickOnFunction(data){
      this.CMinfo = data;

      if(this.insertLocation !== null || data.setSelect === undefined){
        if(this.insertLocation !== null){
          this.CMinfo.index = this.insertLocation.index;
          this.CMinfo.actions = this.insertLocation.fromActions;
          this.CMinfo.indentation = this.insertLocation.indentation;
        }
        this.itemsContextMenu = [ {title: "Insert New", action : "insertnew"}];
        let clipboardObj = checkValidClipboard("script");
        if(clipboardObj !== null) this.itemsContextMenu.push({title: "Paste", action : "paste"});
        this.bus.$emit("showContextMenu", data.e);
        this.unselectAll();
        return;
      }

      let v = this.listSelection.filter(c => c.index === data.index && c.fromActions === data.actions);
      if(v.length>0){
        console.log("already selected !");
      } else {
        this.unselectAll();
        this.addComponentToSelection({index : data.index, fromActions: data.actions, actions: data.actions, setSelect: data.setSelect});
      }
      process.nextTick(() => {
        this.itemsContextMenu = [{title: "Copy", action : "copy"}, {title: "Cut", action : "cut"}, {title: "Disable/Enable", action : "disable"}, {title: "Delete", action : "delete"}];
        this.bus.$emit("showContextMenu", data.e);
      })
    },
    unselectAll(){
      this.listSelection.forEach((e) => {
        if(e.setSelect !== undefined){
          e.setSelect(false);
        }
      });
      this.listSelection = [];
    },
    insertNewFunctionTopRequest(){
      if(this.CMinfo===null)return;
      this.bus.$emit("showFunctionScriptSelector", {index : this.CMinfo.index, indentation : this.CMinfo.indentation});
    },
    addFunctionTop(data){
      if(this.CMinfo===null)return;
      this.CMinfo.actions.splice(data.index, 0, data.function);
    },
    deleteSelection(){
      if(this.listDelete.length === undefined || this.listDelete.length === 0) return;
      let sortedList = this.listDelete.sort((a,b) => (a.index > b.index) ? -1 : ((b.index > a.index) ? 1 : 0));
      sortedList.forEach((e) => {
        e.setSelect(false);
        e.fromActions.splice(e.index, 1);
      });
      this.unselectAll();
      this.listSelection = [];
    },
    deleteSelectionRequest(list){
      this.headlineCRM = "Do you really want to delete "+(list.length === 0 ? "this function ?" : "these functions ?");
      this.textCRM = "You are trying to delete "+list.length+" function"+(list.length === 0 ? "" : "s")+", are you sure you want to continue ? ";
      this.listDelete = list;
      this.bus.$emit('showConfirmationRequestModal');
    },
    deleteSingleFunction(comp){
      this.deleteSelectionRequest([comp]);
    },
  }
}
</script>

<style scoped>

</style>