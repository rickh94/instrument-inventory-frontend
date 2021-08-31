<template>
  <form @submit.prevent="handleSubmit">
    <div class="flex">
      <h4 class="text-xl text-gray-900 font-bold mb-2">Create New Bow Type</h4>
    </div>
    <v-form-control label="Instrument Type" label-for="type">
      <v-autocomplete id="type" v-model="data.type" :options="types"></v-autocomplete>
    </v-form-control>
    <v-form-control label="Size" label-for="size">
      <v-autocomplete id="size" v-model="data.size" :options="sizes"></v-autocomplete>
    </v-form-control>
    <v-form-control label="Count" label-for="count">
      <input id="count"
             name="count"
             min="0"
             v-model="data.count"
             type="number"
             class="appearance-none bg-transparent border-none w-16 text-gray-900 py-1 leading-tight">
    </v-form-control>
    <div class="flex justify-end mt-4 mb-2" v-if="loading">
      <bar-loader class="w-40 mr-2" color="#7c3aed"></bar-loader>
    </div>
    <div v-else class="flex justify-end">
      <v-cancel-button @cancel="handleCancel" />
      <v-save-button />
    </div>
  </form>
</template>

<script>
import VFormControl from "@/components/UI/VFormControl";
import VAutocomplete from "@/components/UI/VAutocomplete";
import { API } from "aws-amplify";
import errorHandler from "@/mixins/errorHandler";
import { BarLoader } from "@saeris/vue-spinners";
import VCancelButton from "@/components/UI/buttons/VCancelButton";
import VSaveButton from "@/components/UI/buttons/VSaveButton";

export default {
  name: "VCreateBow",
  components: { VSaveButton, VCancelButton, VAutocomplete, VFormControl, BarLoader },
  mixins: [errorHandler],
  data() {
    return {
      types: [],
      sizes: [],
      loading: false,
      data: {
        type: "",
        size: "",
        count: ""
      }
    };
  },
  async created() {
    if (this.sizes.length === 0) {
      try {
        const { types, sizes } = await API.get("instrument-inventory", "schema/ac-options", {});
        this.types = types;
        this.sizes = sizes;
      } catch (e) {
        this.$toasted.error(`Error ${e.response.data}`, { duration: 2000 });
      }
    }
  },
  methods: {
    handleCancel() {
      this.data = { type: "", size: "", count: "" };
      this.$emit("close");
    },
    async handleSubmit() {
      try {
        this.loading = true;
        const response = await API.post("instrument-inventory", "bows", {
          body: {
            ...this.data
          }
        });
        this.$emit("updated", { updatedIds: [response.item.id], updatedItems: [response.item] });
        this.$toasted.show(response.message, { duration: 2000 });
        this.loading = false;
        this.$emit("close");
      } catch (err) {
        this.handleError(err);
      }
    }
  }
};
</script>

