<template>
    <main class="channel" role="main">
        <template v-for="(call, index) in callsToAction" v-if="index === 0">
            <call-to-action :action="call.acf.action"
                            class="p-3"
                            :copy="call.acf.copy"
                            image="https://source.unsplash.com/random"
                            :heading="call.acf.heading"></call-to-action>
        </template>

        <header class="background--white d-flex p-4">

            <div class="col-md-10 m-auto">

                <div class="col-md-8">

                    <heading class="channel__title text--dark text--serif" level="h1">
                        {{ channelTitle }}
                    </heading>

                    <p class="channel__description">{{ channelDescription }}</p>

                </div>

            </div>

        </header>

        <section class="background--white library__section p-3">

            <div class="col-lg-10 m-lg-auto">

                <div class="d-md-flex">


                    <div class="col-md-4">
                        Sidebar
                    </div>

                    <div class="col col-lg-8">

                        <template v-if="network === 'blog'">

                            <template v-for="post in posts">

                                <card class="card--background-gray text--dark"
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

                        </template>

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

export default {
  name: "Channel",

  components: {
    CallToAction,
    Card,
    Heading,
  },

  computed: {
    callsToAction() {
      return this.$store.getters.getCallsToActionByCategory(this.slug);
    },

    collection() {
      return this.$store.getters.getContentByService("collection", this.slug);
    },

    pages() {
      return this.$store.getters.getContentByService("pages", this.slug);
    },

    posts() {
      return this.$store.state.posts;
    },

    service() {
      return this.$store.getters.getServiceBySlug(this.slug);
    }
  },

  props: {
    channelDescription: {
      type: String,
    },

    channelTitle: {
      required: true,
      type: String,
    },

    network: {
      type: String,
    },

    slug: {
      default: "any",
      required: true,
      type: String
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
