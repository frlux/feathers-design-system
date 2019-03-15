<template>
    <main class="background--white event" role="main">
    <breadcrumb :title="event.title"/>


        <article v-if="event">

            <header class="col-11 col-md-10 col-lg-6 m-auto p-lg-4">

                <heading class="event__title text--dark text--serif" v-html="event.title"></heading>

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
                                 :details="event.content"
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
                <div class="col-6 mr-1" v-for="contact in event.organizer"
                :key="contact.id">

                        <person contentContainerClass= "d-flex row mb-3 person" 
                                :name="contact.organizer"
                                :title="contact.description"
                                type="organizer"
                                :personObject="contact">
                                </person>
                      </div>
                      </div>

            </header>

            <section class="background--gray event__description">

                <div class="col-11 col-md-10 col-lg-6 m-auto pt-4 pb-4 p-lg-4">

                    <img :src="event.image.url" alt="">

                    <heading class="text--dark" level="h2">About</heading>

                    <div v-html="event.content"></div>

                    <heading class="text--dark" level="h3">When</heading>
                    {{event.start_date | moment("dddd, MMMM Do YYYY h:mm a")}}
                    &mdash; {{event.end_date | moment("dddd, MMMM Do YYYY h:mm a")}}

                    <heading class="text--dark" level="h3">Where</heading>

                    <router-link class="d-block text--dark text--underline" :to="{name:'locations-slug', params:{slug: event.venue.slug}}">{{ event.venue.venue }}</router-link>
                    <span class="d-block">{{ event.venue.address }}</span>
                    <span class="d-block">{{ event.venue.city }}, {{ event.venue.state }} {{ event.venue.zip }}</span>
                    <span class="d-block">{{ event.venue.phone }}</span>

                </div>
            </section>

        </article>

    </main>
</template>

<script>
import * as api from "../store/api.js";
import AddToCalendar from 'vue-add-to-calendar';
import Breadcrumb from "../elements/Breadcrumb.vue";
import Vue from 'vue';
import VueMoment from 'vue-moment';

import CallToAction from '../patterns/CallToAction.vue';
import Heading from '../elements/Heading.vue';
import Person from '../patterns/Person.vue';

Vue.use(AddToCalendar);
Vue.use(VueMoment);

export default {
  name: 'Event',

  components: {
    Breadcrumb,
    CallToAction,
    Heading,
    Person
  },

  computed: {
    author() {
      return this.$store.getters.getAuthorById(Number(this.event.author));
    },
  },
  data(){
    return{
      event: this.pageObject,
    }
  },  
  mounted(){

    if(this.pageObject){
      this.event = this.pageObject;
    } else {
    api.fetchData('events', {slug: this.$route.params.slug}).then(results=>{
        this.event = results.data[0];
        this.$store.commit('addMoreEvents', [this.event]);
      }); 
    }
  },
  props: {
    pageObject: {
      type: Object,
    },
    slug:{
      type: String,
    }
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
