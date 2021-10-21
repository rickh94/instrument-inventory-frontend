<template>
  <div class="flex flex-col items-center w-full">
    <div class="w-full flex-col items-center">
      <div class="relative h-64 overflow-hidden mx-auto">
        <v-quagga-wrapper :on-detected="detected"
                          :reader-types="['code_128_reader', 'code_39_reader']"
                          :on-processed="() => {}"
        ></v-quagga-wrapper>
      </div>
    </div>
    <button class="appearance-none font-bold text-purple-800 text-lg py-2 px-4"
            @click="$emit('close')">Close Scanner
    </button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import VQuaggaWrapper from "@/components/UI/VQuaggaWrapper.vue";
import { CodeResult } from "@/util/componentTypes";

export default Vue.extend({
  name: "VScanner",
  components: { VQuaggaWrapper },
  methods: {
    detected(result: CodeResult): void {
      if (result.codeResult.code.match(/\w?\d+-\d+/)) {
        this.$emit("detected", result);
      }
    }
  },
  data(): { scannerWidth: number } {
    return {
      scannerWidth: Math.floor(window.screen.width * window.devicePixelRatio * 0.6)
    };
  }
});
</script>

