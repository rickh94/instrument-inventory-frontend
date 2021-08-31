<template>
  <div class="m-5 shadow p-3">
    <h6 class="text-xl font-bold mb-1">Assign Multiple from CSV</h6>
    <form class="flex-col flex" @submit.prevent="onSubmitMultiple">
      <v-form-control label="Upload CSV of 'assignedTo, location, number'" label-for="sign-out-csv">
        <input @change="onChangeFile" type="file" name="sign-out-csv" id="sign-out-csv" accept="text/csv" class="my-2">
      </v-form-control>
      <div class="flex justify-end mt-4 mb-2" v-if="loading">
        <bar-loader class="w-32 mr-2" color="#7c3aed"></bar-loader>
      </div>
      <div v-else class="flex justify-end w-full mt-3">
        <button type="submit"
                class="bg-purple-600 px-4 text-white py-2 shadow hover:bg-purple-800 hover:shadow-lg rounded inline-flex items-center font-bold">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
          </svg>
          Assign Multiple
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import VFormControl from "@/components/UI/VFormControl";
import { mapMutations } from "vuex";
import Papa from "papaparse";
import { API } from "aws-amplify";
import { BarLoader } from "@saeris/vue-spinners";

export default {
  name: "VSignOutMultiple",
  components: { VFormControl, BarLoader },
  data() {
    return {
      multipleData: [],
      loading: false
    };
  },
  methods: {
    ...mapMutations(["clearSearchResults"]),
    onChangeFile(e) {
      Papa.parse(e.target.files[0], {
        complete: (results) => {
          if (results.data[0].number === undefined || results.data[0].location === undefined) {
            this.$toasted.error("Error: Invalid CSV file", { duration: 2000 });
            return;
          }
          this.multipleData = results.data.filter(item => item.number && item.number.length > 3 && item.location && item.location.length > 0);
        },
        header: true,
        skipEmptyLines: true
      });
    },
    async onSubmitMultiple() {
      try {
        this.loading = true;
        const response = await API.post("instrument-inventory", "sign-out/multiple", {
          body: {
            instruments: this.multipleData
          }
        });
        this.loading = false;
        this.$toasted.info(`Signed out ${response.updated.join(", ")}`, { duration: 5000 });
        this.clearSearchResults();
      } catch (e) {
        this.loading = false;
        this.$toasted.error(`Error: ${e.response.data}`);
      }
    }
  }
};
</script>
