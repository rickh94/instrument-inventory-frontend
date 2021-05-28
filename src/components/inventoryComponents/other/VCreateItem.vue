<template>
  <form @submit="handleSubmit">
    <div class="flex">
      <h4 class="text-xl text-gray-900 font-bold mb-2">Create New Item Type</h4>
    </div>
    <v-form-control label="Name" label-for="name">
      <input id="name"
             name="name"
             v-model="data.name"
             type="text"
             class="appearance-none bg-transparent border-none text-gray-900 py-1 leading-tight"
      >
    </v-form-control>
    <v-form-control label="Count" label-for="count">
      <input id="count"
             name="name"
             v-model="data.count"
             type="number"
             class="appearance-none bg-transparent border-none text-gray-900 py-1 leading-tight w-16"
      >
    </v-form-control>
    <v-form-control label="Notes" label-for="notes">
      <textarea id="notes"
                v-model="data.notes"
                class="appearance-none bg-transparent border-none text-gray-900 leading-tight w-full"
      ></textarea>
    </v-form-control>
    <v-spinner v-if="loading" line-fg-color="#805ad5"></v-spinner>
    <div v-else class="flex justify-end">
      <button @click.prevent="handleCancel"
              class="bg-yellow-600 px-4 mx-2 py-2 text-white shadow rounded hover:bg-yellow-800 hover:shadow-lg">Cancel
      </button>
      <button type="submit"
              class="bg-purple-600 px-4 py-2 text-white shadow rounded hover:bg-purple-800 hover:shadow-lg">Submit
      </button>
    </div>
  </form>

</template>

<script>
import VFormControl from "@/components/UI/VFormControl";

export default {
  name: "VCreateItem",
  components: { VFormControl },
  data() {
    return {
      data: {
        name: "",
        count: 0,
        num_out: 0,
        signed_out_to: [],
        notes: ""
      }
    };
  },
  methods: {
    handleSubmit() {

    },
    handleCancel() {
      this.data = {name: "", count: 0, num_out: 0, signed_out_to: [], notes: ""}
      this.$emit('close')
    }
  }
};
</script>

<style scoped>

</style>
