<template>
    <main class="channel" role="main">
        <template v-for="(call, index) in callsToAction">
            <call-to-action v-if="index === 0"
                            :key="index"
                            :action="call.acf.action"
                            :copy="call.acf.copy"
                            :image="call.acf.image"
                            :heading="call.acf.heading"
                            :link="call.acf.link" />
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
                       <div class="mt-3" style="width: 307.875px">
                            <div class="form-group">
                                <label class="form-label text--bold text--sans text--dark" for="channelSidebarFilter">
                                    Filter events by title
                                </label>

                                <input class="form-control"
                                       id="channelSidebarFilter"
                                       type="text"
                                       v-model.lazy="q"
                                       >
                            </div>

                            <div class="form-group">
                                <label class="form-label text--bold text--sans text--dark"
                                       for="channelSidebarLocation">
                                    Filter events by location
                                </label>

                                <select class="form-control"
                                        id="channelSidebarLocation"
                                        v-model="library">

                                    <option :key="location.id"
                                            :value="location.slug"
                                            v-for="location in locations">
                                        {{ location.name }}
                                    </option>

                                </select>
                            </div>

                            <button class="button button--blue-alternate"
                                    v-on:click="clearFilter">Clear Filter</button>
                        </div>
                    </div>

                    <div class="col col-lg-8">

                        <template v-if="network === 'blog' || network === 'pages' || network === 'articles'">
                          <content-stream :contents="content"
                                          :type="network" />

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
import ContentStream from "../patterns/ContentStream.vue";

export default {
  name: "Channel",

  components: {
    CallToAction,
    Card,
    Heading,
    ContentStream
  },

  computed: {
    callsToAction() {
      return this.$store.getters.getCallsToActionByCategory(this.slug);
    },

    collection() {
      return this.$store.getters.getContentByService("collection", this.slug);
    },
    locations(){
      return this.$store.state.locations;
    },
    pages() {
      return this.$store.getters.getContentByService("pages", this.slug);
    },
    
    posts() {
      return this.$store.state.posts;
    },

    service() {
      return this.$store.getters.getServiceBySlug(this.slug);
    },
    content(){
      return this.network==='blog' ? this.$store.state.posts : this.$store.state[this.network];
    }
  },
  data(){
    return{
      items: [],
    }
  },
  methods:{
    clearFilter() {
      const now = new Date();
      this.q = null;
      this.library = null;
      this.$root.$emit('resetpage');
    },

  },
  props: {
    channelDescription: {
      type: String,
    },

    channelTitle: {
      type: String,
      default: "Shelf Life in the Mountains"
    },

    network: {
      type: String,
      default:'blog'
    },
  },
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
