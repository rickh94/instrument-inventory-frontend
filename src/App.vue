<template>
  <!--  TODO: Create custom sign in component -->
  <amplify-auth-container>
    <amplify-authenticator :authConfig="{signInConfig: {isSignUpDisplayed: false}}">
      <div slot="sign-up">Sign Up is not enabled for this app</div>
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
  </amplify-auth-container>
</template>

<script lang="ts">
import VNav from "@/components/VNav";
import InstrumentDisplay from "@/components/InstrumentDisplay";
import { onAuthUIStateChange } from "@aws-amplify/ui-components";
import { mapState, mapMutations } from "vuex";

export default {
  name: "App",
  components: { InstrumentDisplay, VNav },
  created(): void {
    onAuthUIStateChange((nextAuthState, authData) => {
      if (nextAuthState === "signedin") {
        this.logIn(authData.attributes["custom:USER_ROLE"]);
      } else if (nextAuthState === "signedout") {
        this.logOut();
      }
    });
  },
  methods: mapMutations(["logIn", "logOut"]),
  computed: mapState(["userRole"]),
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

:root {
  --ampllify-font-family: 'Oxygen', sans-serif;
  --amplify-primary-color: #7c3aed;
  --amplify-primary-shade: rgb(91, 33, 182);
  --amplify-primary-tint: rgb(139, 92, 246);
}
</style>


