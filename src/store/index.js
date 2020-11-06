import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searchResults: [],
    currentInstrument: null,
    newInstrumentNumber: '',
  },
  mutations: {
    setSearchResults(state, instruments) {
      state.searchResults = instruments
    },
    clearSearchResults(state) {
      state.searchResults = []
    },
    setCurrentInstrument(state, instrument) {
      state.currentInstrument = instrument
    },
    clearCurrentInstrument(state) {
      state.currentInstrument = null
    },
    setNewInstrumentNumber(state, number) {
      state.newInstrumentNumber = number
    },
    clearNewInstrumentNumber(state) {
      state.newInstrumentNumber = ''
    },
  },
  modules: {},
})
