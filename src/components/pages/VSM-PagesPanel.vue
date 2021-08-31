<template>
  <v-card height="30vh">

    <vsm-contextmenu
        :bus="bus"
        :item-context-menu="itemsMenu"
        @editpage="renameRequest(contextMenuIndex)"
        @deletepage="deletePageRequest(contextMenuIndex)"
    > </vsm-contextmenu>


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
        @deleteObject="deletePageRequest"
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
import Vue from "vue";
import ListObjectAssetIconComp from "@/components/listObject/VSM-ListObjectAssetIconComp";

export default {
  name: "VSM-PagesPanel",

  props:['listPage', 'bus'],

  components:{
    'vsm-contextmenu' : contextMenu,
    "vsm-listobject" : ListObjectComp,
    "vsm-listobjectasseticon" : ListObjectAssetIconComp,
  },

  data: () => ({
    itemsMenu: [],
    bus1: new Vue(),
    contextMenuIndex: -1,
  }),

  methods:{
    newPageRequest(){
      this.$emit("requestPage", {index : 0, type : "new"});
    },
    deletePageRequest(index){
      this.$emit("requestPage", {index : index, type : "delete"});
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