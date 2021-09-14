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
        <button class="appearance-none text-white bg-red-600 px-1 rounded shadow hover:bg-red-800 hover:shadow-lg text-sm"
                @click="clearCurrentInstrument" title="Close Instrument Display">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
          </svg>
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
      <v-loading-buttons loader-class="w-80 mr-2" :loading="loading" container-class="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-y-2">
        <v-edit-button v-if="isAdmin" @click="edit" center />
        <router-link
          v-if="$route.path !== '/sign-out'"
          to="/sign-out"
          class="inline-flex items-center justify-center font-bold mx-1 appearance-none bg-blue-600 text-white px-3 py-1 shadow rounded hover:bg-blue-800 hover:shadow-lg">
          <span class="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"> <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fill-rule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clip-rule="evenodd" />
            </svg>
            Assign
          </span>
        </router-link>
        <v-retrieve-button @click="retrieve" center />
        <button v-if="isAdmin" @click="toggleArchived"
                class="inline-flex items-center justify-center font-bold mx-1 appearance-none bg-pink-600 text-white px-4 py-1 shadow rounded hover:bg-pink-800 hover:shadow-lg">
          <span class="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg"
                 class="h-6 w-6 mr-1"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor"
                 v-if="currentInstrument.archived">
              <path stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor" v-else>
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
              <path fill-rule="evenodd"
                    d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                    clip-rule="evenodd" />
            </svg>
            {{ currentInstrument.archived ? "Un-archive" : "Archive" }}
          </span>
        </button>
      </v-loading-buttons>
<!--      <div class="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-y-2" v-else>-->
<!--      </div>-->
    </div>
  </v-modal>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import VModal from "@/components/UI/VModal";
import { API } from "aws-amplify";
import checkAdmin from "@/mixins/checkAdmin";
import VRetrieveButton from "@/components/UI/buttons/VRetrieveButton";
import VEditButton from "@/components/UI/buttons/VEditButton";
import VLoadingButtons from "@/components/UI/VLoadingButtons";

export default {
  name: "InstrumentDisplay",
  mixins: [checkAdmin],
  data() {
    return {
      editing: false,
      loading: false,
    };
  },
  components: {
    VLoadingButtons,
    VEditButton,
    VRetrieveButton,
    VInstrumentForm: () => import("@/components/createComponents/VInstrumentForm"),
    VModal,
  },
  methods: {
    ...mapMutations(["clearCurrentInstrument", "setCurrentInstrument", "updateCurrentInstrument", "clearNewInstrumentNumber"]),
    async toggleArchived() {
      const wasArchived = this.currentInstrument.archived;
      try {
        this.loading = true;
        const response = await API.put("instrument-inventory", `instruments/${this.currentInstrument.id}`, {
          body: {
            ...this.currentInstrument,
            archived: !this.currentInstrument.archived,
          },
        });
        this.loading = false;
        if (wasArchived) {
          this.$toasted.info(`Instrument ${response.item.number} un-archived`, { duration: 2000 });
        } else {
          this.$toasted.info(`Instrument ${response.item.number} archived`, { duration: 2000 });
        }
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
    },
  },
  computed: mapState(["currentInstrument"]),
};
</script>
