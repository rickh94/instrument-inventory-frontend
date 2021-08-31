<template>
<!--  possibly redo this with an input and datalist -->
  <div class="autocomplete" @blur="open = false">
    <input class="appearance-none bg-transparent border-none w-full text-gray-900  py-1 focus:text-purple-800 mr-3 leading-tight focus:outline-none"
           :value="value"
           @input="onInput"
           @keydown.arrow-down="selectedIndex += 1"
           @keydown.arrow-up="selectedIndex -= 1"
           @keydown.enter.prevent="selectOption(matchingOptions[selectedIndex])"
           @keydown.escape="open = false"
           @blur="closeSoon"
           :required="required"
    >
    <div class="autocomplete-items" v-if="open">
      <div v-for="(option, index) in matchingOptions"
           :key="index"
           :id="`autocomplete-option-${index}`"
           @click.prevent="selectOption(option)"
           @mouseover="selectedIndex = index"
           :class="selectedIndex === index ? 'from-purple-200 to-purple-100' : 'bg-white'"
           class="text-black bg-gradient-to-br"
      >{{ option }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "VAutocomplete",
  props: {
    options: {
      type: Array,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      open: false,
      selectedIndex: 0,
    };
  },
  methods: {
    selectOption(option) {
      this.$emit("input", option);
      this.open = false;
      this.selectedIndex = 0;
    },
    onInput(e) {
      this.$emit("input", e.target.value);
      this.open = true;
    },
    closeSoon() {
      // Why? because technically the options are outside the element and cause
      // a 'blur' event on the main input, closing the whole thing before the option
      // actually gets selected. A short delay ensures that the option is seleted
      // before the element closes. And without closing on blur, we just leave
      // random autocomplete lists all over the page, which is gross.
      setTimeout(() => this.open = false, 200);
    }
  },
  computed: {
    matchingOptions() {
      return this.options.filter(item => item.toLowerCase().substr(0, this.value.length) === this.value.toLowerCase());
    },
  },
};
</script>

<style scoped>
.autocomplete {
  position: relative;
  display: inline-block;
}

.autocomplete-items {
  position: absolute;
  border: 1px solid #7c3aed;
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
  border-bottom: 1px solid #7c3aed;
}

.autocomplete-active {
  @apply bg-purple-600 text-white;
}
</style>
