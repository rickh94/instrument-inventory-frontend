<template>
  <!--  Perhaps refactor to grid for better space usage -->
  <div class="w-full">
    <div class="flex justify-between mb-2">
      <h6 class="text-xl font-bold text-gray-900">
        {{ displayItem.name }}
      </h6>
      <button class="appearance-none text-white bg-red-600 px-1 rounded shadow hover:bg-red-800 hover:shadow-lg text-sm"
              @click="$emit('close')" title="Close Item Display">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    <form v-if="mode === 'move'" @submit.prevent="doMove">
      <v-form-control label="Move From" label-for="from_location">
        <v-autocomplete
          v-model="moveData.fromLocation"
          id="from_location"
          required
          :completion-options="moveFromLocations"
        />
      </v-form-control>
      <v-form-control label="Move To" label-for="to_location">
        <v-autocomplete
          v-model="moveData.toLocation"
          id="to_location"
          required
          :completion-options="acOptions.locations"
        />
      </v-form-control>
      <v-form-control label="Count" label-for="count">
        <input
          type="number"
          name="count"
          id="count"
          class="appearance-none bg-transparent border-none w-full text-gray-800 mr-3 py-1 leading-tight focus:outline-none"
          v-model="moveData.count"
        >
      </v-form-control>
      <v-loading-buttons :loading="loading">
        <v-cancel-button @cancel="mode = 'display'" />
        <v-save-button />
      </v-loading-buttons>
    </form>
    <div v-else>
      <div>
        <span class="font-bold text-gray-700 mb-2">Name: </span>{{ displayItem.name }}
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Count: </span>{{ displayItem.count }}
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Notes: </span>{{ displayItem.notes }}
      </div>
      <div>
        <span class="font-bold text-gray-700">Signed Out Count: </span>{{ displayItem.num_out || 0 }}
      </div>
      <div>
        <span class="font-bold text-gray-700">Signed Out To: </span>{{ displayItem.signed_out_to | joinOrNull }}
      </div>
      <div class="flex flex-col mb-2">
        <table class="w-auto max-w-sm">
          <thead class="font-bold text-lg text-left">
          <tr>
            <th>Location</th>
            <th>Count</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(count, location, index) in displayItem.location_counts" :key="index"
              class="even:bg-purple-200">
            <td>{{ location }}</td>
            <td>{{ count }}</td>
          </tr>
          </tbody>

        </table>
      </div>
      <v-loading-buttons :loading="loading" container-class="grid grid-cols-2 sm:grid-cols-4 gap-y-2">
        <v-retrieve-button @click="retrieve" center />
        <v-assign-button @click="signOut" center />
        <v-edit-button @click="edit" center />
        <v-move-button @click="move" center />
      </v-loading-buttons>
    </div>
  </div>
</template>
<script lang="ts">
/* eslint-disable */
import VEditButton from "@/components/UI/buttons/VEditButton.vue";
import VAssignButton from "@/components/UI/buttons/VAssignButton.vue";
import VRetrieveButton from "@/components/UI/buttons/VRetrieveButton.vue";
import VMoveButton from "@/components/UI/buttons/VMoveButton.vue";
import acOptions from "@/mixins/acOptions";
import VCancelButton from "@/components/UI/buttons/VCancelButton.vue";
import VSaveButton from "@/components/UI/buttons/VSaveButton.vue";
import VLoadingButtons from "@/components/UI/VLoadingButtons.vue";
import { WithLoading } from "@/util/componentTypes";
import Vue from "vue";
import { moveItem } from "@/services/otherItems";
import { GenericOutcome } from "@/util/commonTypes";

interface ComponentState extends WithLoading {
  mode: string,
  moveData: {
    fromLocation: string,
    toLocation: string,
    count: number,
  }
}

export default Vue.extend({
  name: "VItemDisplay",
  components: {
    VSaveButton,
    VCancelButton,
    VLoadingButtons,
    VFormControl: () => import("@/components/UI/VFormControl.vue"),
    VAutocomplete: () => import("@/components/UI/VAutocomplete.vue"),
    VMoveButton,
    VRetrieveButton,
    VAssignButton,
    VEditButton
  },
  mixins: [acOptions],
  props: {
    displayItem: {}
  },
  data(): ComponentState {
    return {
      loading: false,
      mode: "display",
      moveData: {
        fromLocation: "",
        toLocation: "",
        count: 0
      }
    };
  },
  filters: {
    joinOrNull(value) {
      if (value && value.length) {
        return value.join(", ");
      }
      return "";
    }
  },
  methods: {
    edit() {
    },
    signOut() {
    },
    retrieve() {
    },
    async move() {
      this.mode = "move";
      const error = await this.getACOptions();
      if (error) {
        this.$toasted.error(error, { duration: 2000 });
      }
    },
    async doMove() {
      const { fromLocation, toLocation, count } = this.moveData;
      this.loading = true;
      const [outcome, updatedItem, message] = await moveItem(this.displayItem.id, fromLocation, toLocation, count);
      this.loading = false;
      switch (outcome) {
        case GenericOutcome.Ok:
          if (updatedItem) {
            this.$emit("updated", {
              updatedIds: [updatedItem.id],
              updateItems: [updatedItem],
              replaceDisplay: true
            });
            this.mode = "display";
          } else {
            this.$toasted.error("Something went wrong", { duration: 2000 });
          }
          break;
        case GenericOutcome.Err:
          if (message) {
            this.$toasted.error(message, { duration: 2000 });
          } else {
            this.$toasted.error("Something went wrong", { duration: 2000 });
          }
          break;
        default:
          this.$toasted.error("Something went wrong", { duration: 2000 });
      }
    }
  },
  computed: {
    moveFromLocations() {
      let locations = [];
      Object.entries(this.displayItem.location_counts).forEach(([k, v]) => {
        if (v > 0) {
          locations.push(k);
        }
      });
      return locations;
    }
  }
});
</script>
