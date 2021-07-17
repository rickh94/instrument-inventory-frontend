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
          <span v-if="currentInstrument.size !== 'N/A'">
           {{ currentInstrument.size }}
          </span>
          {{ currentInstrument.type }} {{
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
        <span class="font-bold text-gray-700 mb-2">Notes: </span>{{
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
      <div>
        <span class="font-bold text-gray-700 mb-2">Archived</span> {{ currentInstrument.archived ? "Yes" : "No" }}
      </div>
      <div class="w-full flex justify-start flex-row-reverse mt-4 mb-2" v-if="loading">
        <bar-loader class="w-80 mr-2" color="#805ad5"></bar-loader>
      </div>
      <div class="flex justify-start mt-2 flex-row-reverse" v-else>
        <button class="mx-1 appearance-none bg-yellow-600 text-white px-4 py-1 shadow rounded hover:bg-yellow-800 hover:shadow-lg"
                @click="edit" v-if="isAdmin">Edit
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
        <button v-if="isAdmin" @click="toggleArchived"
                class="mx-1 appearance-none bg-orange-600 text-white px-4 py-1 shadow rounded hover:bg-orange-800 hover:shadow-lg">
          {{ currentInstrument.archived ? "Un-archive" : "Archive" }}
        </button>
      </div>
    </div>
  </v-modal>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import VModal from "@/components/UI/VModal";
import { API } from "aws-amplify";
import checkAdmin from "@/mixins/checkAdmin";
import { BarLoader } from "@saeris/vue-spinners";

export default {
  name: "InstrumentDisplay",
  mixins: [checkAdmin],
  data() {
    return {
      editing: false,
      loading: false
    };
  },
  components: { BarLoader, VInstrumentForm: () => import("@/components/createComponents/VInstrumentForm"), VModal },
  methods: {
    ...mapMutations(["clearCurrentInstrument", "setCurrentInstrument", "updateCurrentInstrument", "clearNewInstrumentNumber"]),
    async toggleArchived() {
      try {
        this.loading = true;
        const response = await API.put("instrument-inventory", `instruments/${this.currentInstrument.id}`, {
          body: {
            ...this.currentInstrument,
            archived: !this.currentInstrument.archived
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
