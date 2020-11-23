<template>
  <form @submit.prevent="handleSubmit">
    <h4 class="text-xl text-gray-900 font-bold mb-2">Create New Bow Type</h4>
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
  </form>
</template>

<script>
import VFormControl from '@/components/VFormControl'
import VAutocomplete from '@/components/VAutocomplete'
import { API } from 'aws-amplify'

export default {
  data() {
    return {
      types: [],
      sizes: [],
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
}
</script>

<style scoped>

</style>
