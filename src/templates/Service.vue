<template>
    <main class="service" role="main">

        <template v-if="serviceObject">

            <template v-for="(call, index) in callsToAction" v-if="index === 0">
                <call-to-action :action="call.acf.action"
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

                        <div class="co col-md-6 col-lg-4"></div>

                        <div class="col col-lg-8">
<!--            NEEDS WORK              -->
                                                      <Showcase v-if="collection"
                            collection-link=""
                      :collection-items="collection"
                      heading="Related Materials" />
                          <template v-for="event in events">

                            <event-card class="card--background-gray"
                                        :event="event" />

                        </template>
                          <template v-for="page in pages">
                          <card class="card--background-white text--dark"
                                :content-type="blog"
                                :heading="page.title.rendered">

                            <div slot="copy">
                              <div v-html="page.excerpt.rendered"></div>
                            </div>

                            <template slot="action">
                              <router-link class="button button--aqua" :to="`${page.slug}`">
                                Info
                              </router-link>
                            </template>

                          </card>
                          </template>
                        <template v-for="article in articles">
                          <card class="card--background-white text--dark"
                                :content-type="blog"
                                :explainer="getAuthor(article.author)"
                                :sub-explainer="article.date | moment('dddd, MMMM Do')"
                                :heading="article.title.rendered">

                            <div slot="copy">
                              <div v-html="article.excerpt.rendered"></div>
                            </div>

                            <template slot="action">
                              <router-link class="button button--aqua" :to="`/articles/${article.slug}`">
                                Info
                              </router-link>
                            </template>

                          </card>
                          </template>
                          <template v-for="item in collection">
                          <collection-item class="card--background-blue-dark col-md-6 col-xl-8 mb-xl-0"
                           :item="item"
                           heading-level="h3"
                           subheading-class="mt-1 text--white"
                           subheading-level="h4"
                           variant="feature"
                           v-if="collection" />
                           </template>
	<!-- END CONTENT STREAM -->

                        </div>
                    </div>

                </div>

            </section>

        </template>

    </main>
</template>

<script>
import CallToAction from '../patterns/CallToAction.vue';
import Card from '../patterns/Card.vue';
import CollectionItem from '../patterns/CollectionItem.vue';
import EventCard from '../patterns/EventCard.vue';
import Heading from '../elements/Heading.vue';
import Showcase from '../patterns/Showcase.vue';

export default {
  name: 'Service',

  components: {
    CallToAction,
    Card,
    CollectionItem,
    EventCard,
    Heading,
    Showcase,
  },

  computed: {
    callsToAction() {
      let serviceCTA = this.$store.getters.getContentByService(
        'callsToAction',
        this.serviceObject.slug,
        this.location
      );
      if (serviceCTA.length > 0){
        return serviceCTA;
      }
      let serviceQuery = {'urlParams': "?services=" + this.serviceObject.id, 'contentType': 'callsToAction'};
      this.$store.dispatch("getMoreContent", serviceQuery);
    },

    collection() {
      let serviceCollections = this.$store.getters.getContentByService("collection", this.serviceObject.slug,
        this.location);
        console.log(serviceCollections);
        if (serviceCollections.length > 0){
        return serviceCollections;
      }
      let serviceQuery = {'urlParams': "&services=" + this.serviceObject.id, 'contentType': 'collection'};
      this.$store.dispatch("getMoreContent", serviceQuery);
    },

    articles() {
      let serviceArticles = this.$store.getters.getContentByService("articles", this.serviceObject.slug,
        this.location);
        if (serviceArticles.length > 0){
        return serviceArticles;
      }
      let serviceQuery = {'urlParams': "?services=" + this.serviceObject.id, 'contentType': 'articles'};
      this.$store.dispatch("getMoreContent", serviceQuery);
    },

    events() {
      let serviceEvents = this.$store.getters.getContentByService("events", this.serviceObject.slug,
        this.location);
        if (serviceEvents.length > 0){
        return serviceEvents;
      }
      let serviceQuery = {'urlParams': "?services=" + this.serviceObject.id, 'contentType': 'events'};
      this.$store.dispatch("getMoreContent", serviceQuery);
    },

    pages() {
      let servicePages = this.$store.getters.getContentByService("pages", this.serviceObject.slug,
        this.location);
        if (servicePages.length > 0){
        return servicePages;
      }
      let serviceQuery = {'urlParams': "?services=" + this.serviceObject.id, 'contentType': 'pages'};
      this.$store.dispatch("getMoreContent", serviceQuery);
    },

  },

 methods: {
    getAuthor: function(authorId) {
      let author = this.$store.getters.getAuthorById(Number(authorId));
      return author.name;
    },
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
