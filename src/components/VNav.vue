<template>
  <nav class="flex items-center justify-center md:justify-between flex-wrap bg-purple-600 px-6 py-2 shadow-lg">
    <div class="flex items-center flex-shrink-0 text-white mr-6 font-bold text-xl">
      <router-link to="/" v-if="$route.name !== 'Home'" class="mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      </router-link>
      <router-link to="/">
        Instrument Inventory
      </router-link>
    </div>
    <ul class="flex text-sm md:text-lg">
      <li class="nav-item" :class="$route.name === 'New' ?  'active' : 'inactive'" v-if="isAdmin">
        <router-link to="/new"
                     class="nav-link"
                     :class="$route.name === 'New' ? 'active': 'inactive'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
            <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
          </svg>
          New
        </router-link>
      </li>
      <li class="nav-item" :class="$route.name === 'Retrieve' ? 'active' : 'inactive'">
        <router-link to="/retrieve"
                     class="nav-link"
                     :class="$route.name === 'Retrieve' ? 'active': 'inactive'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z" />
            <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
          </svg>
          Retrieve
        </router-link>
      </li>
      <li class="nav-item" :class="$route.name === 'SignOut' ? 'active' : 'inactive'">
        <router-link to="/sign-out"
                     class="nav-link"
                     :class="$route.name === 'SignOut' ? 'active': 'inactive'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
          </svg>
          Assign
        </router-link>
      </li>
      <li class="nav-item" :class="$route.name === 'Inventory' ? 'active' : 'inactive'">
        <router-link to="/inventory"
                     class="nav-link"
                     :class="$route.name === 'Inventory' ? 'active': 'inactive'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
          Inventory
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import checkAdmin from "@/mixins/checkAdmin";

export default {
  name: "VNav",
  mixins: [checkAdmin],
};
</script>

<style scoped>
.nav-item {
  @apply pr-1 border-b;
}

.nav-item.inactive {
  @apply border-purple-300;
}

.nav-item.active {
  @apply border-white;
}

.nav-item:hover {
  @apply border-purple-100;
}

.nav-link {
  @apply inline-flex py-2 px-2 align-middle leading-tight items-center;
}

.nav-link.active {
  @apply text-white font-bold;
}

.nav-link.inactive {
  @apply text-purple-300 font-semibold;
}

.nav-link:hover {
  @apply text-purple-100;
}

</style>
