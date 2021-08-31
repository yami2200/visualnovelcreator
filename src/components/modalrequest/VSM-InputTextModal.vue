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
          :rules="[rules.required, rules.counter, rules.duplicate]"
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
export default {
  name: "VSM-InputTextModal",

  props: {
    bus : {required: true},
    headline : {required: true},
    text : {required: true},
    maxLetters : {},
    duplicateNames : {},
  },

  data () {
    return {
      dialog: false,
      textinput: "",
      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= this.maxLetters || 'Max '+this.maxLetters+' characters',
        duplicate : value => (this.duplicateNames === undefined || !this.duplicateNames.includes(value)) || "Duplicate Name"
      },
    }
  },

  computed: {
    disableAccept(){
      return (this.textinput.length === 0 || this.textinput.length > this.maxLetters || (this.duplicateNames !== undefined && this.duplicateNames.includes(this.textinput)));
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
    hide() {
      this.dialog = false;
    },
    cancel() {
      this.hide();
      this.$emit("cancel");
    },
    accept() {
      if(this.textinput.length === 0 || this.textinput.length > this.maxLetters) return ;
      this.hide();
      this.$emit("accept", this.textinput);
    },
    pressKey(e){
      if(e.key === "Enter"){
        this.accept();
      }
    },
  },

  mounted() {
    this.bus.$on('showInputText', this.show);
    this.bus.$on('hideInputText', this.hide)
  },
}
</script>

<style scoped>

</style>