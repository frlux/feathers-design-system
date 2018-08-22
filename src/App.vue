<template>

  <div class="library" id="app">

    <header class="align-items-center d-flex justify-content-center justify-content-md-between library__header p-3">

      <router-link to="/">

        <Logo fill="white" />

      </router-link>

      <Menu />

    </header>

    <Search />

    <router-view class="view" />

    <footer class="col-md-10 m-auto library__footer p-3 text--white">
      I am a footer
    </footer>

  </div>
</template>

<script>
import Logo from "./elements/Logo.vue";
import Menu from "./patterns/Menu.vue";
import Search from "./patterns/Search.vue";

export default {
  name: "app",

  components: {
    Logo,
    Menu,
    Search
  },

  mounted() {
    this.$store.dispatch("getCallsToAction");
    this.$store.dispatch("getUpcomingEvents");
    this.$store.dispatch("getServices");
    this.$store.dispatch("getPages");
    this.$store.dispatch("getCollection");
    this.$store.dispatch("getPosts");
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Open+Sans|PT+Serif|Lato");
</style>
