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
      const serviceCTA = this.$store.getters.getContentByService(
        'callsToAction',
        this.serviceObject.slug,
        this.location,
      );
      if (serviceCTA.length > 0) {
        return serviceCTA;
      }
      const serviceQuery = { urlParams: `?services=${this.serviceObject.id}`, contentType: 'callsToAction' };
      return this.$store.dispatch(`getMoreContent`, serviceQuery);
    },

    collection() {
      const serviceCollections = this.$store.getters.getContentByService(
        'collection',
        this.serviceObject.slug,
        this.location,
      );

      if (serviceCollections.length > 0) {
        return serviceCollections;
      }
      const serviceQuery = { urlParams: `&services=${this.serviceObject.id}`, contentType: 'collection' };
      return this.$store.dispatch('getMoreContent', serviceQuery);
    },

    articles() {
      const serviceArticles = this.$store.getters.getContentByService(
        'articles',
        this.serviceObject.slug,
        this.location,
      );

      if (serviceArticles.length > 0) {
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
    },
  },

  methods: {
    getAuthor(authorId) {
      const author = this.$store.getters.getAuthorById(Number(authorId));
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
