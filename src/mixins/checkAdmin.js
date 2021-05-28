import { mapState } from 'vuex'
import { USER_ROLES } from '@/store'

export default {
  computed: {
    ...mapState(['userRole']),
    isAdmin() {
      return this.userRole === USER_ROLES.ADMIN
    },
  },
}
