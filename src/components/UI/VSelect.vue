<template>
  <div class="relative">
    <button class="appearance-none px-2 py-1 border border-black text-black rounded shadow"
            @click="open = !open">{{ selectedText ? selectedText : placeholder }}
      <font-awesome-icon :icon="open ? 'chevron-up' : 'chevron-down'"></font-awesome-icon>
    </button>
    <ul v-if="open" class="absolute shadow-lg border z-50 rounded border-purple-600 bg-white w-56 mt-1">
      <li v-for="option in selectOptions"
          :key="option.value"
          class="border-b border-purple-400 p-2 hover:bg-purple-300 cursor-pointer"
          :class="value === option.value ? 'bg-purple-300 text-black' : 'bg-white'"
          @click.prevent="handleClick(option.value)"
      >{{ option.text }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

interface ComponentState {
  open: boolean,
}

export default Vue.extend({
  name: "VSelect",
  props: {
    placeholder: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    selectOptions: {
      type: Array.of(Object),
      required: true
    }
  },
  data(): ComponentState {
    return {
      open: false
    };
  },
  methods: {
    handleClick(nextValue: string): void {
      this.open = false;
      this.$emit("input", nextValue);
    }
  },
  computed: {
    selectedText(): string | null {
      if (this.value) {
        const found = this.selectOptions.find((item: { value: string, text: string }) => item.value === this.value);
        return found.text;
      }
      return null;
    }
  }
});
</script>

<style scoped>

</style>
