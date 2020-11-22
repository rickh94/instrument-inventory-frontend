<template>
  <div class="relative">
    <button class="appearance-none px-4 py-1 border border-purple-600 text-purple-600 border-black rounded shadow"
            @click="open = !open">{{ selectedText ? selectedText : placeholder }}
      <font-awesome-icon :icon="open ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
    </button>
    <ul v-if="open" class="absolute shadow-lg border z-50 rounded border-purple-600 bg-white w-56 mt-1">
      <li v-for="option in options"
          :key="option.value"
          class="border-b border-purple-400 p-2 hover:bg-purple-300 cursor-pointer"
          :class="value === option.value ? 'bg-purple-300 text-black' : 'bg-white'"
          @click.prevent="handleClick(option.value)"
      >{{ option.text }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'VSelect',
  props: {
    placeholder: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      open: false,
    }
  },
  methods: {
    handleClick(nextValue) {
      this.open = false
      this.$emit('input', nextValue)
    },
  },
  computed: {
    selectedText() {
      if (this.value) {
        const found = this.options.find(item => item.value === this.value)
        return found.text
      }
      return null
    },
  },
}
</script>

<style scoped>

</style>
