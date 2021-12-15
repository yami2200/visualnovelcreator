<template>
  <v-dialog
      v-model="dialog"
      persistent
      max-width="550px"
  >
    <v-card>
      <v-card-title>
        <span class="headline"> Set Variable :</span>
      </v-card-title>

      <v-card-text>
        <v-container style="padding-top: 0!important;">
          <v-radio-group
              v-model="choice"
              row
              @change="changeChoice"
              style="margin-top: 0!important; margin-bottom: 20px!important;"
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
            <v-radio
                :disabled="!refEnabledArray"
                label="From Array"
                value="3"
            ></v-radio>
          </v-radio-group>

          <slot v-if="choiceValue"></slot>

          <v-select
              class="mt-5 ml-3"
              v-if="choiceVariable"
              :items="listCompatibleVariables"
              item-text="name"
              item-value="name"
              v-model="select"
              @change="changeSelectingVar"
              return-object
              label="Choose a variable"
              solo
          ></v-select>

          <v-row v-if="choiceArray">
            <v-col>
              <vsm-settervariable :assets="assets" :variable="valueArray.array" :listvar="listvariables" :initialval="false" :show-name="true" :prefer-variable="true"> </vsm-settervariable>
            </v-col>
            <v-col>
              <vsm-settervariable :assets="assets" :variable="valueArray.index" :listvar="listvariables" :initialval="false" :show-name="true"> </vsm-settervariable>
            </v-col>

          </v-row>

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
import BaseVariable from "@/assets/base_variables.json";
import TypeVar from "@/assets/listTypesVariables.json";

export default {
  name: "VSM-VarSetterDefault",

  data: () => ({
    select: null,
    choice: "1",
    value: 0,
    valueArray : null,
  }),

  components:{
    "vsm-help-button" : helpButton,
    "vsm-settervariable" : () => import("../VSM-SetterVariable"),
  },

  props:["dialog", "disableSaveButton", "listCompatibleVariables", "refEnabled", "bus", "onlyVariable", "refEnabledArray", "assets", "listvariables"],

  computed:{
    choiceValue(){
      return this.choice === "1";
    },
    choiceVariable(){
      return this.choice === "2" && this.refEnabled;
    },
    choiceArray(){
      return this.choice === "3" && this.refEnabledArray;
    },
  },

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
      if(data.arrayvalue === undefined || data.arrayvalue === null){
        this.valueArray = {array: null, index: null};

        this.valueArray.array = JSON.parse(JSON.stringify(BaseVariable));
        this.valueArray.array.type = JSON.parse(JSON.stringify(TypeVar.filter((v) => v.name === "Array")[0]));
        this.valueArray.array.value.value = this.valueArray.array.type.defaultValue;
        this.valueArray.array.name = "Array";

        this.valueArray.index = JSON.parse(JSON.stringify(BaseVariable));
        this.valueArray.index.type = JSON.parse(JSON.stringify(TypeVar.filter((v) => v.name === "Integer")[0]));
        this.valueArray.index.value.value = this.valueArray.index.type.defaultValue;
        this.valueArray.index.name = "Element index";
      } else {
        this.valueArray = data.arrayvalue;
      }
    },
    save(){
      this.$emit('save', this.valueArray);
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