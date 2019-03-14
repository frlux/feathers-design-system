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
                          @clearcontentfilter="clearFilter()"
                          contentName="event"/>

                    </div>

                    <div class="col col-lg-8">
                      
                        <filter-results :total="total"
                                        :selectedDate="selectedDate"
                                        :filter="q"
                                        :location="library"
                                        contentName="event"/>

                        <content-stream :contents="eventsContainer"
                                        type="events"
                                        @totalresults="total=$event"
                                        :filter="q"
                                        :selected-date="selectedDate"
                                        :location="library"/>
                        
            
                        
                    </div>

                </div>

            </div>
        </section>
    </main>
</template>

<script>
import * as api from '../store/api.js';
import ContentStream from "../patterns/ContentStream.vue";
import ContentSearch from '../elements/ContentSearch.vue';
import FilterResults from '../elements/FilterResults.vue';

export default {
  name: 'Events',

  components: {
    ContentSearch,
    ContentStream,
    FilterResults,
  },

  computed: {
    eventCount() {
      return this.$store.state.counts.events;
    },
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
      const params = {page: this.eventsApi.page, per_page: this.eventsApi.per_page};

      api.fetchData('events', params)
          .then(response =>{
            if(this.$store.state.counts.events != response.headers['x-wp-total']){
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
      q(){
        this.$root.$emit('resetpage')
    },
      library(){
        //this.page=1;
        this.$root.$emit('resetpage')
      },
      selectedDate(){
        //this.page=1;
        this.$root.$emit('resetpage')
      },
    },
  mounted() {
    this.getMoreEvents();
    this.q= !this.q ? this.filter : this.q;
    this.$root.$on('inputData', data=>{
      this.q=data;
    });
    this.$root.$on('resetPage', data=>{
      this.page=1;
    });
  },
  beforeMount(){
    this.eventsContainer = this.$store.state.events;
    if(this.$route.query.search){
      this.q=this.$route.query.search;
    }
    if(this.$route.query.location){
      this.library = this.$route.query.location;
    }
    if(this.$route.query.date ){
      this.selectedDate = this.$route.query.date
    }
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
