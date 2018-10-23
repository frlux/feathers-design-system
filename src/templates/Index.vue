<template>

  <component :is="type" class="library">

    <main role="main">

      <template v-for="(call, index) in callsToAction" v-if="index === 0">
        <call-to-action :action="call.acf.action"
                        :copy="call.acf.copy"
                        image="call.acf.image"
                        :heading="call.acf.heading"></call-to-action>
      </template>

      <section class="background--blue-alternate library__section pb-3 pl-md-2 pb-md-4 pt-md-4 pr-md-2">

        <div class="m-md-auto d-md-flex flex-md-wrap flex-xl-nowrap justify-content-md-between col-md-10 pl-md-0 pr-md-0 pt-4 pb-4">

          <template v-for="(event, index) in events" v-if="index === 0">

            <card class="card--background-blue-dark mb-3 mb-xl-0 col-md-12 col-xl-4"
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

          <card class="card--background-blue-dark mb-3 mb-md-0 col-md-6 col-xl-4 ml-xl-3 mr-xl-3"
                content-type="service"
                :copy="service.description"
                :heading="service.name" v-if="service">

            <template slot="action">

              <router-link class="button button--orange" :to="`/services/${service.slug}`">
                {{ service.acf.button_text ? service.acf.button_text : 'Read more'}}
              </router-link>

            </template>

          </card>

          <card class="card--background-blue-dark col-md-6 col-xl-4"
                content-type="collection"
                :copy="collectionItem.acf.abstract"
                :heading="collectionItem.title.rendered"
                v-if="collectionItem">

            <template slot="action">
              <router-link class="button button--pink" to="/events">Let's go</router-link>
            </template>

          </card>

        </div>

      </section>

      <section class="background--white library__section p-3">

        <div class="col-md-10 d-md-flex m-auto pb-4 pl-0 pr-0 pt-4">

          <div class="col-md-8 p-0">

            <card class="card--background-gray mb-3"
                  content-type="collection"
                  heading="New this week">

              <template slot="copy">

                <div class="d-flex flex-wrap">

                  <div class="col-6 col-md-2"
                       :key="item.id"
                       v-for="(item, index) in collection"
                       v-if="index < 6">

                    <a class="link link--undecorated" :href="`https://www.nccardinal.org/eg/opac/record/${item.acf.record_identifier}`">
                      <card content-container-class="p-0"
                            :heading="item.title.rendered"
                            heading-class="h4 text--bold text--nowrap text--ellipsis"
                            heading-level="h3"
                            :image="item._embedded['wp:featuredmedia'][0].source_url"
                            :subheading="`by ${item.acf.creators[0].name}`"
                            subheading-class="h5 mt-1 text--nowrap text--ellipsis"
                            subheading-level="h4">
                      </card>
                    </a>

                  </div>
                </div>

                <router-link class="link" to="/collection">See more</router-link>

              </template>

            </card>

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

    collectionItem() {
      return this.$store.getters.getRandomContentItem('collection');
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
