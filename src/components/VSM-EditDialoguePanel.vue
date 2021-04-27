<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="800px"
  >
    <v-card>
      <v-card-title>
        <v-tabs v-if="current != null" v-model="tab">
          <v-tab v-for="(tab,index) in current.tabs" :key="index"> {{ tab }} </v-tab>
        </v-tabs>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-tabs-items v-if="current != null" v-model="tab">
            <v-tab-item
                v-for="(tab,index) in current.tabs"
                :key="index"
            >
              <vsm-tabdialogue v-if="tab === 'Dialogue'" :current="current" :assets="assets"></vsm-tabdialogue>
              <vsm-tabcondition v-if="tab === 'Condition'" :current="current" :assets="assets"></vsm-tabcondition>
              <vsm-tabinput v-if="tab === 'Input'" :current="current" :assets="assets"></vsm-tabinput>

            </v-tab-item>
          </v-tabs-items>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="blue darken-1"
            text
            @click="cancel"
        >
          Cancel
        </v-btn>
        <v-btn
            :disabled=!canSave
            color="blue darken-1"
            text
            @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import TabDialogue from "@/components/dialogues/VSM-DialogueTabBasic"
import TabDialogueCondition from "@/components/dialogues/VSM-DialogueTabCondition"
import TabDialogueInput from "@/components/dialogues/VSM-DialogueTabInput"

export default {
  name: "VSM-EditDialoguePanel",

  props:["bus", "listDialogues", "listVar", "assets"],

  components:{
    "vsm-tabdialogue" : TabDialogue,
    "vsm-tabcondition" : TabDialogueCondition,
    "vsm-tabinput" : TabDialogueInput,
  },

  computed:{
    canSave(){
      return true;
    }
  },

  data: () => ({
    dialog: false,
    current: null,
    tab: "",
    index: -1
  }),

  methods:{
    save(){
      this.listDialogues[this.index] = this.current;
      this.$emit("refresh");
      this.hide();
    },
    cancel(){
      this.hide();
    },
    show(data){
      if(this.listDialogues[data.index] === undefined || this.listDialogues[data.index] === null || this.listDialogues[data.index].tabs.length === 0) return;

      this.index = data.index;
      this.current = JSON.parse(JSON.stringify(this.listDialogues[data.index]));

      this.dialog = true;
    },
    hide(){
      this.dialog = false;
    }
  },

  mounted() {
    this.bus.$on("showEditDialoguePanel", this.show);
  }
}
</script>

<style scoped>

</style>