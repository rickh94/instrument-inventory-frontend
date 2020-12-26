<template>
  <div>
    <v-spinner v-if='loading' line-fg-color='#805ad5' class='my-2'></v-spinner>
    <div class='flex items-start flex-wrap justify-around mt-4' v-else>
      <v-strings-table :strings='violinStrings' instrument='Violin'></v-strings-table>
      <v-strings-table :strings='violaStrings' instrument='Viola'></v-strings-table>
      <v-strings-table :strings='celloStrings' instrument='Cello'></v-strings-table>
      <v-strings-table :strings='bassStrings' instrument='Bass'></v-strings-table>
    </div>
    <div class="flex justify-around max-w-lg mx-auto mt-2">
      <button class="bg-purple-600 py-2 px-4 shadow hover:bg-purple-800 hover:shadow-lg rounded text-white"
              @click.prevent="formComponent = 'v-create-string'">
        Create String
      </button>
      <button @click.prevent="formComponent = 'v-use-strings'"
              class="bg-purple-600 py-2 px-4 shadow hover:bg-purple-800 hover:shadow-lg rounded text-white">
        Use Strings
      </button>
      <button @click.prevent="formComponent = 'v-add-strings'"
              class="bg-purple-600 py-2 px-4 shadow hover:bg-purple-800 hover:shadow-lg rounded text-white">
        Add Strings
      </button>
    </div>
    <v-modal v-if="formComponent" @close="formComponent = null" width-class="max-w-lg">
      <div :is="formComponent" @close="formComponent = null" @updated="handleUpdate" :strings="strings"></div>
    </v-modal>
  </div>
</template>

<script>
import VStringsTable from '@/components/inventoryComponents/strings/VStringsTable'
import VCreateString from '@/components/inventoryComponents/strings/VCreateString'
import VUseStrings from '@/components/inventoryComponents/strings/VUseStrings'
import VAddStrings from '@/components/inventoryComponents/strings/VAddStrings'
import computedStrings from '@/mixins/computedStrings'
import { API } from 'aws-amplify'
import VModal from '@/components/UI/VModal'

export default {
  name: 'VInventoryStrings',
  components: { VModal, VStringsTable, VCreateString, VUseStrings, VAddStrings },
  mixins: [computedStrings],
  data() {
    return {
      strings: [],
      loading: false,
      formComponent: null,
    }
  },
  async created() {
    try {
      this.loading = true
      const response = await API.get('instrument-inventory', 'strings', {})
      this.strings = response.strings
      this.loading = false
    } catch (e) {
      this.loading = false
      if (e.response) {
        this.$toasted.error(e.response.data, { duration: 2000 })
      } else {
        this.$toasted.error(e.toString(), {duration: 2000})
        console.error(e)
      }
    }
  },
  methods: {
    handleUpdate({updatedIds, updatedItems}) {
      this.loading = true
      this.strings = [...this.strings.filter(({id}) => !updatedIds.includes(id)), ...updatedItems]
      this.loading = false
    }
  }
}
</script>

<style scoped>

</style>
