import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    searchResults: [],
    currentInstrument: null,
    newInstrumentNumber: '',
    allInstruments: [],
  },
  mutations: {
    setAllInstruments(state, instruments) {
      state.allInstruments = instruments
    },
    clearAllInstruments(state) {
      state.allInstruments = []
    },
    setSearchResults(state, instruments) {
      state.searchResults = instruments
    },
    clearSearchResults(state) {
      state.searchResults = []
    },
    setCurrentInstrument(state, instrument) {
      state.currentInstrument = instrument
    },
    updateCurrentInstrument(state, instrument) {
      if (state.allInstruments.length > 0) {
        state.allInstruments = [
          instrument,
          ...state.allInstruments.filter(el => el.id !== instrument.id),
        ]
      }
      if (state.searchResults.length > 0) {
        state.searchResults = [
          instrument,
          ...state.searchResults.filter(el => el.id !== instrument.id),
        ]
      }
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
