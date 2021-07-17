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
      <input type="text"
             name="filter-location"
             placeholder="Filter instrument location"
             id="filter-location"
             class="mx-2 py-1 appearance-none focus:outline-none border-b border-gray-700 placeholder-gray-700"
             v-model="location">
      <div class="flex-col justify-start mt-2 flex-wrap">
        <div class="flex mx-auto flex-wrap items-start justify-start">
          <div class="flex items-center">
            <div class="text-gray-600 mr-2 flex items-center lg:hidden flex-shrink-0">Sort By:</div>
            <v-select id="sort-by" class="mt-2 lg:hidden mr-2 flex-shrink-0" placeholder="Sort By"
                      :options="sortColumns"
                      v-model="sortBy"></v-select>
          </div>
          <div class="flex items-center">
            <div class="text-gray-600 mr-2 flex items-center lg:hidden flex-shrink-0">Sort Direction:</div>
            <v-select class="mt-2 lg:hidden mr-2 flex-shrink-0"
                      placeholder="Sort Direction"
                      :options="[{value: 1, text: 'Ascending'}, {value: -1, text: 'Descending'}]"
                      v-model="sortDirection"></v-select>
          </div>
        </div>
        <div class="flex justify-start">
          <button class="mt-2 lg:mt-0 px-2 py-1 ml-2 text-white rounded shadow hover:shadow-lg"
                  :class="{'bg-purple-600 hover:bg-purple-800': !showArchived, 'bg-red-600 hover:bg-red-800': showArchived}"
                  @click.prevent="showArchived = !showArchived">
            {{ showArchived ? "Hide Archived" : "Show Archived" }}
          </button>
          <button class="mt-2 lg:mt-0 px-2 py-1 ml-2 text-white rounded shadow hover:shadow-lg"
                  :class="{'bg-purple-600 hover:bg-purple-800': onlyUnassigned, 'bg-red-600 hover:bg-red-800': !onlyUnassigned}"
                  @click.prevent="onlyUnassigned = !onlyUnassigned">
            {{ onlyUnassigned ? "Show All" : "Show Unassigned Only" }}
          </button>
        </div>
      </div>
    </div>
    <div class="flex h-20 w-full items-center justify-center" v-if="loading">
      <propagate-loader color="#805ad5"></propagate-loader>
    </div>
    <div v-else>

    <div class="flex flex-col items-center justify-center mt-2 mb-1 lg:hidden">
      <v-instrument-card v-for="instrument in displayInstruments"
                         :key="instrument.id"
                         :instrument="instrument"></v-instrument-card>
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
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { API } from "aws-amplify";
import VTableHeader from "@/components/UI/VTableHeader";
import VSelect from "@/components/UI/VSelect";
import Papa from "papaparse";
import { sortBySize } from "@/mixins/ordering";
import VInstrumentCard from "@/components/VInstrumentCard";
import { PropagateLoader } from "@saeris/vue-spinners";

export default {
  name: "VInventoryInstruments",
  components: { VInstrumentCard, VSelect, VTableHeader, PropagateLoader },
  data() {
    return {
      size: "",
      type: "",
      location: "",
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
      this.sizes = sizes;
      this.types = types;
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
      if (this.location && !instrument.location.toLowerCase().includes(this.location.toLowerCase())) {
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
