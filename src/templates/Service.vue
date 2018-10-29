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

                            <p class="text--large">
                                These service pages are what we call <b>channels</b>, and they rely on
                                content -- like books, events, tutorials, and the like -- that all share
                                the same common taxonomy to self generate, so that we can present relevant
                                collection items and events on the fly.
                            </p>

                            <p class="text--large">
                                Right now, there's not enough content to self generate. Hooray for betas!
                            </p>

                        </div>
                    </div>

                </div>

            </section>

        </template>

    </main>
</template>

<script>
import CallToAction from '../patterns/CallToAction.vue';
import Heading from '../elements/Heading.vue';

export default {
  name: 'Service',

  components: {
    CallToAction,
    Heading,
  },

  computed: {
    callsToAction() {
      return this.$store.getters.getContentByService(
        'callsToAction',
        this.serviceObject.slug,
        this.location,
      );
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
