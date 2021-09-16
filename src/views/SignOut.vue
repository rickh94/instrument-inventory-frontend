<template>
  <div class="max-w-3xl">
    <v-sign-out-single />
    <v-sign-out-multiple v-if="isAdmin" />
  </div>
</template>

<script lang="ts">
import VSignOutSingle from "@/components/VSignOutSingle.vue";
import checkAdmin from "@/mixins/checkAdmin";
import Vue from "vue";

// noinspection JSUnusedGlobalSymbols
export default Vue.extend({
  name: "SignOut",
  components: {
    VSignOutSingle,
    VSignOutMultiple: () => import("@/components/VSignOutMultiple.vue")
  },
  mixins: [checkAdmin]
});
</script>
