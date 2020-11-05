<template>
  <div class="m-5 shadow p-3" v-show="$store.state.searchResults.length > 1">
    <h4 class="text-xl mb-1 font-bold text-gray-800">Multiple Instruments Found</h4>
    <div class="flex flex-col mx-2 mt-4 ">
      <div class="py-2 text-gray-800 flex justify-between border-b border-gray-600"
           v-for="instrument in $store.state.searchResults"
           :key="instrument.id">
        <button class="appearance-none hover:underline text-purple-600" @click="select(instrument)">{{ instrument.size }} {{
          instrument.type }} {{ instrument.number }}
        </button>
        <div>{{ instrument.assignedTo }}</div>
        <div v-if="instrument.history">{{ instrument.history.join(', ') }}</div>
        <div v-else>No instrument history</div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapMutations } from 'vuex'

  export default {
    name: 'MultipleResults',
    methods: {
      select(instrument) {
        this.setCurrentInstrument(instrument)
      },
      ...mapMutations(['setCurrentInstrument', 'clearCurrentInstrument']),
    },
  }
</script>
