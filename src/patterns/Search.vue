<template>
    <form :action="searchFormAction"
          class="form--search pb-3 pt-3 p-md-4"
          method="GET"
          role="search"
          v-on:submit.prevent="search">

        <div class="m-auto col-lg-6 pl-m-0 pr-m-0">

            <div class="background--blue-dark card form-group form__group p-4">

                <div class="card__color-code mb-1"
                     :class="{
                        'card__color-code--collection': isCatalogSearch,
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

                        <template slot="items">
                            <button v-on:click.prevent="setCatalogSearch">Catalog</button>
                            <button v-on:click.prevent="setEventSearch">Events</button>
                            <button v-on:click.prevent="setServicesSearch">Services</button>
                            <button v-on:click.prevent="setEverythingSearch">Everything (beta)</button>
                        </template>
                    </Dropdown>
                </label>

                <div class="input-group mt-4">

                    <input class="form-control form-control-lg form__input"
                           name="query"
                           type="text"
                           style="background-color: #3d77b3;border-color: #1f5894;color: white;"
                           aria-label="Recipient's username"
                           aria-describedby="button-addon2"
                           v-model="searchQuery">

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
                            <svg class="icon" id="icon-search" viewBox="0 0 32 32" fill="white">
                                <title>search</title>
                                <path d="M31.008 27.231l-7.58-6.447c-0.784-0.705-1.622-1.029-2.299-0.998 1.789-2.096 2.87-4.815 2.87-7.787 0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-0.031 0.677 0.293 1.515 0.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007 0.23s0.997-2.903-0.23-4.007zM12 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"></path>
                            </svg>

                            <span class="d-none d-sm-inline">Search</span>
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
    isCatalogSearch() {
      return this.searchAction === "catalog";
    },

    isEventSearch() {
      return this.searchAction === "events";
    },

    isServicesSearch() {
      return this.searchAction === "services";
    }
  },

  data() {
    return {
      searchAction: "catalog",
      searchFormAction: "https://www.nccardinal.org/eg/opac/results",
      searchQuery: ""
    };
  },

  methods: {
    resetSearchAction() {
      const routeName = this.$route.name;

      if (routeName === "Events" || routeName === "Services") {
        this.$set(this, "searchAction", routeName.toLowerCase());
      } else {
        this.$set(this, "searchAction", "catalog");
      }
    },

    search() {
      if (this.isCatalogSearch) {
        return this.searchCatalog();
      }

      if (this.isEventSearch) {
        return this.$router.push({
          path: "/events",
          query: { filter: `${this.searchQuery}` }
        });
      }

      if (this.isServicesSearch) {
        return this.$router.push({
          path: "/services",
          query: { filter: `${this.searchQuery}` }
        });
      }

      return this.$router.push({
        path: "search",
        query: { filter: `${this.searchQuery}` }
      });
    },

    searchCatalog() {
      location.replace(
        `${this.searchFormAction}?query=${
          this.searchQuery
        }&qtype=keyword&locg=1`
      ); // eslint-disable-line
    },

    setCatalogSearch() {
      this.$set(this, "searchAction", "catalog");
    },

    setEventSearch() {
      this.$set(this, "searchAction", "events");
    },

    setEverythingSearch() {
      this.$set(this, "searchAction", "everything");
    },

    setServicesSearch() {
      this.$set(this, "searchAction", "services");
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

  watch: {
    /**
     * We want to make sure that the search is always as relevant as possible,
     * so, when the route changes, we can try to set a sane default.
     */
    $route() {
      this.resetSearchAction();
    }
  }
};
</script>
