<template>
    <main class="service" role="main">

        <template v-if="serviceObject">

            <template v-for="(call, index) in callsToAction" >
                <call-to-action v-if="index === 0"
                                :key="call.id"
                                :action="call.acf.action"
                                :copy="call.acf.copy"
                                :image="call.acf.image"
                                :heading="call.acf.heading"
                                :link="call.acf.link"></call-to-action>
            </template>

            <header class="background--white d-flex p-4">

                <div class="col-md-10 m-auto">

                    <div class="col-md-8">

                        <heading class="channel__title text--dark text--serif"
                                 level="h1" v-html="serviceObject.name">
                        </heading>

                        <p class="channel__description" v-html="serviceObject.description">
                        </p>

                    </div>

                </div>

            </header>

            <section class="background--white library__section p-3">

                <div class="col-lg-10 m-lg-auto">

                    <div class="d-md-flex">
                        <!-- BEGIN SIDEBAR -->
                        <div class="co col-md-6 col-lg-4">
                          <!-- begin load more content buttons -->
                          <!-- <div v-if="active=='channel'">
                            <a class="button button button--pink"
                                v-if="total.pages > pages.length || pages.length > 10"
                                @click="getMoreContent('pages');">
                                See More Information
                            </a>
                            <a class="button button button--pink"
                                v-if="total.articles > articles.length || articles.length > 10"
                                @click="getMoreContent('articles');">
                                See More Articles
                            </a>
                            <a class="button button button--pink"
                                v-if="total.collection > collection.length || collection.length > 10"
                                @click="getMoreContent('collection');">
                                See More Collection Items
                            </a>
                            <a class="button button button--pink"
                                v-if="total.events > events.length || events.length > 10"
                                @click="getMoreContent('events');">
                                See More Events
                            </a>
                          </div>
                          <div v-if="active !=='channel'">
                            <a class="button button button--aqua"
                                @click="backToChannel();">
                                Back to {{ serviceObject.name }} Channel
                            </a>
                          </div>  --><!--end load more content buttons -->
                          <!--end sidebar content-->
                        </div><!-- END SIDEBAR -->
                        
                        <!-- BEGIN MAIN CONTENT -->
                        <div class="col col-lg-8">

                            <!-- <Showcase v-if="collection"
                                      :collection-items="collection.slice(1,10)"
                                      heading="Related Materials" /> -->
                            <content-stream :contents="channel"
                                          type="mixed" />
                            

                        </div><!-- END MAIN CONTENT COLUMN -->
                    </div>

                </div>

            </section>

        </template>

    </main>
</template>

<script>
import * as api from '../store/api.js';
import CallToAction from '../patterns/CallToAction.vue';
import Card from '../patterns/Card.vue';
import CollectionItem from '../patterns/CollectionItem.vue';
import ContentStream from "../patterns/ContentStream.vue";
import EventCard from '../patterns/EventCard.vue';
import Heading from '../elements/Heading.vue';
import Showcase from '../patterns/Showcase.vue';
import Pagination from '../elements/Pagination.vue';

export default {
  name: 'Service',

  components: {
    CallToAction,
    Card,
    CollectionItem,
    ContentStream,
    EventCard,
    Heading,
    Showcase,
    Pagination
  },

  computed: {
    channel(){
      return this.$store.getters.getContentByService(null, this.serviceObject, this.location);
    },
    callsToAction() {
      const serviceCTA = this.$store.getters.getContentByService(
        'callsToAction',
        this.serviceObject.slug,
        this.location
      );
      if (serviceCTA.length > 0) {
        return serviceCTA;
      }
      this.getContent('callsToAction', {services: this.serviceObject.id});
      return this.content.length==0? null : this.content.filter(item => item.type && item.type === 'actions');
    },

    /*collection() {
      const serviceCollections = this.$store.getters.getContentByService(
        'collection',
        this.serviceObject.slug,
        this.location,
      );

      if (serviceCollections.length > 4 && this.active !== "collection") {
        return serviceCollections;
      }
      this.getContent('collection', {services: this.serviceObject.id});
      return this.content.length==0 ? null : this.content.filter(item => item.type && item.type === 'collection-item');
    },

    articles() {
      const serviceArticles = this.$store.getters.getContentByService(
        'articles',
        this.serviceObject.slug,
        this.location,
      );

      if (serviceArticles.length > 0 && this.active !== "articles") {
        return serviceArticles;
      }

      const serviceQuery = { urlParams: `&services=${this.serviceObject.id}`, contentType: 'articles' };
      return this.$store.dispatch('getMoreContent', serviceQuery);
    },

    events() {
      const serviceEvents = this.$store.getters.getContentByService(
        'events',
        this.serviceObject.slug,
        this.location
      );

      if (serviceEvents.length > 0) {
        return serviceEvents;
      }

      const serviceQuery = { urlParams: `?services=${this.serviceObject.id}`, contentType: 'events' };
      return this.$store.dispatch('getMoreContent', serviceQuery);
    },

    pages() {
      const servicePages = this.$store.getters.getContentByService(
        'pages',
        this.serviceObject.slug,
        this.location
      );

      if (servicePages.length > 0) {
        return servicePages;
      }

      const serviceQuery = { urlParams: `?services=${this.serviceObject.id}`, contentType: 'pages' };

      return this.$store.dispatch('getMoreContent', serviceQuery);
    }, */
  },
  data(){
    return{
      content: [],
      count:{
        callsToAction: 1,
        events: 1,
        pages: 1,
        posts: 1,
        articles: 1,
        collection: 1,
        resources: 1,
      },
      page: 1,
      active: 'channel'
    }
  },
  methods: {
    getAuthor(authorId) {
      const author = this.$store.getters.getAuthorById(Number(authorId));
      return author.name;
    },
    async getContent(type, args=null){
      let apiPage = 1;
      
      while(Math.ceil(this.count[type]/100) >= apiPage){
      let params = {page: apiPage, per_page: 100};
      if(args){
        console.log(args);
        params = {...params, ...args};
      }
      console.log(params);
      this.count[type] = await this.fetchContent(type, params);
      apiPage++;
      }

    },
    async fetchContent(type,params){
      api.fetchData(type, params)
          .then(response =>{
            const total = response.headers['x-wp-total'];
            this.addContent(response.data);
            console.log(response);
            return total;
          }).catch(error=> console.log(error));

    },
    addContent(data){
      for (let i=0; i < data.length; i++){
          const index = this.content.findIndex(item => item.id === data[i].id)
          if (index === -1){ 
            this.content.push(data[i]);
          }
        }
    }
  },
  mount(){
    this.content = {...this.$store.getters.getContentByService(
        'callsToAction',
        this.serviceObject.slug
      ), ...this.$store.getters.getContentByService(
        'collection',
        this.serviceObject.slug
      ), ...this.$store.getters.getContentByService(
        'events',
        this.serviceObject.slug
      ), ...this.$store.getters.getContentByService(
        'featuredCollections',
        this.serviceObject.slug
      ), ...this.$store.getters.getContentByService(
        'resources',
        this.serviceObject.slug
      ), ...this.$store.getters.getContentByService(
        'articles',
        this.serviceObject.slug
      ), ...this.$store.getters.getContentByService(
        'pages',
        this.serviceObject.slug
      )};
      console.log("MOUNT");
      console.log(this.content);
  },

  props: {
    serviceObject: {
      type: Object,
    },
  },
};
</script>

<style lang="scss">
.event {
  font-family: $font-family-text;

  &__excerpt {
    color: $color-blue-alternate;
    font-family: $font-family-serif;
    font-size: $font-size-base;

    @media #{$media-query-medium} {
      font-size: $font-size-large;
    }
  }

  &__description {
    color: $color-blue-alternate;
    font-family: $font-family-text;
    font-size: $font-size-base;
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
