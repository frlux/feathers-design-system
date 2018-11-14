<template>

  <div class="library" id="app">

    <header class="align-items-center d-flex justify-content-center justify-content-md-between library__header p-3">

      <router-link to="/">

        <Logo fill="white" />

      </router-link>

      <Menu />

    </header>

    <Search :search-action="$route.name"/>

    <router-view class="view" />

    <app-footer />

  </div>
</template>

<script>
import AppFooter from './patterns/AppFooter.vue';
import Logo from "./elements/Logo.vue";
import Menu from "./patterns/Menu.vue";
import Search from "./patterns/Search.vue";

export default {
  name: 'app',

  components: {
    AppFooter,
    Logo,
    Menu,
    Search,
  },

  mounted() {
    this.$store.dispatch('getAuthors');
    this.$store.dispatch("getCallsToAction");
    this.$store.dispatch("getUpcomingEvents");
    this.$store.dispatch("getServices");
    this.$store.dispatch("getPages");
    this.$store.dispatch("getCollection");
    this.$store.dispatch("getPosts");
	this.$store.dispatch("getArticles");
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Open+Sans|PT+Serif|Lato");
</style>
