<template>
  <div>
    <v-spinner v-if="loading" line-fg-color="#805ad5" class="my-2"></v-spinner>
    <div v-else class="flex items-start flex-wrap justify-around mt-4">
      <v-bows-table :bows="violinBows" instrument="Violin"></v-bows-table>
      <v-bows-table :bows="violaBows" instrument="Viola"></v-bows-table>
      <v-bows-table :bows="celloBows" instrument="Cello"></v-bows-table>
      <v-bows-table :bows="bassBows" instrument="Bass"></v-bows-table>
    </div>
    <div class="flex justify-around max-w-lg mx-auto mt-2">
      <button class="bg-purple-600 py-2 px-4 shadow hover:bg-purple-800 hover:shadow-lg rounded text-white"
              @click.prevent="formComponent = 'v-create-bow'">
        Create Bow
      </button>
      <button @click.prevent="formComponent = 'v-use-bows'"
              class="bg-purple-600 py-2 px-4 shadow hover:bg-purple-800 hover:shadow-lg rounded text-white">
        Use Bows
      </button>
      <button @click.prevent="formComponent = 'v-add-bows'"
              class="bg-purple-600 py-2 px-4 shadow hover:bg-purple-800 hover:shadow-lg rounded text-white">
        Add Bows
      </button>
    </div>
    <v-modal v-if="formComponent" @close="formComponent = null" width-class="max-w-lg">
      <div :is="formComponent" @close="formComponent = null" @updated="handleUpdate" :bows="bows"></div>
    </v-modal>
  </div>
</template>

<script>
import VBowsTable from '@/components/inventoryComponents/bows/VBowsTable'
import VCreateBow from '@/components/inventoryComponents/bows/VCreateBow'
import VUseBows from '@/components/inventoryComponents/bows/VUseBows'
import { API } from 'aws-amplify'
import VModal from '@/components/UI/VModal'
import computedBows from '@/mixins/computedBows'
import VAddBows from '@/components/inventoryComponents/bows/VAddBows'

export default {
  name: 'VInventoryBows',
  components: { VModal, VBowsTable, VCreateBow, VUseBows, VAddBows },
  mixins: [computedBows],
  data() {
    return {
      bows: [],
      formComponent: null,
      loading: false,
    }
  },
  async created() {
    try {
      this.loading = true
      const response = await API.get('instrument-inventory', 'bows', {})
      this.bows = response.bows
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
    handleUpdate({ updatedIds, updatedItems }) {
      this.loading = true
      this.bows = [...this.bows.filter(({ id }) => !updatedIds.includes(id)), ...updatedItems]
      this.loading = false
    },
  },
}

</script>

<style scoped>

</style>
