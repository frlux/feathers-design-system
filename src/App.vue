<template>

  <div class="library" id="app">

    <header class="align-items-center d-flex justify-content-center justify-content-md-between library__header p-3">

      <router-link :to="{name:'index'}">

        <Logo fill="white" />

      </router-link>

      <Menu />

    </header>

    <Search :search-action="$route.name" :filter="!$route.query && !$route.query.search ? '' : $route.query.search"/>

    <router-view class="view" />

    <app-footer :page-object="$store.state.userLocation ? $store.getters.getLocationBySlug($store.state.userLocation) : $store.getters.getLocationBySlug('headquarters')" 
                :menu-items="getFooterMenu()"/>

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
  methods:{
    getFooterMenu(){
      const footerMenu = this.$store.state.menu.find(menu=>menu.name==='top');
      return footerMenu.items;
    }
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Open+Sans|PT+Serif|Lato");
</style>
