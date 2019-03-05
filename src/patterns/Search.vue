<template>
    <form :action="searchFormAction"
          class="form--search pb-3 pt-3 p-md-4"
          method="GET"
          role="search"
          v-on:keydown.enter.prevent="searchIt"
          v-on:submit.prevent="searchIt">

        <div class="m-auto pl-m-0 pr-m-0"
             :class="containerClass">

            <div class="background--blue-dark card form-group form__group p-4">

                <div class="card__color-code mb-1"
                     :class="{
                        'card__color-code--collection': isCatalogSearch,
                        'card__color-code--everything': isEverythingSearch,
                        'card__color-code--service': isServicesSearch,
                        'card__color-code--event': isEventSearch,
                      }"></div>

                <label for="" class="form__label text--white text--small text--bold">
                    Search
                    <Dropdown element="span"
                              label-class="text--underlined--dotted text--uppercase">

                        <template slot="label" v-if="isEventSearch">Events</template>
                        <template slot="label" v-else-if="isCatalogSearch">the Catalog</template>
                        <template slot="label" v-else-if="isServicesSearch">Services</template>
                        <template slot="label" v-else-if="isEverythingSearch">Everything (beta)</template>

                        <template slot="items">
                            <button class="button button--link d-block dropdown__menu__item link link--undecorated mb-1 mt-1 p-0 text--underlined" v-on:click.prevent="setCatalogSearch">Catalog</button>
                            <button class="button button--link d-block dropdown__menu__item link link--undecorated mb-1 mt-1 p-0 text--underlined" v-on:click.prevent="setEventSearch">Events</button>
                            <button class="button button--link d-block dropdown__menu__item link link--undecorated mb-1 mt-1 p-0 text--underlined" v-on:click.prevent="setServicesSearch">Services</button>
                            <button class="button button--link d-block dropdown__menu__item link link--undecorated mb-1 mt-1 p-0 text--underlined" v-on:click.prevent="setEverythingSearch">Everything (beta)</button>
                        </template>
                    </Dropdown>
                </label>

                <div class="input-group mt-4">

                    <input class="form-control form-control-lg form__input"
                           name="query"
                           type="text"
                           style="background-color: #3d77b3;border-color: #1f5894;color: white;"
                           aria-label="Search Query"
                           aria-describedby="button-addon2"
                           v-model="searchQuery"
                           v-on:keydown.enter="searchIt()"
                    
                           >

                    <div class="input-group-append">
                      
                        <c-button aria-label="search"
                                class="text--uppercase text--white"
                                :class="{
                                  'button--orange': isServicesSearch,
                                  'button--pink': isCatalogSearch,
                                  'background--teal': isEventSearch,
                                }"
                                type="submit"
                                id="button-addon2">
                                <router-link class="search__button" :to="searchRoute" @click="searchIt()">
                            <svg class="icon" id="icon-search" viewBox="0 0 32 32" fill="white">
                                <title>search</title>
                                <path d="M31.008 27.231l-7.58-6.447c-0.784-0.705-1.622-1.029-2.299-0.998 1.789-2.096 2.87-4.815 2.87-7.787 0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-0.031 0.677 0.293 1.515 0.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007 0.23s0.997-2.903-0.23-4.007zM12 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"></path>
                            </svg>
                             <span class="d-none d-sm-inline">Search</span>
                           </router-link>
                        </c-button>
                        
                    </div>

                    <input name="locg" value="1" type="hidden">
                    <input name="qtype" type="hidden" value="keyword">
                </div>

            </div>
        </div>


    </form>
</template>

<script>
import CButton from "../elements/Button.vue";
import Dropdown from "../elements/Dropdown.vue";

export default {
  name: "Search",

  components: {
    CButton,
    Dropdown
  },

  computed: {
    searchRoute(){
      return this.search();
    },

    isCatalogSearch() {
      return this.searchType.toLowerCase() === 'catalog'
        || this.searchType.toLowerCase() === 'index';
    },

    isEventSearch() {
      return this.searchType.toLowerCase() === 'events'
        || this.searchType.toLowerCase() === 'events-slug';
    },

    isEverythingSearch() {
      const types=["catalog", "index", "events", "events-slug", "services","services-slug"];
      return !this.searchType || !types.includes(this.searchType); 
    },

    isServicesSearch() {
      return this.searchType.toLowerCase() === 'services'
        || this.searchType.toLowerCase() === 'services-slug';
    },

    locationFilter() {
      return this.$store.state.userLocation;
    },
  },

  data() {
    return {
      searchFormAction: 'https://www.nccardinal.org/eg/opac/results',
      searchQuery: '',
      searchType: this.searchAction,
    };
  },

  methods: {
    search(){
      if (this.isCatalogSearch) {
        return `${this.searchFormAction}?query=${this.searchQuery}&qtype=keyword&locg=1`;//this.searchCatalog();
      }
      let route = {name: "Search", params:{} };
      route.params.filter = this.searchQuery ? `${this.searchQuery}` : '';
      
      if (this.isEventSearch) {
        route.name= "Events";
        route.params.userLocation = this.locationFilter;
      }

      if (this.isEverythingSearch) {
        route.name= "Search";
        route.params.userLocation = this.locationFilter;
      }

      if (this.isServicesSearch) {
        route.name= "Services";
        route.params.userLocation = this.locationFilter;
      }
  return route;
    },
    resetSearchAction() {
      const routeName = this.$route.name ? this.$route.name.toLowerCase() : 'everything';
      this.searchType = routeName;
    },

    setCatalogSearch() {
      //this.$set(this, 'searchAction', 'catalog');
      this.searchType = 'catalog';
    },

    setEventSearch() {
      //this.$set(this, 'searchAction', 'events');
      this.searchType = 'events';
    },

    setEverythingSearch() {
      //this.$set(this, 'searchAction', 'everything');
      this.searchType = 'everything';
    },

    setServicesSearch() {
      //this.$set(this, 'searchAction', 'services');
      this.searchType = 'services';
    },
    searchIt(){
      const route = this.search();
      this.$root.$emit("inputData", this.searchQuery);
      this.$router.push(route);      
    }
  },

  mounted() {
    /**
     * As soon as the `search` component renders for the first time,
     * let's make sure it sets itself to an appropriate default, so that
     * it's as useful as possible.
     */
    this.resetSearchAction();
    
  },
  
  props: {
    containerClass: {
      default: 'col-lg-6',
      type: String,
    },

    searchAction: {
      default: 'catalog',
      type: String,
    },
  },

  watch: {
    /**
     * We want to make sure that the search is always as relevant as possible,
     * so, when the route changes, we can try to set a sane default.
     */
    $route(){
     this.resetSearchAction();
    },
    
   /*  searchQuery(){
      this.$root.$emit("inputData", this.searchQuery);
    } */
  },
};
</script>
<style lang="scss">
 .search__button:link,
.search__button:visited,
.search__button:hover,
.search__button:active{
  color:#fff;
  text-decoration:none;
} 
</style>
