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
      <span class="mt-2 mr-4"> Speaker : </span>
      <vsm-setter :variable="current.speaker" :listvar="assets[5].content" :initialval="false" :assets="assets"> </vsm-setter>
      <v-text-field
          class="ml-4 mr-10"
          :disabled="current.speaker.value.value!=='null'"
          label="Speaker Text"
          v-model="current.speakernull"
          :value="current.speakernull"
      ></v-text-field>
    </v-row>
    <v-textarea
        class="mt-3"
        name="Dialogue Text"
        label="Dialogue Text"
        :value="current.text"
        v-model="current.text"
    ></v-textarea>
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