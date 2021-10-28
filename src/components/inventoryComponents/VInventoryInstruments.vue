<template>
  <div>
    <div class="flex justify-between mt-2">
      <h4 class="text-xl font-bold">All Instruments</h4>
      <button type="button"
              class="inline-flex items-center font-bold bg-purple-600 py-2 px-3 shadow hover:bg-purple-800 hover:shadow-lg rounded text-white"
              @click.prevent="getCsv">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
                d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
                clip-rule="evenodd" />
        </svg>
        Download CSV
      </button>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mt-2">
      <input type="text"
             name="filter-size"
             placeholder="Filter size"
             id="filter-size"
             class="mx-2 py-1 placeholder-gray-400 focus:outline-none appearance-none border-b border-gray-700 focus:border-purple-600"
             v-model="size">
      <input type="text"
             name="filter-type"
             placeholder="Filter instrument type"
             id="filter-type"
             class="mx-2 py-1 appearance-none focus:outline-none border-b border-gray-700 placeholder-gray-400 focus:border-purple-600"
             v-model="type">
      <input type="text"
             name="filter-location"
             placeholder="Filter instrument location"
             id="filter-location"
             class="col-span-2 mx-2 py-1 appearance-none focus:outline-none border-b border-gray-700 placeholder-gray-400 focus:border-purple-600"
             v-model="location">
      <div class="flex items-center justify-center lg:hidden mt-1">
        <div class="h-full flex items-center text-gray-600 font-bold mr-2 lg:hidden flex-shrink-0">Sort By:</div>
        <v-select id="sort-by" class="lg:hidden flex-shrink-0" placeholder="Sort By"
                  :select-options="sortColumns"
                  v-model="sortBy"></v-select>
      </div>
      <div class="flex items-center justify-center lg:hidden">
        <button class="font-bold mt-2 inline-flex items-center lg:mt-0 px-2 py-1 ml-2 text-white rounded shadow hover:shadow-lg bg-purple-600 hover:bg-purple-800"
                @click.prevent="sortDirection = -sortDirection"
                title="Click to change direction"
        >
          <svg xmlns="http://www.w3.org/2000/svg"
               class="h-5 w-5 mr-1"
               viewBox="0 0 20 20"
               fill="currentColor"
               v-if="sortDirection === -1">
            <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg"
               class="h-5 w-5 mr-1"
               viewBox="0 0 20 20"
               fill="currentColor"
               v-if="sortDirection === 1">
            <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
          </svg>
          {{ sortDirection === -1 ? "Ascending" : "Descending" }}
        </button>
      </div>
      <div class="flex justify-center h-auto">
        <button class="inline-flex items-center font-bold mt-2 lg:mt-0 px-2 py-1 ml-2 text-white rounded shadow hover:shadow-lg"
                :class="{'bg-purple-600 hover:bg-purple-800': !showArchived, 'bg-red-600 hover:bg-red-800': showArchived}"
                @click.prevent="showArchived = !showArchived">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
            <path fill-rule="evenodd"
                  d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                  clip-rule="evenodd" />
          </svg>
          {{ showArchived ? "Hide Archived" : "Show Archived" }}
        </button>
      </div>
      <div class="flex justify-center">
        <button class="inline-flex items-center font-bold mt-2 lg:mt-0 px-2 py-1 ml-2 text-white rounded shadow hover:shadow-lg"
                :class="{'bg-purple-600 hover:bg-purple-800': onlyUnassigned, 'bg-red-600 hover:bg-red-800': !onlyUnassigned}"
                @click.prevent="onlyUnassigned = !onlyUnassigned">
          <svg xmlns="http://www.w3.org/2000/svg"
               class="h-5 w-5 mr-1"
               viewBox="0 0 20 20"
               fill="currentColor"
               v-if="onlyUnassigned">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fill-rule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clip-rule="evenodd" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" v-else>
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
          {{ onlyUnassigned ? "Show All" : "Unassigned Only" }}
        </button>
      </div>
    </div>
    <div class="flex h-20 w-full items-center justify-center" v-if="loading">
      <propagate-loader color="#7c3aed"></propagate-loader>
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
          <v-table-header sort-name="location"
                          :sort-by="sortBy"
                          :sort-direction="sortDirection"
                          @changeSort="changeSort">
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
          <v-table-header sort-name="quality"
                          :sort-by="sortBy"
                          :sort-direction="sortDirection"
                          @changeSort="changeSort">
            Quality
          </v-table-header>
          <v-table-header sort-name="history"
                          :sort-by="sortBy"
                          :sort-direction="sortDirection"
                          @changeSort="changeSort">
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

<script lang="ts">
import { mapMutations, mapState } from "vuex";
import VTableHeader from "@/components/UI/VTableHeader.vue";
import VSelect from "@/components/UI/VSelect.vue";
import Papa from "papaparse";
import { sortBySize } from "@/mixins/ordering";
import VInstrumentCard from "@/components/VInstrumentCard.vue";
import { PropagateLoader } from "@saeris/vue-spinners";
import acOptions from "@/mixins/acOptions";
import { GenericOutcome, Instrument } from "@/util/commonTypes";
import { getAllInstruments } from "@/services/getInstruments";
import Component, { mixins } from "vue-class-component";

@Component({
  components: { VInstrumentCard, VSelect, VTableHeader, PropagateLoader },
  methods: mapMutations(["setAllInstruments", "setCurrentInstrument"]),
  computed: mapState(["allInstruments"]),
  filters: {
    abbreviateHistory(history?: string[]): string {
      if (!history || history.length < 1) {
        return "";
      } else if (history.length > 3) {
        return history.slice(0, 3).join(", ") + "...";
      } else {
        return history.join(", ");
      }
    }
  }
})
export default class VInventoryInstruments extends mixins(acOptions) {
  size = "";
  type = "";
  location = "";
  onlyUnassigned = false;
  showArchived = false;
  loading = false;
  sortBy = "number";
  sortDirection = 1;
  sortColumns = [
    { value: "size", text: "Size" },
    { value: "type", text: "Type" },
    { value: "number", text: "Number" },
    { value: "location", text: "Location" },
    { value: "assignedTo", text: "Assigned To" },
    { value: "condition", text: "Condition" },
    { value: "quality", text: "Quality" },
    { value: "history", text: "History" }
  ];

  allInstruments!: Instrument[];
  setAllInstruments!: (any) => void;
  setCurrentInstrument!: (Instrument) => void;

  async created(): Promise<void> {
    // Load instruments
    this.loading = true;
    const [outcome, instruments, message] = await getAllInstruments();
    this.loading = false;

    switch (outcome) {
      case GenericOutcome.Ok:
        this.setAllInstruments(instruments);
        if (message.length > 0) {
          this.$toasted.error(message, { duration: 1000 });
        }
        break;
      case GenericOutcome.Err:
        this.$toasted.error(message, { duration: 4000 });
        break;
      default:
        this.$toasted.error("Something went wrong", { duration: 1000 });
    }

    // Load autocomplete
    const error = await this.getACOptions();
    if (error) {
      this.$toasted.error(error, { duration: 2000 });
    }
  }

  getCsv(): void {
    const csvData = Papa.unparse(this.displayInstruments, {
      skipEmptyLines: true,
      header: true
    });
    const csvDownload = document.createElement("a");
    csvDownload.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csvData));
    csvDownload.setAttribute("download", "instruments-" + (new Date().toLocaleString()) + ".csv");

    csvDownload.click();
  }

  changeSort(newSortAttribute: string): void {
    if (this.sortBy === newSortAttribute) {
      this.sortDirection *= -1;
    } else {
      this.sortBy = newSortAttribute;
      this.sortDirection = 1;
    }
  }

  displayInstrument(instrument: Instrument): boolean {
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
  }

  sortInstruments(a: Instrument, b: Instrument): number {
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

  get displayInstruments(): Instrument[] {
    let tmpInstruments = this.allInstruments.filter(ins => this.displayInstrument(ins));
    return tmpInstruments.sort(this.sortInstruments);
  }
}

</script>

<style scoped>

</style>
