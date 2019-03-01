<template>
    <main class="channel" role="main">
        <template v-for="(call, index) in callsToAction" >
            <call-to-action v-if="index === 0"
                            :key="call.id"
                            :action="call.acf.action"
                            class="p-3"
                            :copy="call.acf.copy"
                            :image="call.acf.image"
                            :heading="call.acf.heading"></call-to-action>
        </template>

        <header class="background--white d-flex p-4">

            <div class="col-md-10 m-auto">

                <div class="col-md-8">

                    <heading class="channel__title text--dark text--serif" level="h1" v-html="!term && !collectionTitle ? 'Newly Added' : !term ? collectionTitle : term.name">
                    </heading>

                    <p class="channel__description" v-html="!term && !collectionDescription ? 'The Freshest Items' : !term ? collectionDescription : term.description"></p>

                </div>

            </div>

        </header>

        <section class="background--white library__section p-3">

            <div class="col-lg-10 m-lg-auto">

                <div class="d-md-flex">


                    <div class="col-md-4">
                        Sidebar
                        <div class="mt-3" style="width: 307.875px">
                            <div class="form-group">
                                <label class="form-label text--bold text--sans text--dark" for="collectionSidebarFilter">
                                    Search this Collection
                                </label>

                                <input class="form-control"
                                       id="collectionSidebarFilter"
                                       type="text"
                                       v-model="filter">
                            </div>

                            <div class="form-group">
                                <label class="form-label text--bold text--sans text--dark"
                                       for="collectionSidebarGenre">
                                    Filter items by Genre
                                </label>

                                <div class="form-control"
                                        id="collectionSidebarGenre">
                                    <div v-for="genre in genres" :key="genre.id">
                                      <input type="checkbox" :id="genre.slug" :value="genre.id" v-model="selectedGenre">
                                      <label v-html="genre.name"></label>
                                    </div>
                                </div>

          
                            </div>
                            <div class="form-group">
                                <label class="form-label text--bold text--sans text--dark"
                                       for="collectionSidebarAudience">
                                    Filter items by Audience
                                </label>

                                <div class="form-control"
                                        id="collectionSidebarAudience">
                                    <div v-for="audience in audiences" :key="audience.id">
                                      <input type="checkbox" :id="audience.slug" :value="audience.id" v-model="selectedAudience">
                                      <label v-html="audience.name"></label>
                                    </div>
                                </div>

          
                            </div>


                            <div class="form-group">
                                <label class="form-label text--bold text--sans text--dark"
                                       for="collectionSidebarLocation">
                                    Filter items by location
                                </label>

                                <select class="form-control"
                                        id="collectionSidebarLocation"
                                        v-model="location">
                                    <option value="">Any Library</option>
                                    <option :key="loc.id"
                                            :value="loc.id"
                                            v-for="loc in locations">
                                        {{ loc.name }}
                                    </option>

                                </select>
                            </div>

                            <button class="button button--blue-alternate"
                                    v-on:click="clearFilters">Clear Filter</button>
                        </div>
                    </div>

                    <div class="col col-lg-8">



                            <template v-for="post in posts">

                                <card class="card--background-gray text--dark"
                                      :key="post.slug"
                                      content-type="blog"
                                      :explainer="post.author.nice_name"
                                      :sub-explainer="post.date | moment('dddd, MMMM Do')"
                                      :heading="post.title"
                                      v-if="post">

                                    <div slot="copy">
                                        <div v-html="post.excerpt"></div>
                                    </div>

                                    <template slot="action">
                                        <router-link class="button button--aqua" :to="`/posts/${post.slug}`">
                                            Info
                                        </router-link>
                                    </template>

                                </card>

                            </template>

                        <template v-for="collectionItem in collection[currentPage-1]">
                         <collection-item class="card--background-blue-dark"
                           :item="collectionItem"
                           heading-level="h3"
                           subheading-class="mt-1 text--white"
                           subheading-level="h4"
                            :key="collectionItem.id"/>
                           </template>

                           <pagination
                        v-if="count > 0"
                        :total="Math.ceil(count/5)"
                        v-model="currentPage"></pagination>

                    </div>

                </div>

            </div>
        </section>
   </main>
</template>

<script>
import CallToAction from "../patterns/CallToAction.vue";
import Card from '../patterns/Card.vue';
import Heading from "../elements/Heading.vue";
import CollectionItem from '../patterns/CollectionItem.vue';
import Pagination from '../elements/Pagination.vue';
import * as api from '../store/api.js';
import {chunk} from "lodash";

export default {
  name: 'Collection',

  components: {
    CallToAction,
    Card,
    Heading,
    CollectionItem,
    Pagination
  },

  computed: {
    callsToAction() {
      return this.$store.state.callsToAction;
      //return this.$store.getters.getCallsToActionByCategory(this.slug);
       /**
       * NEED to get by featured collection
       */
    },

    collection() {
      let items = this.collectionItems;
      if(this.selectedGenre.length > 0){this.selectedGenre.forEach(val =>
        items = items.filter(item => item.genres && item.genres.includes(val)
        )
      )
      }
      if(this.selectedAudience.length > 0){this.selectedAudience.forEach(val =>
        items = items.filter(item => item.audience && item.audience.includes(val)
        )
      )
      }
      if(this.location){
        console.log(this.location);
        items = items.filter(item =>
          item.locations && item.locations.includes(this.location)
        );
      }
      if(this.filter){
        const value = this.filter.toLowerCase();
        items = items.filter(item => 
                  Object.keys(item.acf).some(key => item.acf[key] != null && 
                  item.acf[key].toString().toLowerCase()
                  .includes(value) || Object.keys(item.acf[key]).some(k => item.acf[key][k] !== null &&
                  item.acf[key][k].toString().toLowerCase().includes(value) )
                  ));
      }
      this.count = items.length;
      return chunk(items, 5);
       /**
       * NEED to get by featured collection
       */
    },

    pages() {
      //return this.$store.getters.getContentByService("pages", this.slug);
      /**
       * NEED to get by featured collection
       */
    },

    posts() {
      // return this.$store.state.posts;
      /**
       * maybe add an ACF for featured-collection terms to add a link/slug/id for
       * related blog posts... then we'll fetch those items and return.
       */
    },
    locations(){
      return this.$store.state.locations;
    },

    service() {
      return this.slug !== 'any' ? this.$store.getters.getServiceBySlug(this.slug) : null;
    },
    genres(){
      return this.$store.state.genres;
    },
    audiences(){
      return this.$store.state.audience;
    }
  },
  data(){
    return{
      collectionItems: [],
      filter: null,
      location: '',
      count: 0,
      currentPage: 1,
      selectedGenre:[],
      selectedAudience:[]
    }
  },
  beforeMount(){
    if(this.$store.state.audience.length < 1){
      this.$store.dispatch("getGenres");
    }
    if(this.$store.state.genres.length < 1){
      this.$store.dispatch("getAudiences");
    }
    if(this.$store.state.featuredCollections.length < 1){
      this.$store.dispatch("getFeaturedCollections");
    }

  },
  methods:{
    getNew(){
      const params = {per_page: 100};
      const data = api.fetchData('collection', params).then(results =>{
        console.log(results);
        this.addItems('collectionItems', results.data);
        return results.data;
      })
    },
    addItems(store, items){
      for (let i=0; i < items.length; i++){
        const index = this[store].findIndex(item => item.id === items[i].id)
        if (index === -1){ 
          this[store].push(items[i]);
        }
      }

    },
    clearFilters() {
      this.selectedGenre = null;
      this.filter = null;
      this.location = '';
      this.selectedAudience = null;
    },
  },
  mounted(){
    if(this.network == 'new'){
        this.getNew();
      }
  },
  props: {
    collectionDescription: {
      type: String,
    },

    collectionTitle: {
      type: String,
    },

    network: {
      type: String,
    },

    slug: {
      required: true,
      type: String
    },

    term:{
      type: Object
    }
  }
};
</script>

<style lang="scss">
.channel {
  &__title {
    @media #{$media-query-medium} {
      font-size: $font-size-xx-large;
    }
  }

  &__description {
    color: $color-blue-alternate;
    font-family: $font-family-text;
    font-size: $font-size-base;

    @media #{$media-query-medium} {
      font-size: $font-size-large;
    }
  }
}

.heading__separator {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  height: 8px;
  border: none;
  box-shadow: none;
  margin: 40px 0;

  &:before {
    flex: 0 1 144px;
    background-color: $color-blue-alternate;
    content: "";
  }
}

.separator {
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  height: 4px;
  border: none;
  box-shadow: none;
  margin: 40px 0;
}
</style>
