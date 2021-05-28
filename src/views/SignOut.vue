<template>
  <div class="max-w-4xl">
    <v-sign-out-single />
    <v-sign-out-multiple v-if="isAdmin" />
  </div>
</template>

<script>
import VSignOutMultiple from "@/components/VSignOutMultiple";
import VSignOutSingle from "@/views/VSignOutSingle";
import checkAdmin from "@/mixins/checkAdmin";

export default {
  name: "SignOut",
  components: { VSignOutSingle, VSignOutMultiple },
  mixins: [checkAdmin]
};
</script>
