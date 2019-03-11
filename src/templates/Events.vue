<template>

    <main class="channel" role="main">

        <header class="background--white d-flex p-4">

            <div class="col-md-10 m-auto">

                <div class="col-md-8">

                    <heading class="channel__title text--dark text--serif"
                             level="h1">
                        Events
                    </heading>

                    <p class="channel__description">
Through partnerships in the community, we are able to bring you art and historical exhibits, teach workshops, invite performers and speakers, provide nationally recognized children's programming, and more.
                    </p>

                </div>

            </div>

        </header>

        <section class="background--white library__section p-3">

            <div class="col-lg-10 m-lg-auto">

                <div class="d-md-flex">

                    <div class="col col-md-6 col-lg-4">
                      <content-search :date-filter="true"
                          :selected-date="selectedDate" @selectdate="selectedDate = $event"
                          :filter="q" @querycontent="q=$event"
                          :library="library" @filterlibrary="library = $event"
                          @clearcontentfilter="clearFilter()"/>

                    </div>

                    <div class="col col-lg-8">
                        <filter-results :total="total"
                                        :selectedDate="selectedDate"
                                        :filter="q"
                                        :location="library"
                                        contentName="event"/>
                        <!-- <div class="alert alert--primary mb-3 pl-4 pr-4" v-if="q || library || total">
                            <heading v-if="q || library" class="h3 text--dark text--serif" level="h2">Search</heading>
                            <p class="channel__subtitle mt-1 text--dark text--sans"
                               v-if="q || library">
                                Here is everything we can find that matches your search
                                {{ q ? 'for' : '' }} <mark class="mark">{{ q }}</mark>
                                <template v-if="library && locationDetails">happening at <router-link class="link" :to="{name: 'locations-slug', params:{slug: locationDetails.slug, pageObject: locationDetails}}">{{ locationDetails.name }}</router-link></template>.
                            </p>
                            

                            <p class="channel__subtitle text--dark text--large" v-if="selectedDate">
                                Here are all the events that match your search for "{{ selectedDate }}".
                            </p>
                            <div v-if="total > 0" v-html="total==1 ? '1 event found.' : total + ' events found.'" class="events__total text--dark text--sans m-2">
                        </div>
                        </div> -->

                        <template v-for="event in filteredEvents[page-1]">

                            <event-card v-if="event"
                                        class="card--background-gray"
                                        :event="event"
                                        :key="event.id"
                                        :class="{ current: event.start_date_details && event.start_date_details.year && `${event.start_date_details.year}-${event.start_date_details.month}-${event.start_date_details.day}` === selectedDate}"/>

                        </template>

                        
                        <pagination
                        v-if="total > 0"
                        :key="total"
                        :total="Math.ceil(total/perPage)"
                        v-model="page"></pagination>
                        
                    </div>

                </div>

            </div>
        </section>
    </main>
</template>

<script>
import flatpickr from 'flatpickr';
import EventCard from '../patterns/EventCard.vue';
import * as api from '../store/api.js';
import Pagination from '../elements/Pagination.vue';
import { chunk } from 'lodash';
import ContentSearch from '../elements/ContentSearch.vue';
import FilterResults from '../elements/FilterResults.vue';

window.axios = require('axios');

export default {
  name: 'Events',

  components: {
    ContentSearch,
    EventCard,
    Pagination,
    FilterResults
  },

  computed: {

    eventCount() {
      return this.$store.state.counts.events;
    },

    filteredEvents() {
      //Filter events by selected Date
      let events = !this.selectedDate ? this.eventsContainer : this.eventsContainer.filter(
          event =>
            `${event.start_date_details.year}-${
              event.start_date_details.month
            }-${event.start_date_details.day}` >= this.selectedDate
        );
      //Filter Events by library
       events = !this.library || this.library == 'all' ? events : events.filter(
          event => event.acf.location && event.acf.location.some(location => location.slug === this.library)
        );
      // Filter events by Query String
     /*  events = !this.filter ? events : events.filter(event =>
        event.title.toLowerCase().includes(this.filter.toLowerCase())
      ); */
      let value = this.q ? this.q.toLowerCase() : null;
      events = !value ? events : events.filter(event => 
                  Object.keys(event).some(key => event[key] != null && 
                  event[key].toString().toLowerCase().includes(value) || Object.keys(event[key]).some(k => event[key][k] !== null &&
                  event[key][k].toString().toLowerCase().includes(value) )
                  ));

      this.total = events.length;

      return chunk(events, this.perPage);
    }
  },

  data() {
    return {
      selectedDate: null,
      library: this.location,
      eventsContainer: [],
      total: 0,
      page: 1,
      q: this.filter,
      perPage: 5,
      eventsApi: {
        per_page:100,
        page: 1,
      },
    };
  },

  methods: {
    clearFilter() {
      this.selectedDate = null;
      this.q = null;
      this.library = null;
      this.page = 1;
    },

  getMoreEvents() {
      while(Math.ceil(this.$store.state.counts.events/this.eventsApi.per_page) >= this.eventsApi.page){
        this.fetchEvents();
        this.eventsApi.page++;
      }
    },

    fetchEvents(){
      console.log("fetching...");
      
      const params = {page: this.eventsApi.page, per_page: this.eventsApi.per_page};

      api.fetchData('events', params)
          .then(response =>{
            if(this.$store.state != response.headers['x-wp-total']){
              this.$store.commit('addCount',{type: 'events', count: response.headers['x-wp-total']});
            }
            this.addEvents(response.data);
          }).catch(error=> console.log(error));
    },
    addEvents(data){
      if(!this.eventsContainer || this.eventsContainer.length == 0){
        this.eventsContainer = data;
      } else{
        for (let i=0; i < data.length; i++){
          const index = this.eventsContainer.findIndex(item => item.id === data[i].id)
          if (index === -1){ 
            this.eventsContainer.push(data[i]);
          }
        }
      }

      if(this.eventsContainer.length > 0){
          this.eventsContainer.sort(function(a,b){
              let date1 = new Date(a.start_date);
              let date2 = new Date(b.start_date);
              return date1.getTime() - date2.getTime()});
        }

    },
  },
    watch:{
      q: function(newValue, oldValue){
        this.page=1;
    },
      library(){
        this.page=1;
      },
      selectedDate(){
        this.page=1;
      },

    },
  mounted() {
    this.getMoreEvents();
    this.q=this.filter;
    this.$root.$on('inputData', data=>{
      this.q=data;
    });
    this.$root.$on('resetPage', data=>{
      this.page=1;
    });
  },
  beforeMount(){
    this.eventsContainer = this.$store.state.events;
  },
  props: {
    filter: {
      type: String,
    },
    location: {
      default: '',
      type: String,
    },
  },
};
</script>
