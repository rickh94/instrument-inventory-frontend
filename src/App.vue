<template>
<!--  TODO: Create custom sign in component -->
  <amplify-authenticator :authConfig="{signInConfig: {isSignUpDisplayed: false}}">
    <div id="app">
      <v-nav></v-nav>
      <div class="max-w-4xl mx-auto">
        <router-view/>
      </div>
    </div>
    <div class="flex justify-center">
      <amplify-sign-out button-text="Log Out"></amplify-sign-out>
    </div>
    <instrument-display />
  </amplify-authenticator>
</template>

<script>
  import VNav from '@/components/VNav'
  import InstrumentDisplay from '@/components/InstrumentDisplay'

  export default {
  name: 'App',
  components: { InstrumentDisplay, VNav },
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

