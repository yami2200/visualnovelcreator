<template>
  <v-card height="30vh">

    <vsm-contextmenu
        :bus="bus"
        :item-context-menu="itemsMenu"
        @editpage="renameRequest(contextMenuIndex)"
        @deletepage="deletePageButton(contextMenuIndex)"
    > </vsm-contextmenu>

    <vsm-confirmation @accept="deletePageRequest" :bus="bus1" headline="Do you really want to delete this page ?" :text="textCRM"></vsm-confirmation>

    <vsm-listobject
        height="30vh"
        :items="listPage"
        :bus="bus1"
        :mandatory="true"
        :canSearch="false"
        searchAttribrute="title"
        @newObject="newPageRequest"
        @contextMenuClick="contextMenuClick"
        @editObject="renameRequest"
        @deleteObject="deletePageButton"
        @changeItem="onChange">

      <template v-slot:default="slotProps">
        <vsm-listobjectasseticon icon="mdi-book-open-page-variant-outline" :name="slotProps.itemList.title"></vsm-listobjectasseticon>
      </template>

    </vsm-listobject>

  </v-card>
</template>

<script>
import contextMenu from "@/components/VSM-ContextMenu";
import ListObjectComp from "@/components/VSM-ListObjectComponent";
import ConfirmationRequestModal from "@/components/modalrequest/VSM-ConfirmationRequestModal";
import Vue from "vue";
import ListObjectAssetIconComp from "@/components/listObject/VSM-ListObjectAssetIconComp";

export default {
  name: "VSM-PagesPanel",

  props:['listPage', 'bus'],

  components:{
    'vsm-contextmenu' : contextMenu,
    "vsm-listobject" : ListObjectComp,
    "vsm-listobjectasseticon" : ListObjectAssetIconComp,
    "vsm-confirmation" : ConfirmationRequestModal,
  },

  data: () => ({
    itemsMenu: [],
    bus1: new Vue(),
    contextMenuIndex: -1,
    deletedIndex: -1,
    textCRM: ""
  }),

  methods:{
    newPageRequest(){
      this.$emit("requestPage", {index : 0, type : "new"});
    },
    deletePageButton(index){
      this.deletedIndex = index;
      this.textCRM = "You are trying to delete the page : "+this.listPage[index].title+", are you sure you want to continue ? ";
      this.bus1.$emit('showConfirmationRequestModal');
    },
    deletePageRequest(){
      if(this.deletedIndex === -1) return;
      this.$emit("requestPage", {index : this.deletedIndex, type : "delete"});
    },
    renameRequest(index){
      this.$emit("requestPage", {index : index, type : "rename"});
    },
    onChange(i){
      if(i === undefined || i === null) return;
      process.nextTick(() => {
        this.$emit("changePage", i);
      });
    },
    changeSelectedPage(newIndex){
      this.bus1.$emit("setSelectItem", (newIndex<0 ? 0 : newIndex));
      this.$forceUpdate();
    },

    contextMenuClick(e, index){
      this.itemsMenu = [{title: "Rename Page", action: "editpage"},{title: "Delete Page", action: "deletepage"}]
      this.contextMenuIndex = index;
      this.bus.$emit("showContextMenu", e);
    },

  },

  mounted() {
    this.bus.$on('changeSelectedPage', this.changeSelectedPage);
  },
}
</script>

<style scoped>

</style>