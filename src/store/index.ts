import Vue from 'vue'
import Vuex from 'vuex'
import { Instrument } from "@/util/commonTypes";

Vue.use(Vuex);


export enum UserRole {
  Unauthenticated = "UNAUTHENTICATED",
  Staff = "STAFF",
  Admin = "Admin"
}

type AppState = {
  searchResults: Instrument[],
  currentInstrument?: Instrument | null,
  newInstrumentNumber: string,
  allInstruments: Instrument[],
  userRole: UserRole,
  acOptions: {
    locations: string[],
    types: string[],
    sizes: string[],
  }
};

const defaultState: AppState = {
  searchResults: [],
  currentInstrument: null,
  newInstrumentNumber: '',
  allInstruments: [],
  userRole: UserRole.Unauthenticated,
  acOptions: {
    locations: [],
    types: [],
    sizes: [],
  },
}

export default new Vuex.Store({
  state: defaultState,
  mutations: {
    setAllInstruments(state, instruments: Instrument[]) {
      state.allInstruments = instruments
    },
    clearAllInstruments(state) {
      state.allInstruments = []
    },
    setSearchResults(state: AppState, instruments: Instrument[]) {
      state.searchResults = instruments
    },
    clearSearchResults(state) {
      state.searchResults = []
    },
    setCurrentInstrument(state, instrument: Instrument) {
      state.currentInstrument = instrument
    },
    updateCurrentInstrument(state, instrument: Instrument | null) {
      // This will probably never happen, but this function might seem
      // to typescript that it will be called with an object that might
      // be null, so a guard just in case:
      if (instrument === null) {
        return;
      }
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
    setNewInstrumentNumber(state, number: string) {
      state.newInstrumentNumber = number
    },
    clearNewInstrumentNumber(state) {
      state.newInstrumentNumber = ''
    },
    logIn(state, nextRole: string) {
      switch (nextRole) {
        case 'ADMIN':
          state.userRole = UserRole.Admin;
          break;
        case 'unauthenticated':
          state.userRole = UserRole.Unauthenticated;
          break;
        case 'STAFF':
          state.userRole = UserRole.Staff;
          break;
        default:
          break;
      }
    },
    logOut(state) {
      state.userRole = UserRole.Unauthenticated
    },
    setACOptions(state, nextOptions) {
      state.acOptions = nextOptions
    },
  },
  modules: {},
  getters: {
    isAdmin(state) {
      return state.userRole === UserRole.Admin;
    }
  }
})
