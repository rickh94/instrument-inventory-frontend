<template>
  <amplify-authenticator>
    <div id="app">
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
      </div>
      <router-view/>
    </div>
    <amplify-sign-out></amplify-sign-out>
  </amplify-authenticator>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
