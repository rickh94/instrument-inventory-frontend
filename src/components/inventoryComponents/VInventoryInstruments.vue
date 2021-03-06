<template>
  <div>
    <div class="flex justify-between mt-2">
      <h4 class="text-xl font-bold">All Instruments</h4>
      <button class="bg-purple-600 py-2 px-4 shadow hover:bg-purple-800 hover:shadow-lg rounded text-white"
              @click="getCsv">Download
        CSV
      </button>
    </div>
    <div class="flex flex-col lg:flex-row">
      <input type="text"
             name="filter-size"
             placeholder="Filter size"
             id="filter-size"
             class="mx-2 py-1 placeholder-gray-700 focus:outline-none appearance-none border-b border-gray-700"
             v-model="size">
      <input type="text"
             name="filter-type"
             placeholder="Filter instrument type"
             id="filter-type"
             class="mx-2 py-1 appearance-none focus:outline-none border-b border-gray-700 placeholder-gray-700"
             v-model="type">
      <div class="flex justify-start mt-2 flex-wrap">
        <div class="text-gray-600 mr-2 flex items-center lg:hidden">Sort By:</div>
        <v-select class="mt-2 lg:hidden mr-2" placeholder="Sort By"
                  :options="sortColumns"
                  v-model="sortBy"></v-select>
        <div class="text-gray-600 flex items-center mr-2 lg:hidden">Sort Direction:</div>
        <v-select class="mt-2 lg:hidden mr-2"
                  placeholder="Sort Direction"
                  :options="[{value: 1, text: 'Ascending'}, {value: -1, text: 'Descending'}]"
                  v-model="sortDirection"></v-select>
        <button class="mt-2 lg:mt-0 px-2 py-1 ml-2 bg-purple-600 text-white rounded shadow hover:bg-purple-800 hover:shadow-lg"
                @click.prevent="showArchived = !showArchived">
          {{ showArchived ? "Hide Archived" : "Show Archived" }}
        </button>
        <button class="mt-2 lg:mt-0 px-2 py-1 ml-2 bg-purple-600 text-white rounded shadow hover:bg-purple-800 hover:shadow-lg"
                @click.prevent="onlyUnassigned = !onlyUnassigned">
          {{ onlyUnassigned ? "Show All" : "Show Unassigned Only" }}
        </button>
      </div>
    </div>
    <v-spinner v-if="loading" line-fg-color="#805ad5"></v-spinner>
    <div class="flex flex-col items-center justify-center mt-2 mb-1 lg:hidden">
      <div v-for="instrument in displayInstruments"
           class="flex flex-col m-2 border border-purple-300 p-2 w-full"
           :key="instrument.id"
      >
        <a @click.prevent="setCurrentInstrument(instrument)" class="cursor-pointer text-purple-800 font-bold">
          {{ instrument.size }} {{ instrument.type }} {{ instrument.number }}
        </a>
        <div v-if="instrument.assignedTo" class="text-gray-700">
          Assigned to {{ instrument.assignedTo }} at {{ instrument.location }}
        </div>
        <div class="text-gray-700" v-else>Unassigned at {{ instrument.location }}</div>
        <div class="text-gray-700">Condition: {{ instrument.condition }}, Quality: {{ instrument.quality }}</div>
        <div class="text-gray-500" v-if="instrument.history">{{ instrument.history.join(", ") }}</div>
        <div class="text-gray-500" v-else>No History</div>
      </div>
    </div>
    <table class="table-auto w-full hidden lg:table">
      <thead>
      <tr>
        <v-table-header sort-name="size" :sort-by="sortBy" :sort-direction="sortDirection" @changeSort="changeSort">
          Size
        </v-table-header>
        <v-table-header sort-name="type" :sort-by="sortBy" :sort-direction="sortDirection" @changeSort="changeSort">
          Type
        </v-table-header>
        <v-table-header sort-name="number" :sort-by="sortBy" :sort-direction="sortDirection" @changeSort="changeSort">
          Number
        </v-table-header>
        <v-table-header sort-name="location" :sort-by="sortBy" :sort-direction="sortDirection" @changeSort="changeSort">
          Location
        </v-table-header>
        <v-table-header sort-name="assignedTo"
                        :sort-by="sortBy"
                        :sort-direction="sortDirection"
                        @changeSort="changeSort">
          Assigned To
        </v-table-header>
        <v-table-header sort-name="condition"
                        :sort-by="sortBy"
                        :sort-direction="sortDirection"
                        @changeSort="changeSort">
          Condition
        </v-table-header>
        <v-table-header sort-name="quality" :sort-by="sortBy" :sort-direction="sortDirection" @changeSort="changeSort">
          Quality
        </v-table-header>
        <v-table-header sort-name="history" :sort-by="sortBy" :sort-direction="sortDirection" @changeSort="changeSort">
          History
        </v-table-header>
      </tr>
      </thead>
      <tbody>
      <tr v-for="instrument in displayInstruments" :key="instrument.id">
        <td class="border-b px-4 py-2">{{ instrument.size }}</td>
        <td class="border-b px-4 py-2">{{ instrument.type }}</td>
        <td class="border-b px-4 py-2">
          <a @click.prevent="setCurrentInstrument(instrument)"
             class="cursor-pointer text-purple-600 hover:text-purple-800 hover:underline">
            {{ instrument.number }}
          </a>
        </td>
        <td class="border-b px-4 py-2">{{ instrument.location }}</td>
        <td class="border-b px-4 py-2">{{ instrument.assignedTo }}</td>
        <td class="border-b px-4 py-2">{{ instrument.condition }}</td>
        <td class="border-b px-4 py-2">{{ instrument.quality }}</td>
        <td class="border-b px-4 py-2">{{ instrument.history | abbreviateHistory }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { API } from "aws-amplify";
import VTableHeader from "@/components/UI/VTableHeader";
import VSelect from "@/components/UI/VSelect";
import Papa from "papaparse";
import { sortBySize } from "@/mixins/ordering";

export default {
  name: "VInventoryInstruments",
  components: { VSelect, VTableHeader },
  data() {
    return {
      size: "",
      type: "",
      onlyUnassigned: false,
      showArchived: false,
      loading: false,
      sortBy: "number",
      sortDirection: 1,
      sizes: [],
      types: [],
      sortColumns: [
        { value: "size", text: "Size" },
        { value: "type", text: "Type" },
        { value: "number", text: "Number" },
        { value: "location", text: "Location" },
        { value: "assignedTo", text: "Assigned To" },
        { value: "condition", text: "Condition" },
        { value: "quality", text: "Quality" },
        { value: "history", text: "History" }
      ]
    };
  },
  async created() {
    try {
      this.loading = true;
      const res = await API.get("instrument-inventory", "instruments/all", {});
      this.loading = false;
      this.setAllInstruments(res.instruments);
      if (res.instrumentsFailed.length > 0) {
        this.$toasted.error("Some instruments failed to load", { duration: 2000 });
        console.log(res.instrumentsFailed);
      }
    } catch (err) {
      this.loading = false;
      if (err.response.data) {
        this.$toasted.error(err.response.data, { duration: 3000 });
      } else {
        this.$toasted.error(err.toString());
      }
      console.error(err);
    }
    try {
      const { sizes, types } = await API.get("instrument-inventory", "schema/ac-options", {});
      this.sizes = sizes
      this.types = types
    } catch (err) {
      this.$toasted.error("Failed to load types and sizes");
    }
  },
  methods: {
    ...mapMutations(["setAllInstruments", "setCurrentInstrument"]),
    getCsv() {
      const csvData = Papa.unparse(this.displayInstruments, {
        skipEmptyLines: true,
        header: true
      });
      const csvDownload = document.createElement("a");
      csvDownload.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvData));
      csvDownload.setAttribute("download", "instruments-" + (new Date().toLocaleString()) + ".csv");

      csvDownload.click();
    },
    changeSort(newSortAttribute) {
      if (this.sortBy === newSortAttribute) {
        this.sortDirection *= -1;
      } else {
        this.sortBy = newSortAttribute;
        this.sortDirection = 1;
      }
    },
    displayInstrument(instrument) {
      if (this.onlyUnassigned && instrument.assignedTo) {
        return false;
      }
      if (this.size && !instrument.size.startsWith(this.size)) {
        return false;
      }
      if (this.type && !instrument.type.toLowerCase().includes(this.type.toLowerCase())) {
        return false;
      }
      return this.showArchived || !instrument.archived;
    },
    sortInstruments(a, b) {
      if (this.sortBy === "size") {
        return this.sortDirection * -sortBySize(a, b);
      }
      const aSort = a[this.sortBy] || "";
      const bSort = b[this.sortBy] || "";
      if (aSort < bSort) {
        return -this.sortDirection;
      } else if (aSort > bSort) {
        return this.sortDirection;
      }
      return 0;
    }
  },
  computed: {
    ...mapState(["allInstruments"]),
    displayInstruments() {
      let tmpInstruments = this.allInstruments.filter(ins => this.displayInstrument(ins));
      return tmpInstruments.sort(this.sortInstruments);
    }
  },
  filters: {
    abbreviateHistory(history) {
      if (!history || history.length < 1) {
        return "";
      } else if (history.length > 3) {
        return history.slice(0, 3).join(", ") + "...";
      } else {
        return history.join(", ");
      }
    }
  }
};
</script>

<style scoped>

</style>
