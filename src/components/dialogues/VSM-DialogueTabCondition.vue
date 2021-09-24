<template>
  <v-card flat height="500">
    <v-row class="mt-4">
      <v-col cols="12" xl="6" md="6" sm="9">
        <v-text-field
            v-if="current!=null"
            label="Name"
            v-model="current.title"
            :value="current.title"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row class="mt-4 ml-1">
      <span class="mt-2 mr-4"> Condition : </span>
      <vsm-setter :variable="current.condition" :listvar="assets[5].content" :initialval="false" :assets="assets"> </vsm-setter>
    </v-row>
  </v-card>
</template>

<script>
import setter from "@/components/variables/VSM-SetterVariable"
import {mix_editdialoguetab} from "@/mixins/MIX_EditDialogueTab";

export default {
  name: "VSM-DialogueTabBasic",

  components:{
    "vsm-setter" : setter
  },

  mixins: [mix_editdialoguetab],
}
</script>

<style scoped>

</style>