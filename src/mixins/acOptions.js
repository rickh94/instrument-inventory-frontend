import { mapState, mapMutations } from 'vuex'
import { API } from 'aws-amplify'

export default {
  computed: {
    ...mapState(['acOptions']),
  },
  methods: {
    ...mapMutations(['setACOptions']),
    async getACOptions() {
      if (this.acOptions.locations.length === 0) {
        try {
          const { locations, types, sizes } = await API.get(
            'instrument-inventory',
            'schema/ac-options',
            {}
          )
          this.setACOptions({ locations, types, sizes })
        } catch (e) {
          this.$toasted.error(`Error ${e.response.data}`, { duration: 2000 })
        }
      }
    },
  },
}
