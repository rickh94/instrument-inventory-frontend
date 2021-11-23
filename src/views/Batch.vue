<template>
  <div class="max-w-3xl">
    <div class="shadow p-3 m-5">
      <div class="flex w-full items-center justify-center gap-x-2 font-bold">
        <a href="#" @click="toggleMode" :class="this.mode === 'retrieve' && 'text-purple-600 border-b-2 border-purple-600'">
          Retrieve
        </a>
        |
        <a href="#" @click="toggleMode" :class="this.mode === 'move' && 'text-purple-600 border-b-2 border-purple-600'">
          Move
        </a>
      </div>
      <Retrieve v-if="this.mode === 'retrieve'"></Retrieve>
      <Move v-else-if="this.mode === 'move'" :initial-location="nextLocation" :focus-on-created="focusOnCreated"></Move>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-unused-vars */
import Vue from "vue";
import { WithLoading } from "@/util/componentTypes";
import { mapMutations, mapState } from "vuex";

interface ComponentState extends WithLoading {
  mode: "retrieve" | "move",
  focusOnCreated: boolean,
}

// noinspection JSUnusedGlobalSymbols
export default Vue.extend({
  name: "Batch",
  components: {
    Retrieve: () => import("@/components/Retrieve.vue"),
    Move: () => import("@/components/Move.vue")
  },
  data(): ComponentState {
    return {
      loading: false,
      mode: "retrieve",
      focusOnCreated: false,
    };
  },
  created(): void {
    if (this.nextBatchMode) {
      this.mode = this.nextBatchMode
      this.focusOnCreated = true;
    }
    setTimeout(() => this.clearBatchMove(), 2000);
  },
  methods: {
    ...mapMutations(["clearBatchMove"]),
    toggleMode() {
      if (this.mode === "retrieve") {
        this.mode = "move"
      } else if (this.mode === "move") {
        this.mode = "retrieve"
      }
    }
  },
  computed: mapState(["nextLocation", "nextBatchMode"]),
});
</script>

<style scoped>

</style>
