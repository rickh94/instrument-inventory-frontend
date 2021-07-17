<template>
  <form @submit.prevent="handleSubmit">
    <div class="flex flex-wrap items-start sm:flex-row justify-around overflow-auto">
      <v-strings-input-table
        instrument="Violin"
        :strings="violinStrings"
        :items="items"
        @change="handleChange"></v-strings-input-table>
      <v-strings-input-table
        instrument="Viola"
        :strings="violaStrings"
        :items="items"
        @change="handleChange"></v-strings-input-table>
      <v-strings-input-table
        instrument="Cello"
        :strings="celloStrings"
        :items="items"
        @change="handleChange"></v-strings-input-table>
      <v-strings-input-table
        instrument="Bass"
        :strings="bassStrings"
        :items="items"
        @change="handleChange"></v-strings-input-table>
    </div>
    <div class="flex justify-end mt-4 mb-2" v-if="loading">
      <bar-loader class="w-40 mr-2" color="#805ad5"></bar-loader>
    </div>
    <div v-else class="flex justify-end mt-4">
      <button @click.prevent="$emit('close')"
              class="bg-red-600 px-4 mx-2 py-2 text-white shadow rounded hover:bg-red-800 hover:shadow-lg">Close
      </button>
      <button type="submit"
              class="bg-purple-600 px-4 py-2 text-white shadow rounded hover:bg-purple-800 hover:shadow-lg">Submit
      </button>
    </div>
  </form>
</template>

<script>
import { API } from "aws-amplify";
import computedStrings from "@/mixins/computedStrings";
import VStringsInputTable from "@/components/inventoryComponents/strings/layout/VStringsInputTable";
import { BarLoader } from "@saeris/vue-spinners";

export default {
  name: "VUpdateStringsForm",
  components: { VStringsInputTable, BarLoader },
  mixins: [computedStrings],
  props: {
    strings: {
      type: Array,
      required: true
    },
    updateText: {
      type: String,
      required: true
    },
    submitPath: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      items: {},
      loading: false
    };
  },
  created() {
    this.initializeItems();
  },
  methods: {
    async handleSubmit() {
      const updated = [];
      for (const [id, amount] of Object.entries(this.items)) {
        if (amount !== 0) {
          updated.push({
            id, amount
          });
        }
      }
      try {
        this.loading = true;
        const response = await API.post("instrument-inventory", this.submitPath, {
          body: {
            string_updates: updated
          }
        });
        this.$emit("updated", { updatedIds: response.updated, updatedItems: response.updatedItems });
        this.loading = false;
        if (response.failed.length > 0) {
          this.$toasted.error(`Updates failed: ${response.failed.join(", ")}`, { duration: 2000 });
        }
        this.$emit("close");
      } catch (e) {
        this.loading = false;
        if (e.response.data) {
          this.$toasted.error(e.response.data, { duration: 2000 });
        } else {
          this.$toasted.error(e.toString(), { duration: 2000 });
        }
      }
    },
    initializeItems() {
      for (const string of this.strings) {
        this.items[string.id] = 0;
      }
    },
    handleChange({ id, value }) {
      this.items[id] = value;
    }
  }
};
</script>

<style scoped>

</style>
