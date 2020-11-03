<template>
  <nav class="flex items-center justify-center md:justify-between flex-wrap bg-purple-600 p-4 shadow-lg">
    <div class="flex items-center flex-shrink-0 text-white mr-6 font-bold text-xl">
      <router-link to="/">
        Instrument Inventory
      </router-link>
    </div>
    <ul class="flex text-sm md:text-lg">
<!--      <li class="pr-1 rounded-t border-b border-purple-300" :class="$route.name === 'New' && 'active'">-->
      <li class="nav-item" :class="$route.name === 'New' ?  'active' : 'inactive'">
        <router-link to="/new"
                     class="nav-link"
                     :class="$route.name === 'New' ? 'active': 'inactive'"
        >New
        </router-link>
      </li>
      <li class="nav-item" :class="$route.name === 'Retrieve' ? 'active' : 'inactive'">
        <router-link to="/retrieve"
                     class="nav-link"
                     :class="$route.name === 'Retrieve' ? 'active': 'inactive'"
          >Retrieve
        </router-link>
      </li>
      <li class="nav-item" :class="$route.name === 'SignOut' ? 'active' : 'inactive'">
        <router-link to="/sign-out"
                     class="nav-link"
                     :class="$route.name === 'SignOut' ? 'active': 'inactive'"
          >Sign Out
        </router-link>
      </li>
      <li class="nav-item" :class="$route.name === 'Inventory' ? 'active' : 'inactive'">
        <router-link to="/inventory"
                     class="nav-link"
                     :class="$route.name === 'Inventory' ? 'active': 'inactive'"
         >Inventory
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'VNav',
  created() {
    console.log(this.$route)
  }
}
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

.nav-link {
  @apply inline-block py-2 px-2;
}

.nav-link.active {
  @apply text-white font-bold;
}

.nav-link.inactive {
  @apply text-purple-300 font-semibold;
}

.nav-link:hover {
  @apply text-purple-200;
}

</style>
