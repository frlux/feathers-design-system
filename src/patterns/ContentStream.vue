<template>
  <section class="content" v-if="content" :key='apiContent.length+apiPage+apiType'>
    {{ apiContent.length+apiPage+apiType}}
    <template v-for="item in content">
      
        <!-- events card -->
        <event-card v-if="type=='events' || item.type=='event'"
                    class="card--background-gray my-2"
                    :event="item"
                    :key="item.id"/><!-- end events card -->

        <!-- pages card -->
        <card v-else-if="(type == 'pages' || type=='articles') || ((item.type=='post' || item.type=='page') && !item.site_ID)"
              :badge-label="type =='pages' || item.type=='page' ? 'Information' : 'Article'"
              :heading="item.title.rendered"
              :class="type =='pages' || item.type=='page' ? 'card--background-white text--dark border' : 'card--background-gray'"
              content-type="blog"
              :key="item.id"
              class="my-2">
          <div slot="copy">
            {{ getExcerpt(item.content.rendered) }}
          </div>

          <template slot="action">
            <router-link class="button" :class="type =='pages' || item.type=='page' ? 'button--aqua' : 'button--orange'" :to="{name: item.type=='page' ? 'pages-slug' : 'articles-slug', params:{pageObject: item, slug: item.slug}}">More</router-link>
          </template>

        </card><!-- end pages card -->

      <!--collection card-->
      <collection-item v-else-if="type == 'collection' || item.type=='collection-item'"
                      class="card--background-blue-dark my-2"
                      :item="item"
                      heading-level="h3"
                      :key="item.id"
                      subheading-class="mt-1 text--white"
                      subheading-level="h4"/><!--end collection card-->

      <!-- blog template-->
        <card v-else-if="type=='blog' || item.type=='post'"
              :key="item.id"
              class="card--background-white text--dark border my-2"
              content-type="blog"
              :explainer="item.author.nice_name"
              :sub-explainer="item.date | moment('dddd, MMMM Do')"
              :heading="item.title">

          <div slot="copy">
            <div v-html="item.excerpt"></div>
          </div>

          <template slot="action">
            <router-link class="button button--aqua" :to="{name: 'blog-slug', params:{slug: item.slug, pageObject: item}}">
              Info
            </router-link>
          </template>

        </card><!-- end blog card -->
        <!-- pages card -->
        <card v-else
              :badge-label="item.type=='resources' ? 'Resource' : ' '"
              :sub-explainer="item.type.toUpperCase()"
              :heading="item.title.rendered || item.title"
              class='card--background-blue-dark text--white my-2'
              content-type="resource"
              :key="item.id">
          <div slot="copy">
            {{ getExcerpt(item.content && item.content.rendered? item.content.rendered: item.content? item.content: item.description ? item.description : item.acf.description) }}
          </div>

          <template slot="action">
            <router-link class="button button--teal" :to="{name:item.type+'-slug', params:{pageObject: item, slug: item.slug}}">More</router-link>
          </template>

        </card><!-- end pages card -->
    </template>

    <pagination v-if="total > 0"
                :key="total"
                :total="Math.ceil(total/perPage)"
                v-model="page"
                v-on:resetpage="page=1">
    </pagination>
  </section>
  
</template>

<script>
import * as api from '../store/api.js';
import Card from '../patterns/Card.vue';
import EventCard from '../patterns/EventCard.vue';
import CollectionItem from '../patterns/CollectionItem.vue';
import Pagination from '../elements/Pagination.vue';
import { chunk } from 'lodash';
import moment from 'moment';

export default {
  name: 'Stream',
  components: {
    Card,
    EventCard,
    CollectionItem,
    Pagination
  },
  computed: {
    content(){
      if(!this.apiType && this.paged){
        console.log('saved...');
        return this.paged[this.page-1];
      }
      if(!this.apiType && !this.paged){
        console.log('re-paging...');
        let content = this.filterContent(this.filter, this.selectedDate, this.location);
        this.paged = chunk(content, this.perPage);
        return this.paged[this.page-1];
      }

      return this.apiContent; 
    },

    total(){
      this.$emit('totalresults', this.apiTotal);
      return this.apiTotal;
    },
    taxonomies(){
      return Object.keys(api.content).filter( key => api.content[key].content == 'taxonomy');
    }

  },
  created(){
    this.$root.$on('resetpage', () => {
      this.page=1;
      this.paged=null; 
    })
  },
  data() {
    return {
      page: 1,
      apiPage: 1,
      apiTotal: 0,
      apiContent:[],
      paged:null
    };
  },
  methods: {
    async fetchData(){
      const params = this.getParams(this.apiType, this.page);
      const results = await api.fetchData(this.apiType, params);
      this.apiTotal = this.apiType != 'posts' ? Number(results.headers['x-wp-total']) : results.data.found;
      this.apiContent = this.apiType != 'posts' ? results.data : results.data.posts;
      return results;
    },
    getParams(type, page){      
      let params = this.apiParams ? this.apiParams : {};
      if(type != 'posts'){
        params.per_page = this.perPage;
      } else{
        params.number = this.perPage;
      }

      params.page = page;

      if(this.filter){
        params.search = this.filter;
      }
      if(this.location && type != 'posts'){
        let loc = this.$store.state.locations.find(location => location.slug === this.location);
        params.locations = loc.id;
      } else if (this.location) {
        params.tag=this.location;
      }

      if(this.selectedDate){
        if(type !== 'events' && !this.taxonomies.include(type)){
          params.after = moment(this.selectedDate, 'YYYY-MM-DD').subtract(14, 'days');
          params.before = moment(this.selectedDate, 'YYYY-MM-DD').add(14, 'days');
        } else if(type=='events'){
          params.start_date = this.selectedDate;
        }
      }
      return params;
    },
    async fetchContent(type,params){
      api.fetchData(type, params)
          .then(response =>{
            const total = type!=='posts' ? Number(response.headers['x-wp-total']) : Number(response.data.found);
            return response.data
          }).catch(error=> console.log(error));

    },
    filterContent(filter, datestring, library){
      let content = !datestring ? this.contents : this.contents.filter(
          item => (item.type && item.type == 'event' && 
            `${item.start_date_details.year}-${
              item.start_date_details.month
            }-${item.start_date_details.day}` >= datestring) 
            || item.type && item.type != 'event' && item.modified.substring(0,7) == this.selectedDate || item.date.substring(0, 7) == this.selectedDate.substring(0,7)
        );

      //Filter Events by library
       content = !library || library == 'all' ? content : content.filter(
          item => item.acf && item.acf.location && item.acf.location.some(location => location.slug === library)
        );
      //Filter by terms
      if(this.termFilter && this.termFilter.length > 0){
        for (const [taxonomy, value] of Object.entries(this.termFilter)){
          if(taxonomy && value && value.length > 0){
          content = content.filter(item => item[taxonomy] && item[taxonomy].some(val =>value.includes(val)))
          }
        }
      }

      // Filter events by Query String
      let value = filter ? filter.toLowerCase() : null;
      content = !value ? content : content.filter(item => 
                  Object.keys(item).some(key => item[key] != null && 
                  item[key].toString().toLowerCase().includes(value) || Object.keys(item[key]).some(k => item[key][k] !== null &&
                  item[key][k].toString().toLowerCase().includes(value) )
                  ));

        this.apiTotal = content.length;
        return content;
    },
    getExcerpt(excerpt) {
      if(!excerpt || excerpt.length === 0){
        return "";
      }
      const excerptContainer = document.createElement('div');
      excerptContainer.innerHTML = excerpt;
      let content = excerptContainer.value;
      
      return excerptContainer.textContent.length > 200
        ? `${excerptContainer.textContent.substring(0, 200)} ...`
        : excerptContainer.textContent;
    },
  },
  watch:{
    page(){
      const results = this.fetchData().then(results=>{
        this.apiContent = this.apiType != 'posts' ? results.data : results.data.posts;
        }
      ); 
    },
    /* filter(){
      const results = this.fetchData().then(results=>{
        this.apiContent = this.apiType != 'posts' ? results.data : results.data.posts;
        }
      );
    },
    location(){
      const results = this.fetchData().then(results=>{
        this.apiContent = this.apiType != 'posts' ? results.data : results.data.posts;
        }
      );
    }, */
    contents(){
      this.paged=null;
    },
  },
  created(){
    const results = this.fetchData().then(results=>{
      this.apiTotal = this.apiType != 'posts' ? Number(results.headers['x-wp-total']) : results.data.found;
      this.apiContent = this.apiType != 'posts' ? results.data : results.data.posts;
      }
    );
  }, 
  beforeMount(){
    if(this.$route.query.page > 1){
      this.page=this.$route.query.page;
    }
    if(this.$route.query.search){
      this.q=this.$route.query.search;
    }
  },
  props: {
    contents: {
      type: Array,
    },
    type:{
      type: String,
      default: 'mixed'
    },
    perPage:{
      type: Number,
      default: 5
    },
    apiType:{
      type: String
    },
    apiParams:{
      type: Object
    },
    filter:{
      type: String
    },
    selectedDate:{
      type: String,
    },
    location:{
      type: String,
    },
    termFilter:{
      type: Object
    }
  },
};
</script>

<style lang="scss">
</style>
