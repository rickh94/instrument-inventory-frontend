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
    <div class="flex justify-end mt-4 mb-2" v-if="loading">
      <bar-loader class="w-56 mr-2" color="#805ad5"></bar-loader>
    </div>
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
        class="mx-1 appearance-none bg-green-600 text-white px-4 py-1 shadow rounded hover:bg-green-800 hover:shadow-lg">
        Retrieve
      </button>
    </div>
  </div>
</template>
<script>
import { BarLoader } from "@saeris/vue-spinners";

export default {
  name: "VItemDisplay",
  components: { BarLoader },
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
    }
  }
};
</script>
