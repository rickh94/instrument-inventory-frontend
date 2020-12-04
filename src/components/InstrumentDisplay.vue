<template>
  <v-modal v-if="currentInstrument"
           @close="editing = false; clearCurrentInstrument()"
           :width-class="editing ? 'sm:max-w-xl' : 'sm:max-w-lg'">
    <div class="rounded w-full sm:max-w-2xl" v-if="editing">
      <v-instrument-form
        @editSuccess="editing = false"
        @cancel="editing = false"
        class="max-h-screen overflow-auto overflow-x-hidden rounded"></v-instrument-form>
    </div>
    <div v-else class="w-full">
      <div class="flex justify-between mb-4">
        <h6 class="text-xl font-bold text-gray-900">
          {{ currentInstrument.size }} {{ currentInstrument.type }} {{
            currentInstrument.number }}
        </h6>
        <button class="appearance-none text-white bg-red-600 px-2 rounded shadow hover:bg-red-800 hover:shadow-lg text-sm"
                @click="clearCurrentInstrument">Close
        </button>
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Size: </span>{{ currentInstrument.size }}
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Location: </span>{{ currentInstrument.location }}
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Assigned To: </span>{{ currentInstrument.assignedTo }}
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Maintenance Notes: </span>{{
          currentInstrument.maintenanceNotes }}
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Condition Notes: </span>{{
          currentInstrument.conditionNotes }}
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Condition: </span>{{ currentInstrument.condition }}
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Quality: </span>{{ currentInstrument.quality }}
      </div>
      <div>
        <span class="font-bold text-gray-700 mb-2">Gifted To Student: </span>{{ currentInstrument.gifted ?
        "Yes" : "No" }}
      </div>
      <div v-if="currentInstrument.history">
        <span class="font-bold text-gray-700 mb-2">History: </span>{{ currentInstrument.history.join(", ")
        }}
      </div>
      <div class="font-bold text-gray-700" v-else>
        No Instrument History
      </div>
      <v-spinner v-if="loading" line-fg-color="#805ad5"></v-spinner>
      <div class="flex justify-start mt-2 flex-row-reverse" v-else>
        <button class="mx-1 appearance-none bg-yellow-600 text-white px-4 py-1 shadow rounded hover:bg-yellow-800 hover:shadow-lg"
                @click="edit">Edit
        </button>
        <router-link
          v-if="$route.path !== '/sign-out'"
          to="/sign-out"
          class="mx-1 appearance-none bg-blue-600 text-white px-4 py-1 shadow rounded hover:bg-blue-800 hover:shadow-lg">
          Sign Out
        </router-link>
        <button @click="retrieve"
                class="mx-1 appearance-none bg-green-600 text-white px-4 py-1 shadow rounded hover:bg-green-800 hover:shadow-lg">
          Retrieve
        </button>
        <button @click="archive"
                class="mx-1 appearance-none bg-orange-600 text-white px-4 py-1 shadow rounded hover:bg-orange-800 hover:shadow-lg">
          Archive
        </button>
      </div>
    </div>
  </v-modal>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import VModal from "@/components/UI/VModal";
import VInstrumentForm from "@/components/createComponents/VInstrumentForm";
import { API } from "aws-amplify";

export default {
  name: "InstrumentDisplay",
  data() {
    return {
      editing: false,
      loading: false
    };
  },
  components: { VInstrumentForm, VModal },
  methods: {
    ...mapMutations(["clearCurrentInstrument", "setCurrentInstrument", "updateCurrentInstrument", "clearNewInstrumentNumber"]),
    async archive() {
      try {
        this.loading = true;
        const response = await API.put("instrument-inventory", `instruments/${this.currentInstrument.id}`, {
          body: {
            ...this.currentInstrument,
            archived: true
          }
        });
        this.loading = false;
        this.$toasted.info(`Instrument ${response.item.number} archived`, { duration: 2000 });
        this.updateCurrentInstrument(response.item);
      } catch (e) {
        this.loading = false;
        this.$toasted.error(`Error: ${e.response.data}`, { duration: 2000 });
      }
    },
    async retrieve() {
      this.loading = true;
      try {
        const response = await API.post("instrument-inventory", "retrieve-single",
          { body: { number: this.currentInstrument.number } });
        console.log(response);
        this.updateCurrentInstrument(response.item);
        this.$toasted.info(response.message, { duration: 2000 });
        this.loading = false;
      } catch (e) {
        this.$toasted.error(e.response.data, { duration: 2000 });
        console.log(e);
        this.loading = false;
      }

    },
    async handleEditSuccess() {
      this.editing = false;
      this.$emit("instrumentUpdated", this.currentInstrument.id);
    },
    edit() {
      this.clearNewInstrumentNumber();
      this.editing = true;
    }
  },
  computed: mapState(["currentInstrument"])
};
</script>
