<template>
  <v-card :height="sizeTabsPannel">
    <vsm-confirmation-request-modal @accept="deleteAsset" :bus="bus" :headline="headlineCRM" :text="textCRM"></vsm-confirmation-request-modal>
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
          :key="item"
          :value="'tab-' + (assets.indexOf(item)+1)"
      >

        <v-list shaped :height="sizeList"
                class="overflow-y-auto">
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
                <v-img :src="iteml.img"></v-img>
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
    <!-- <v-bottom-navigation :height="sizeTabs">

      <v-btn>
        <span>Delete</span>

        <v-icon>mdi-delete</v-icon>
      </v-btn>

      <v-btn>
        <span>Edit</span>

        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>

      <v-btn>
        <span>New</span>

        <v-icon>mdi-plus-circle</v-icon>
      </v-btn>

    </v-bottom-navigation>-->
    <!--<v-toolbar
        :height="sizeTabs"
        center
    >
      <v-btn icon>
        <span>Delete</span>
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon>
        <span>Edit</span>
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon>
        <span>New</span>
        <v-icon>mdi-plus-circle</v-icon>
      </v-btn>
    </v-toolbar>-->

    <v-app-bar
        dense
        :height="sizeTabs"
    >
      <v-spacer></v-spacer>

      <v-btn icon @click="deleteAssetsRequest">
        <v-icon>mdi-delete</v-icon>
      </v-btn>

      <v-btn icon @click="bus.$emit('testParent'); console.log('Lets go !')">
        <v-icon>mdi-pencil-outline</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-plus-circle</v-icon>
      </v-btn>

      <v-spacer></v-spacer>
    </v-app-bar>

  </v-card>
</template>

<script>
import ConfirmationRequest from './VSM-ConfirmationRequestModal.vue';

export default {
  name: "VSM-AssetsPanel",

  props: {
    sizeHeight : {required: true},
    assets : {required: true},
    bus : {required: true},
  },

  components: {
    'vsm-confirmation-request-modal' : ConfirmationRequest,
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
    }
  },

  data: () => ({
    tab: null,
    selectedItem: [null,null,null,null,null],
    headlineCRM: "",
    textCRM: "",
  }),

  methods: {
    deleteAssetsRequest(){
      //console.log(this.tab.substring(4,5));
      //console.log(this.selectedItem[this.tab.substring(4,5)-1]);
      this.headlineCRM = "Do you really want to delete this asset ?";
      this.textCRM = "You are trying to delete the asset : "+", are you sure you want to continue ? ";
      this.bus.$emit('showConfirmationRequestModal');
    },
    deleteAsset(){
      if(this.tab!=null){
        var indextab = this.tab.substring(4,5)-1;
        var index = this.selectedItem[indextab];
        if(this.assets[indextab].content.length>0 && index!=null){
          this.assets[indextab].content.splice(index,1);
          this.selectedItem[indextab] = null;
        }
      }
    }
  },

}


</script>

<style scoped>

</style>