<template>
  <form @submit.prevent="handleSubmit">
    <div class="flex flex-wrap items-start sm:flex-row justify-around">
      <table class="table table-auto mx-4">
        <thead>
        <tr class="border-b border-black text-xl">
          <th class="pr-4">Violin</th>
          <th>{{ updateText }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in violinBows" :key="item.id">
          <td class="pr-4">{{ item.size }}</td>
          <td class="flex justify-end"><input
            type="number"
            :name="`${item.id}-updates`"
            :id="`${item.id}-updates`"
            class="w-12 border-b border-gray-800"
            min="0"
            v-model="items[item.id]"
          ></td>
        </tr>
        </tbody>
      </table>
      <table class="table table-auto mx-4">
        <thead>
        <tr class="border-b border-black text-xl">
          <th class="pr-4">Viola</th>
          <th>{{ updateText }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in violaBows" :key="item.id">
          <td class="pr-4">{{ item.size }}</td>
          <td class="flex justify-end"><input type="number"
                                              :name="`${item.id}-updates`"
                                              :id="`${item.id}-updates`"
                                              class="w-12 border-b border-gray-800"
                                              min="0"
                                              v-model="items[item.id]"
          ></td>
        </tr>
        </tbody>
      </table>
      <table class="table table-auto mx-4">
        <thead>
        <tr class="border-b border-black text-xl">
          <th class="pr-4">Cello</th>
          <th>{{ updateText }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in celloBows" :key="item.id">
          <td class="pr-4">{{ item.size }}</td>
          <td class="flex justify-end"><input type="number"
                                              :name="`${item.id}-updates`"
                                              :id="`${item.id}-updates`"
                                              class="w-12 border-b border-gray-800"
                                              min="0"
                                              v-model="items[item.id]"
          ></td>
        </tr>
        </tbody>
      </table>
      <table class="table table-auto mx-4">
        <thead>
        <tr class="border-b border-black text-xl">
          <th class="pr-4">Bass</th>
          <th>{{ updateText }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in bassBows" :key="item.id">
          <td class="pr-4">{{ item.size }}</td>
          <td class="flex justify-end"><input type="number"
                                              :name="`${item.id}-updates`"
                                              :id="`${item.id}-updates`"
                                              class="w-12 border-b border-gray-800"
                                              min="0"
                                              v-model="items[item.id]"
          ></td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="flex justify-end mt-4 mb-2" v-if="loading">
      <bar-loader class="w-40 mr-2" color="#7c3aed"></bar-loader>
    </div>
    <div v-else class="flex justify-end mt-4">
<!--      <button @click.prevent="$emit('close')"-->
<!--              class="inline-flex items-center font-bold bg-red-600 px-3 mx-2 py-2 text-white shadow rounded hover:bg-red-800 hover:shadow-lg">-->
<!--        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">-->
<!--          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />-->
<!--        </svg>-->
<!--        Close-->
<!--      </button>-->
      <v-close-form-button @close="$emit('close')"/>
      <v-save-button/>
    </div>
  </form>
</template>

<script>
import computedBows from "@/mixins/computedBows";
import { API } from "aws-amplify";
import {BarLoader} from "@saeris/vue-spinners";
import VSaveButton from "@/components/UI/buttons/VSaveButton";
import VCloseFormButton from "@/components/UI/buttons/VCloseFormButton";

export default {
  name: "VUpdateBowsForm",
  components: { VCloseFormButton, VSaveButton, BarLoader },
  mixins: [computedBows],
  props: {
    bows: {
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
            bow_updates: updated
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
      for (const bow of this.bows) {
        this.items[bow.id] = 0;
      }
    },
    handleUpdate(id, e) {
      this.items[id] = parseInt(e.target.value);
    }
  }
};
</script>

<style scoped>

</style>
