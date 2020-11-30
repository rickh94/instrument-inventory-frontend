<template>
  <th class="px-4 py-2 cursor-pointer font-bold border-b border-black text-left "
      @click.prevent="$emit('changeSort', sortName)">
    <slot></slot>
    <font-awesome-icon
      class="ml-1 inline"
      icon="chevron-down"
      v-if="sortName === sortBy && sortDirection === 1"></font-awesome-icon>
    <font-awesome-icon
      class="ml-1 inline"
      icon="chevron-up"
      v-if="sortName === sortBy && sortDirection === -1"></font-awesome-icon>
  </th>
</template>

<script>
export default {
  name: 'VTableHeader',
  props: {
    sortName: {
      type: String,
      required: true,
    },
    sortBy: {
      type: String,
      default: '',
    },
    sortDirection: {
      type: Number,
      default: 0,
    },
  },
}
</script>

<style scoped>

</style>
