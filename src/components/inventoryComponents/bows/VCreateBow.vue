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
import VFormControl from '@/components/UI/VFormControl'
import VAutocomplete from '@/components/UI/VAutocomplete'
import { API } from 'aws-amplify'

export default {
  data() {
    return {
      types: [],
      sizes: [],
      loading: false,
      data: {
        type: '',
        size: '',
        count: '',
      },
    }
  },
  async created() {
    if (this.sizes.length === 0) {
      try {
        const { types, sizes } = await API.get('instrument-inventory', 'schema/ac-options', {})
        this.types = types
        this.sizes = sizes
      } catch (e) {
        this.$toasted.error(`Error ${e.response.data}`, { duration: 2000 })
      }
    }
  },
  name: 'VCreateBow',
  components: { VAutocomplete, VFormControl },
  methods: {
    handleCancel() {
      this.data = { type: '', size: '', count: '' }
      this.$emit('close')
    },
    async handleSubmit() {
      try {
        this.loading = true
        const response = await API.post('instrument-inventory', 'bows', {
          body: {
            ...this.data,
          },
        })
        this.$emit('updated', { updatedIds: [response.item.id], updatedItems: [response.item] })
        this.$toasted.show(response.message, { duration: 2000 })
        this.loading = false
        this.$emit('close')
      } catch (err) {
        if (err.response.data) {
          this.$toasted.error(err.response.data, { duration: 2000 })
        } else {
          this.$toasted.error(err)
        }
      }
    },
  },
}
</script>

<style scoped>

</style>
