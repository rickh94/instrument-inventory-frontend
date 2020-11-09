<template>
  <div class="autocomplete" @blur="open = false">
    <input class="appearance-none bg-transparent border-none w-full text-gray-900  py-1 focus:text-purple-800 mr-3 leading-tight focus:outline-none"
           @input="onInput" @keydown.arrow-down="selectedIndex += 1" :value="value"
           @keydown.arrow-up="selectedIndex -= 1" @keydown.enter="selectOption(matchingOptions[selectedIndex])"
           @keydown.escape="open = false"
    >
    <div class="autocomplete-items" v-if="open">
      <div v-for="(option, index) in matchingOptions"
           :key="index"
           :id="`autocomplete-option-${index}`"
           @click="selectOption(option)"
           @mouseover="selectedIndex = index"
           :class="selectedIndex === index ? 'bg-gray-300' : 'bg-white'"
      >{{ option }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VAutocomplete',
  props: {
    options: {
      type: Array,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      open: false,
      selectedIndex: 0,
    }
  },
  methods: {
    selectOption(option) {
      this.$emit('input', option)
      this.open = false
      this.selectedIndex = 0
    },
    onInput(e) {
      this.$emit('input', e.target.value)
      this.open = true
    },
  },
  computed: {
    matchingOptions() {
      return this.options.filter(item => item.toLowerCase().substr(0, this.value.length) === this.value.toLowerCase())
    },
  },
}
</script>

<style scoped>
.autocomplete {
  position: relative;
  display: inline-block;
}

.autocomplete-items {
  position: absolute;
  border: 1px solid #d4d4d4;
  border-bottom: none;
  z-index: 99;
  top: 100%;
  left: 0;
  right: 0;
}

.autocomplete-items div {
  display: block;
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #d4d4d4;
}

.autocomplete-active {
  @apply bg-purple-600 text-white;
}
</style>
