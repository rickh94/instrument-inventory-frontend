<template>
  <div>
    <input type="text"
           class="appearance-none bg-transparent border-none w-full text-gray-900 py-1 focus:text-purple-800 m4-3 leading-tight focus:outline-none"
           :value="value"
           @input="onInput"
           :required="required"
           :list="`list-${uniqueId}`"
           :id="`autocomplete-${uniqueId}`"
           autocomplete="off"
    >
    <datalist :id="`list-${uniqueId}`">
      <option v-for="(option, index) in completionOptions" :value="option" :key="`${uniqueId}-${index}`">{{ option }}</option>
    </datalist>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

const randomId = (): number => Math.floor(Math.random() * 10000);

interface ComponentState {
  uniqueId: number,
}


export default Vue.extend({
  name: "VAutocomplete",
  props: {
    completionOptions: {
      type: Array,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data(): ComponentState {
    return {
      uniqueId: randomId(),
    };
  },
  methods: {
    onInput(e) {
      this.$emit("input", e.target.value);
    },
  },
});
</script>

