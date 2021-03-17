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
  name: "VSM-ConfirmationRequestModal",

  props: {
    bus : {required: true},
    headline : {required: true},
    text : {required: true},
  },

  data () {
    return {
      dialog: false,
    }
  },

  methods: {
    show() {
      this.dialog = true;
    },
    hide() {
      this.dialog = false;
    },
    cancel() {
      this.hide();
      this.$emit("cancel");
    },
    accept() {
      this.hide();
      this.$emit("accept");
    }
  },

  mounted() {
    this.bus.$on('showConfirmationRequestModal', this.show);
    this.bus.$on('hideConfirmationRequestModal', this.hide)
  },

}
</script>

<style scoped>

</style>