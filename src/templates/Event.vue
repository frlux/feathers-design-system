<template>
    <main class="background--white event" role="main">

        <article>

            <header class="col-11 col-md-10 col-lg-6 m-auto p-lg-4">

                <heading class="event__title text--dark text--serif">{{ event.title }}</heading>

                <span class="event__time text--dark">
                    {{event.start_date | moment("dddd, MMMM Do YYYY h:mm a")}} &mdash;
                    {{event.end_date | moment("dddd, MMMM Do YYYY h:mm a")}}
                </span>

                <div class="heading__separator"></div>

                <p class="event__excerpt" v-if="event.excerpt" v-html="event.excerpt"></p>

                <add-to-calendar :title="event.title"
                                 :location="event.venue.venue"
                                 :start="new Date(`${event.start_date}`)"
                                 :end="new Date(`${event.end_date}`)"
                                 :details="event.description"
                                 inline-template>

                    <div class="mb-3">

                        <google-calendar class="button button--blue-alternate" id="google-calendar">
                            Add to Google Calendar
                        </google-calendar>

                        <microsoft-calendar class="button button--blue-alternate" id="microsoft-calendar">
                            Add to Microsoft Live Calendar
                        </microsoft-calendar>

                    </div>
                </add-to-calendar>

                <div class="d-flex">
                    <div class="col-6">
                        <div class="align-items-center background--gray card d-flex row mb-3 person">

                            <div class="person__avatar">
                                <img class="rounded-circle" :src="author.avatar_urls['96']" alt="">
                            </div>

                            <div class="person__content">
                                <p class="align-items-center mt-3">
                                    <span class="text--dark text--bold text--underlined person__name">{{ author.name }}</span> <br>
                                    <span class="text--small text--dark">No Position Added Yet</span>
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </header>

            <section class="background--gray event__description">

                <div class="col-11 col-md-10 col-lg-6 m-auto pt-4 pb-4 p-lg-4">

                    <img :src="event.image.url" alt="">

                    <heading class="text--dark" level="h2">About</heading>

                    <div v-html="event.description"></div>

                    <heading class="text--dark" level="h3">When</heading>
                    {{event.start_date | moment("dddd, MMMM Do YYYY h:mm a")}}
                    &mdash; {{event.end_date | moment("dddd, MMMM Do YYYY h:mm a")}}

                    <heading class="text--dark" level="h3">Where</heading>

                    <router-link class="d-block text--dark text--underline" :to="`/location/${event.venue.slug}`">{{ event.venue.venue }}</router-link>
                    <span class="d-block">{{ event.venue.address }}</span>
                    <span class="d-block">{{ event.venue.city }}, {{ event.venue.state }} {{ event.venue.zip }}</span>
                    <span class="d-block">{{ event.venue.phone }}</span>

                </div>
            </section>

        </article>

    </main>
</template>

<script>
import AddToCalendar from 'vue-add-to-calendar';
import axios from 'axios';
import Vue from 'vue';
import VueMoment from 'vue-moment';

import CallToAction from '../patterns/CallToAction.vue';
import Heading from '../elements/Heading.vue';

Vue.use(AddToCalendar);
Vue.use(VueMoment);

export default {
  name: 'Event',

  components: {
    CallToAction,
    Heading,
  },

  computed: {
    event() {
      return this.$store.getters.getEventBySlug(this.slug);
    },
  },

  data() {
    return {
      author: {},
    };
  },

  methods: {
    getAuthor() {
      axios.get(`https://fontana.librarians.design/wp-json/wp/v2/users/${this.event.author}`)
        .then(({ data }) => {
          this.author = data;
        });
    },
  },

  mounted() {
    this.getAuthor();
  },

  props: {
    slug: {
      required: true,
      type: String,
    },
  },
};
</script>

<style lang="scss">
.person {
  display: flex;

  &__avatar {
    margin-left: 1rem;
    margin-right: 1rem;
    max-width: 64px;
    width: 25%;
  }
}

.person__avatar img {
  max-width: 100%;
  vertical-align: bottom;
}
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
