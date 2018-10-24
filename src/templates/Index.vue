<template>

  <component :is="type" class="library">

    <main role="main">

      <template v-for="(call, index) in callsToAction" v-if="index === 0">
        <call-to-action :action="call.acf.action"
                        :copy="call.acf.copy"
                        :image="call.acf.image"
                        :heading="call.acf.heading"
                        :link="call.acf.link"></call-to-action>
      </template>

      <section class="background--blue-alternate library__section pb-3 pl-md-2 pb-md-4 pt-md-4 pr-md-2">

        <div class="m-md-auto d-md-flex flex-md-wrap flex-xl-nowrap justify-content-md-between col-md-10 pl-md-0 pr-md-0 pt-4 pb-4">

          <card class="card--background-blue-dark mb-3 mb-xl-0 col-md-12 col-xl-4"
                content-type="event"
                :explainer="randomEventWithDescription.start_date"
                :sub-explainer="randomEventWithDescription.venue.venue"
                :heading="randomEventWithDescription.title"
                v-if="randomEventWithDescription">

            <div slot="copy" v-html="randomEventWithDescription.excerpt"></div>

            <template slot="action">
              <router-link class="button button--aqua" :to="`/events/${randomEventWithDescription.slug}`">
                Info
              </router-link>
            </template>

          </card>

          <div class="card card--background-blue-dark mb-3 mb-xl-0 col-md-12 col-xl-4 mr-xl-3 p-4"
                v-if="!randomEventWithDescription">

              <card class="card--background-blue-alternate d-block"
                    :class="[index !== 2 ? 'mb-3' : '']"
                    content-container-class="pl-4 pr-4 pt-4 pb-2"
                    content-type="event"
                    element="a"
                    :explainer="event.start_date"
                    :sub-explainer="event.venue.venue"
                    :heading="event.title"
                    heading-class="h4 text--white link--undecorated"
                    :href="`/events/${event.slug}`"
                    :key="event.id"
                    v-for="(event, index) in events"
                    v-if="index < 3"/>

          </div>

          <card class="card--background-blue-dark mb-3 mb-md-0 col-md-6 col-xl-4 ml-xl-3 mr-xl-3"
                content-type="service"
                :copy="service.description"
                :heading="service.name"
                v-if="service && randomEventWithDescription">

            <template slot="action">

              <router-link class="button button--orange" :to="`/services/${service.slug}`">
                {{ service.acf.button_text ? service.acf.button_text : 'Read more'}}
              </router-link>

            </template>

          </card>

          <collection-item class="card--background-blue-dark col-md-6 col-xl-4 mb-xl-0"
                           :class="[randomEventWithDescription ? 'col-xl-4' : 'col-xl-8']"
                           :item="randomCollectionItem"
                           heading-level="h3"
                           subheading-class="mt-1 text--white"
                           subheading-level="h4"
                           variant="feature"
                           v-if="randomCollectionItem" />

        </div>

      </section>

      <section class="background--white library__section p-3">

        <div class="col-md-10 d-md-flex m-auto pb-4 pl-0 pr-0 pt-4">

          <div class="col-md-8 p-0">

            <Showcase collection-link="/collection"
                      :collection-items="collection"
                      heading="New this week" />

             <template v-for="(event, index) in events" v-if="index === 1">

              <card class="card--background-gray"
                    content-type="event"
                    :explainer="event.start_date"
                    :sub-explainer="event.venue.venue"
                    :heading="event.title">

                <div slot="copy" v-html="event.excerpt"></div>

                <template slot="action">
                  <router-link class="button button--aqua" :to="`/events/${event.slug}`">
                    Info
                  </router-link>
                </template>

              </card>

            </template>

            <card class="card--background-white text--dark"
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

          </div>

          <div class="col-4 p-0">
            <call-to-action action="Call to Action"
                            copy="Data tells a powerful story --
                      about your content, who reads it, and what's possible"
                            image="https://source.unsplash.com/random"
                            heading="Watch the eclipse with us"></call-to-action>
          </div>


        </div>

      </section>

    </main>

  </component>

</template>

<script>
import CallToAction from "../patterns/CallToAction.vue";
import Card from "../patterns/Card.vue";
import CollectionItem from '../patterns/CollectionItem.vue';
import Showcase from '../patterns/Showcase.vue';

/**
 * Shows how to layout and structure a home page.
 */
export default {
  name: "Index",

  status: "prototype",

  release: "1.0.0",

  components: {
    CallToAction,
    Card,
    CollectionItem,
    Showcase,
  },

  computed: {
    callsToAction() {
      return this.$store.getters.getContentByService(
        'callsToAction',
        'any',
        this.location,
      );
    },

    collection() {
      return this.$store.state.collection;
    },

    randomCollectionItem() {
      const collectionItemsWithAbstracts = this.collection
        .filter(item => item.acf.abstract !== '' && item.acf.abstract.length < 280);
      return collectionItemsWithAbstracts[
        Math.floor(Math.random() * collectionItemsWithAbstracts.length)
      ];
    },

    randomEventWithDescription() {
      const eventsWithDescriptions = this.events
        .filter(event => event.excerpt !== ''
          && event.excerpt.length > 100
          && event.excerpts.length < 200);

      return eventsWithDescriptions[
        Math.floor(Math.random() * eventsWithDescriptions.length)
      ];
    },

    events() {
      return this.$store.state.events;
    },

    post() {
      return this.$store.state.posts[0];
    },

    /**
     * A random service <3.
     */
    service() {
      return this.$store.getters.getRandomContentItem("services");
    }
  },

  props: {
    location: {
      type: String
    },
    /**
     * The html element name used for the component.
     */
    type: {
      type: String,
      default: 'div',
    },
  },
};
</script>


<docs>
  ```jsx
  <index />
  ```
</docs>
