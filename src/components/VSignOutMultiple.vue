<template>
  <div class="m-5 shadow p-3">
    <h6 class="text-xl font-bold mb-1">Assign Multiple from CSV</h6>
    <form class="flex-col flex" @submit.prevent="onSubmitMultiple">
      <v-form-control label="Upload CSV of 'assignedTo, location, number'" label-for="sign-out-csv">
        <input @change="onChangeFile" type="file" name="sign-out-csv" id="sign-out-csv" accept="text/csv" class="my-2">
      </v-form-control>
      <div class="flex justify-end mt-4 mb-2" v-if="loading">
        <bar-loader class="w-32 mr-2" color="#805ad5"></bar-loader>
      </div>
      <div v-else class="flex justify-end w-full mt-3">
        <button type="submit"
                class="bg-purple-600 px-4 text-white py-2 shadow hover:bg-purple-800 hover:shadow-lg rounded">
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
