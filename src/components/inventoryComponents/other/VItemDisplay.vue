<template>
  <div>
    <div>
      <span class="font-bold text-gray-700 mb-2">Name: </span>{{ displayItem.name }}
    </div>
    <div>
      <span class="font-bold text-gray-700 mb-2">Count: </span>{{ displayItem.count }}
    </div>
    <div>
      <span class="font-bold text-gray-700 mb-2">Notes: </span>{{ displayItem.notes }}
    </div>
    <div>
      <span class="font-bold text-gray-700 mb-2">Signed Out Count: </span>{{ displayItem.num_out || 0 }}
    </div>
    <div>
      <span class="font-bold text-gray-700 mb-2">Signed Out To: </span>{{ displayItem.signed_out_to | joinOrNull }}
    </div>
    <v-spinner v-if="loading" line-fg-color="#805ad5"></v-spinner>
    <div v-else class="flex justify-cart mt-2 flex-row-reverse">
      <button class="mx-1 appearance-none bg-yellow-600 text-white px-4 py-1 shadow rounded hover:bg-yellow-800 hover:shadow-lg"
      @click="edit">Edit
      </button>
      <button
        @click="signOut"
        class="mx-1 appearance-none bg-blue-600 text-white px-4 py-1 shadow rounded hover:bg-blue-800 hover:shadow-lg">
        Sign Out
      </button>
      <button
        @click="retrieve"
        class="mx-1 appearance-none bg-blue-600 text-white px-4 py-1 shadow rounded hover:bg-green-800 hover:shadow-lg">
        Retrieve
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: "VItemDisplay",
  props: {
    displayItem: {}
  },
  data() {
    return {
      loading: false
    };
  },
  filters: {
    joinOrNull(value) {
      if (value && value.length) {
        return value.join(", ");
      }
      return "";
    }
  },
  methods: {
    edit() {
    },
    signOut() {
    },
    retrieve() {
    },
  }
};
</script>
