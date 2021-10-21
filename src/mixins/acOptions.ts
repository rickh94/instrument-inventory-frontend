import { mapState, mapMutations } from 'vuex'
import { API } from 'aws-amplify'
import Vue from "vue";

export default Vue.extend({
  computed: {
    ...mapState(['acOptions']),
  },
  methods: {
    ...mapMutations(['setACOptions']),
    async getACOptions(): Promise<void | string> {
      // TODO: refactor this out to a service
      if (this.acOptions.locations.length === 0) {
        try {
          const { locations, types, sizes } = await API.get(
            'instrument-inventory',
            'schema/ac-options',
            {}
          )
          this.setACOptions({ locations, types, sizes })
        } catch (e) {
          console.error(e)
          return `Error: ${e.response.data}`
        }
      }
    },
  },
});
