<template>

    <div>
        <router-link class="d-block event link link--undecorated"
                     :to="`/events/${event.slug}`">

            <card class="mb-3"
                  content-type="event"
                  :explainer="event.start_date | moment('dddd, MMMM Do YYYY h:mm a')"
                  :heading="event.title"
                  :sub-explainer="event.venue.venue">

                <template slot="copy">
                    {{ getExcerpt(event) }}
                </template>
            </card>

        </router-link>

    </div>

</template>

<script>
import Vue from 'vue';
import VueMoment from 'vue-moment';

import Card from './Card.vue';
import Heading from '../elements/Heading.vue';

Vue.use(VueMoment);

export default {
  name: 'EventCard',

  component: {
    Card,
    Heading,
  },

  methods: {
    /**
     * If the excerpt property is set we will prefer that,
     * otherwise we can grab the content of the event itself.
     * However, that content includes markup, so we'll use a little trick
     * to render the text without any html;
     * @param event
     * @returns {string | null}
     */
    getExcerpt(event) {
      const excerpt = event.excerpt ? event.excerpt : event.description;
      const excerptContainer = document.createElement('div');

      excerptContainer.innerHTML = excerpt;

      return excerptContainer.textContent;
    },
  },

  props: {
    headingLevel: {
      type: String,
    },

    subheadingClass: {
      type: String,
    },

    subheadingLevel: {
      default: 'h3',
      type: String,
    },

    event: {
      required: true,
      type: Object,
    },

    variant: {
      type: String,
    },
  },
};
</script>

<style lang="scss">
.event {
    &.link {
        &:focus,
        &:hover {
            box-shadow: $box-shadow-small;
        }

        transition: all .2s ease-out;
    }
}
</style>
