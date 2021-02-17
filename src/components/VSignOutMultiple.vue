<template>
  <div class="m-5 shadow p-3">
    <h6 class="text-sl font-bold">Sign Out Multiple from CSV</h6>
    <form class="flex-col flex" @submit.prevent="onSubmitMultiple">
      <v-form-control label="Upload CSV of 'assignedTo, location, number'" label-for="sign-out-csv">
        <input @change="onChangeFile" type="file" name="sign-out-csv" id="sign-out-csv" accept="text/csv">
      </v-form-control>
      <v-spinner v-if="loading" line-fg-color="#805ad5"></v-spinner>
      <div v-else class="flex justify-around w-full mt-3">
        <button type="submit"
                class="bg-purple-600 w-full md:w-auto px-8 text-white py-2 shadow hover:bg-purple-800 hover:shadow-lg rounded">
          Sign Out Multiple
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import VFormControl from '@/components/UI/VFormControl'
import { mapMutations } from 'vuex'
import Papa from 'papaparse'
import { API } from 'aws-amplify'

export default {
  name: 'VSignOutMultiple',
  components: { VFormControl },
  data() {
    return {
      multipleData: [],
      loading: false,
    }
  },
  methods: {
    ...mapMutations(['clearSearchResults']),
    onChangeFile(e) {
      Papa.parse(e.target.files[0], {
        complete: (results) => {
          if (results.data[0].number === undefined || results.data[0].assignedTo === undefined || results.data[0].location === undefined) {
            this.$toasted.error('Error: Invalid CSV file', { duration: 2000 })
            return
          }
          this.multipleData = results.data.filter(item => item.number && item.number.length > 3 && item.assignedTo && item.assignedTo.length > 2 && item.location && item.location.length > 0)
        },
        header: true,
        skipEmptyLines: true,
      })
    },
    async onSubmitMultiple() {
      try {
        this.loading = true
        const response = await API.post('instrument-inventory', 'sign-out/multiple', {
          body: {
            instruments: this.multipleData,
          },
        })
        this.loading = false
        this.$toasted.info(`Signed out ${response.updated.join(', ')}`, { duration: 2000 })
        this.clearSearchResults()
      } catch (e) {
        this.loading = false
        this.$toasted.error(`Error: ${e.response.data}`)
      }
    },
  },
}
</script>
