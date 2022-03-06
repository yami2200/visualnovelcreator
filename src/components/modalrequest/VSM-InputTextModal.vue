<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
  >
    <v-card>
      <v-card-title class="headline">
        {{ headline }}
      </v-card-title>
      <v-card-text> {{ text }}</v-card-text>

      <v-text-field
          @keydown="pressKey"
          class="mr-4 ml-4"
          v-model="textinput"
          ref="inputTextField"
          :rules="[rules.required, rules.counter, rules.duplicate, rules.invalidcharacters]"
      ></v-text-field>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="green darken-1"
            text
            @click="cancel"
        >
          Cancel
        </v-btn>
        <v-btn
            :disabled="disableAccept"
            color="green darken-1"
            text
            @click="accept"
        >
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {mix_modal} from "@/mixins/MIX_Modal";

export default {
  name: "VSM-InputTextModal",

  props: {
    bus : {required: true},
    headline : {required: true},
    text : {required: true},
    maxLetters : {},
    duplicateNames : {},
  },

  mixins:[mix_modal],

  data () {
    return {
      nameText: "InputText",
      textinput: "",
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= this.maxLetters || 'Max '+this.maxLetters+' characters',
        duplicate : value => (this.duplicateNames === undefined || !this.duplicateNames.includes(value)) || "Duplicate Name",
        invalidcharacters : value => !value.includes('&') || 'Invalid Character',
      },
    }
  },

  computed: {
    disableAccept(){
      return (this.textinput.length === 0 || this.textinput.includes('&') || this.textinput.length > this.maxLetters || (this.duplicateNames !== undefined && this.duplicateNames.includes(this.textinput)));
    },
  },

  methods: {
    show(textinit) {
      this.dialog = true;
      this.textinput = textinit;
      let ref = this;
      setTimeout(function(){
        ref.$refs["inputTextField"].focus();
      }, 100);
    },
    cancel() {
      this.hide();
      this.$emit("cancel");
    },
    save(){
      this.accept();
    },
    accept() {
      if(this.textinput.length === 0 || this.textinput.length > this.maxLetters) return ;
      this.hide();
      this.$emit("accept", this.textinput);
    },
    pressKey(e){
      if(e.key === "Enter"){
        this.accept();
      } else if(e.key === "Escape"){
        this.cancel();
      }
    },
  },

}
</script>

<style scoped>

</style>