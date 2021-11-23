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
      <v-modal
        v-if="globalSearchActive"
        width-class="sm:max-w-lg"
        @close="closeGlobalSearch"
      >
        <div class="flex justify-between mb-4">
          <h6 class="text-xl font-bold text-gray-900">
            Search for an Instrument
          </h6>
          <button class="appearance-none text-white bg-red-600 px-1 rounded shadow hover:bg-red-800 hover:shadow-lg text-sm"
                  @click="closeGlobalSearch" title="Close Global Search">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        <v-instrument-search-box
          focus-on-created
          @notFound="handleNotFound"
          @foundOne="handleFoundOne"
          @foundMultiple="handleFoundMultiple"
        >
        </v-instrument-search-box>
      </v-modal>
      <v-not-found-modal :number="notFoundNumber"
                         v-if="showNotFound"
                         @close="showNotFound = false; notFoundNumber = ''"></v-not-found-modal>
    </amplify-authenticator>
  </amplify-auth-container>
</template>

<script lang="ts">
import VNav from "@/components/VNav.vue";
import InstrumentDisplay from "@/components/InstrumentDisplay.vue";
import { onAuthUIStateChange } from "@aws-amplify/ui-components";
import { mapMutations, mapState } from "vuex";
import Vue from "vue";
import VModal from "@/components/UI/VModal.vue";
import VInstrumentSearchBox from "@/components/VInstrumentSearchBox.vue";
import VNotFoundModal from "@/components/VNotFoundModal.vue";

enum CommandState {
  None,
  AwaitingMode,
  MoveInstruments,
}

export default Vue.extend({
  name: "App",
  components: { VNotFoundModal, VInstrumentSearchBox, VModal, InstrumentDisplay, VNav },
  data(): { globalSearchActive: boolean, showNotFound: boolean, notFoundNumber: string, mode: CommandState, commandData: string } {
    return {
      globalSearchActive: false,
      showNotFound: false,
      notFoundNumber: "",
      mode: CommandState.None,
      commandData: ""
    };
  },
  created(): void {
    // eslint-disable-next-line @typescript-eslint/ban-types
    onAuthUIStateChange((nextAuthState: string, authData?: object): void => {
      if (!authData) {
        return;
      }
      if (nextAuthState === "signedin") {
        this.logIn(authData["attributes"]["custom:USER_ROLE"]);
      } else if (nextAuthState === "signedout") {
        this.logOut();
      }

      document.body.addEventListener("keydown", ({ key, target }) => {
        if (key && target === document.body) {
          // noinspection JSUnreachableSwitchBranches
          switch (this.mode) {
            case CommandState.AwaitingMode:
              this.setMode(key);
              break;
            case CommandState.MoveInstruments:
              if (key === 'Enter') {
                this.startBatchMoveWithLocation(this.commandData);
                this.clearMode();
                this.$router.push("/batch");
              } else if (key.toString().length === 1) {
                this.commandData = this.commandData + key.toString();
              }
              break;
            case CommandState.None:
              if (key === "`") {
                this.mode = CommandState.AwaitingMode;
                // setTimeout(() => this.clearMode(), 2000);
              } else if (key.toString().length === 1) {
                this.globalSearchActive = true;
              }
              break;
            default:
              this.$toasted.error("Invalid input", { duration: 2000 });
              console.error(key);
          }
        }
      });
    });
  },
  methods: {
    ...mapMutations(["logIn", "logOut", "startBatchMoveWithLocation"]),
    setMode(key) {
      switch (key) {
        case "2":
          this.mode = CommandState.MoveInstruments;
          break;
        default:
          this.mode = CommandState.None;
      }
    },
    clearMode() {
      this.mode = CommandState.None;
      this.commandData = "";
    },
    closeGlobalSearch() {
      this.globalSearchActive = false;
    },
    handleNotFound({ detail }) {
      if (detail) {
        this.showNotFound = true;
        this.notFoundNumber = detail;
      } else {
        this.$toasted.error("Could not find matching instrument", { duration: 2000 });
      }
    },
    handleFoundMultiple() {
      this.globalSearchActive = false;
      this.$router.push("/");
    },
    handleFoundOne() {
      this.globalSearchActive = false;
    }
  },
  computed: mapState(["userRole"])
});
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


