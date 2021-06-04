export default {
  methods: {
    handleError(err) {
      this.loading = false
      if (err.response) {
        this.$toasted.error(err.response.data, { duration: 2000 })
        console.error(err.response.data)
        console.log(err)
      } else {
        this.$toasted.error(err, { duration: 2000 })
      }
    },
  },
}
