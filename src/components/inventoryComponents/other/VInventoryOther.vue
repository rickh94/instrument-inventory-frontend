<template>
  <div>
    <v-spinner v-if="loading" line-fg-color="$805ad5" class="my-2"></v-spinner>
    <div class="flex items-start justify-around flex-wrap mt-4" v-else>
    </div>
    <div class="flex justify-around max-w-lg mx-auto mt-2">
      <div class="flex justify-around max-w-lg mx-auto mt-2">
        <button class="bg-purple-600 py-2 px-4 shadow hover:bg-purple-800 hover:shadow-lg rounded text-white"
                @click.prevent="formComponent = 'v-create-item'">
          Create Item
        </button>
        <button @click.prevent="formComponent = 'v-use-items'"
                class="bg-purple-600 py-2 px-4 shadow hover:bg-purple-800 hover:shadow-lg rounded text-white">
          Use Items
        </button>
        <button @click.prevent="formComponent = 'v-add-items'"
                class="bg-purple-600 py-2 px-4 shadow hover:bg-purple-800 hover:shadow-lg rounded text-white">
          Add Items
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
name: "VInventoryOther"
}
</script>

<style scoped>

</style>
