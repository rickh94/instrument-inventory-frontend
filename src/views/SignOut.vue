<template>
  <div class="max-w-4xl">
    <v-sign-out-single />
    <v-sign-out-multiple />
  </div>
</template>

<script>
import VSignOutMultiple from '@/components/VSignOutMultiple'
import VSignOutSingle from '@/views/VSignOutSingle'

export default {
  name: 'SignOut',
  components: { VSignOutSingle, VSignOutMultiple },
}
</script>
