<template>
  <main class="h-[100vh] w-[100vw]" text=" gray-700 dark:gray-200">
    <a-config-provider>
      <router-view />
    </a-config-provider>
  </main>
</template>

<script setup lang="ts"></script>

<style lang="scss">
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-transition-delay: 99999s;
  -webkit-transition:
    color 99999s ease-out,
    background-color 99999s ease-out;
}
</style>
