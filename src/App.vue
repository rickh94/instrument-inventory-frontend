<template>
  <!--  TODO: Create custom sign in component -->
  <amplify-authenticator :authConfig="{signInConfig: {isSignUpDisplayed: false}}">
    <div id="app">
      <v-nav></v-nav>
      <div class="w-full">
        <router-view class="mx-auto" />
      </div>
    </div>
    <div class="flex justify-center">
      <amplify-sign-out button-text="Log Out"></amplify-sign-out>
    </div>
    <instrument-display />
  </amplify-authenticator>
</template>

<script>
import VNav from "@/components/VNav";
import InstrumentDisplay from "@/components/InstrumentDisplay";
import { onAuthUIStateChange } from "@aws-amplify/ui-components";
import { USER_ROLES } from "@/store";
import { mapState, mapMutations } from "vuex";

export default {
  name: "App",
  components: { InstrumentDisplay, VNav },
  data() {
    return {};
  },
  created() {
    onAuthUIStateChange((nextAuthState, authData) => {
      if (nextAuthState === "signedin") {
        this.logIn(USER_ROLES[authData.attributes["custom:USER_ROLE"]]);
      } else if (nextAuthState === "signedout") {
        this.logOut();
      }
    });
  },
  methods: mapMutations(["logIn", "logOut"]),
  computed: mapState(["userRole"])
};
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
@import url('https://fonts.googleapis.com/css2?family=Oxygen:wght@300;400;700&display=swap');

body {
  font-family: 'Oxygen', sans-serif;
}
</style>

