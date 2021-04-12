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
          >
            <v-radio
                label="Specific Value"
                value="1"
            ></v-radio>
            <v-radio
                :disabled="!refEnabled"
                label="From Variable"
                value="2"
            ></v-radio>
          </v-radio-group>

          <v-text-field
              v-model.number="value"
              :disabled="disabledInputSpecific"
              label="Number"
              append-outer-icon="mdi-plus-circle"
              @click:append-outer="increment"
              prepend-icon="mdi-minus-circle"
              type="number"
              @click:prepend="decrement">
          </v-text-field>

          <v-select
              class="mt-5 ml-3"
              :disabled="!disabledInputSpecific"
              :items="listCompatibleVariables"
              item-text="name"
              item-value="name"
              v-model="select"
              return-object
              label="Choose a variable"
              solo
          ></v-select>

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
import {mix_settervariable} from "@/mixins/MIX_SetterVariable";

export default {
  name: "VSM-VarSetterInteger",

  mixins: [mix_settervariable],

  data: () => ({
    type: "Integer",
    value: 0,
  }),

  methods: {
    increment() {
      this.value++;
    },
    decrement() {
      this.value--;
    },
    resetDefault(){
      this.value = 0;
      this.select = null;
    }
  }

}
</script>

<style scoped>

</style>