<template>
<!--  TODO: Create custom sign in component -->
  <amplify-authenticator :authConfig="{signInConfig: {isSignUpDisplayed: false}}">
    <div id="app">
      <v-nav></v-nav>
      <router-view/>
    </div>
    <amplify-sign-out></amplify-sign-out>
  </amplify-authenticator>
</template>

<script>
import VNav from '@/components/VNav'
export default {
  name: 'App',
  components: { VNav },
  data() {
    return {
    }
  }
}
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>

