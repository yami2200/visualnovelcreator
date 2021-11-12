<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="500px"
  >
    <v-card>
      <v-card-title>
        <span class="headline"> Set Variable :</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-radio-group
              v-model="choice"
              row
              @change="changeChoice"
          >
            <v-radio
                :disabled="onlyVariable!== undefined && onlyVariable"
                label="Specific Value"
                value="1"
            ></v-radio>
            <v-radio
                :disabled="!refEnabled"
                label="From Variable"
                value="2"
            ></v-radio>
          </v-radio-group>

          <slot v-if="!disabledInputSpecific"></slot>

          <v-select
              class="mt-5 ml-3"
              v-if="disabledInputSpecific"
              :disabled="!disabledInputSpecific"
              :items="listCompatibleVariables"
              item-text="name"
              item-value="name"
              v-model="select"
              @change="changeSelectingVar"
              return-object
              label="Choose a variable"
              solo
          ></v-select>

        </v-container>
      </v-card-text>

      <v-card-actions>
        <vsm-help-button link="https://github.com/yami2200/visualnovelcreator/blob/master/DOC/doc_Variables.md"></vsm-help-button>
        <v-spacer></v-spacer>
        <v-btn
            color="blue darken-1"
            text
            @click="cancel"
        >
          Cancel
        </v-btn>
        <v-btn
            color="blue darken-1"
            text
            :disabled="disableSaveButton"
            @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import helpButton from "@/components/VSM-HelpButton";

export default {
  name: "VSM-VarSetterDefault",

  data: () => ({
    select: null,
    choice: "1",
    value: 0,
  }),

  components:{
    "vsm-help-button" : helpButton,
  },

  props:["dialog", "disableSaveButton", "disabledInputSpecific", "listCompatibleVariables", "refEnabled", "bus", "onlyVariable"],

  methods:{
    changeSelectingVar(){
      this.$emit("changeVarSelecting", this.select);
    },
    changeChoice(){
      this.$emit('changeChoice', this.choice);
    },
    init(data){
      this.choice = data.choice;
      this.select = data.select;
    },
    save(){
      this.$emit('save');
    },
    cancel(){
      this.$emit('cancel');
    },
  },

  mounted() {
    this.bus.$on('setVarSetterInitial', this.init);
  },
}
</script>

<style scoped>

</style>