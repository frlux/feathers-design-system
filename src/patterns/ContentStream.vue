<template>
  <section class="content" v-if="content" :key='apiContent.length+apiPage+apiType'>
    <template v-for="item in content">
      <!-- SERVICE CARD -->
      <template v-if="!item.type && item.taxonomy">
       <card v-if="item.taxonomy=='services'"
            class="card--background-gray mb-4"
            content-type="service"
            :copy="item.description"
            :heading="item.name"
            :key="item.id" style="min-height: 197px;">



          <template slot="action">
              <router-link class="button button--orange" :to="{name: 'services-slug', params: {slug:item.slug, pageObject: item}}">
                  {{ item.acf.button_text ? item.acf.button_text : 'Read more'}}
              </router-link>
          </template>

      </card>
       <card v-else-if="item.taxonomy=='locations'"
              :badge-label="item.name"
              class="card--background-gray"
              content-type="blog"
              :copy="item.description"
              :explainer="item.acf.city"
              :heading="item.name"
              heading-class="sr-only"
              :key="item.id" style="min-height: 197px;">
                <div slot="copy" class="row d-flex">
                  <div class="col-4 order-2 align-self-end">
                    <img :src="item.acf.building_image.url"/></div>
                                    <div class="col col-8 order-0">


                                    {{item.acf.phone}}
                    <address class="location__address mt-4 pt-4 border-top" itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">
                      <div class="location__street h4" itemprop="streetAddress">{{item.acf.address}}</div>
                      <div v-if="item.acf.mailing_address" class="location__mailing h4">{{item.acf.mailing_address}}</div>
                      <div class="location__city h4"><span itemprop="addressLocality">{{item.acf.city}}, {{item.acf.state}}</span> <span itemprop="postalCode">{{item.acf.zip}}</span></div>
                      <div class="location__fax my-3">Fax: <span itemprop="faxNumber">{{item.acf.fax}}</span></div>
                    </address>
                    </div>
                  </div>
            <template slot="action">
                <router-link class="button button--blue-alternate" :to="{name: 'locations-slug',params:{slug: item.slug, pageObject: item}}">More</router-link>
            </template>

        </card>
        <card v-else
              :badge-label="item.name"
              class="card--background-white"
              content-type="service"
              :copy="item.description"
              :explainer="item.taxonomy"
              :heading="item.name"
              :key="item.id" style="min-height: 197px;">

            <template slot="action">
                <router-link class="button button--orange" :to="{name: item.taxonomy+'-slug', params: {slug:item.slug, pageObject: item}}">More</router-link>
            </template>

        </card>
      </template>
        <!-- events card -->
        <template v-else-if="item.type=='event'">
        <event-card class="card--background-gray my-2"
                    :event="item"
                    :key="item.id"/><!-- end events card -->
        </template>
        <!-- blog template-->
        <template v-else-if="item.type=='post' && item.site_ID">
        <card :key="item.id"
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

        </card>
        </template><!-- end blog card -->
        <!-- pages card -->
        <template v-else-if="item.type=='page' || (item.type=='post' && !item.site_ID)">
        <card :badge-label="type =='pages' || item.type=='page' ? 'Information' : 'Article'"
              :heading="item.title && item.title.rendered ? item.title.rendered : item.title"
              :class="type =='pages' || item.type=='page' ? 'card--background-white text--dark border' : 'card--background-gray'"
              content-type="blog"
              :key="item.id"
              class="my-2">
          <div slot="copy">
            {{ item.content && item.content.rendered ? getExcerpt(item.content.rendered) : getExcerpt(item.content) }}
          </div>

          <template slot="action">
            <router-link class="button" :class="type =='pages' || item.type=='page' ? 'button--aqua' : 'button--orange'" :to="{name: item.type=='page' ? 'pages-slug' : 'articles-slug', params:{pageObject: item, slug: item.slug}}">More</router-link>
          </template>

        </card>
        </template><!-- end pages card -->
        

      <!--collection card-->
      <template v-else-if="item.type=='collection-item'">
      <collection-item class="card--background-blue-dark my-2"
                      :item="item"
                      heading-level="h3"
                      :key="item.id"
                      subheading-class="mt-1 text--white"
                      subheading-level="h4"/><!--end collection card-->
      </template>

    

        <!-- pages card -->
        <template v-else>
        <card :badge-label="item.type && item.type=='resources' ? 'Resource' : ' '"
              :sub-explainer="item.type ? item.type.toUpperCase() : item.taxonomy ? item.taxonomy.toUpperCase() : ''"
              :heading="item.title && item.title.rendered ? item.title.rendered :item.title ? item.title : item.acf.name"
              class='card--background-blue-dark text--white my-2'
              content-type="resource"
              :key="item.id">
          <div slot="copy">
            {{ item.content && item.content.rendered ? getExcerpt(item.content.rendered) : item.content? getExcerpt(item.content): item.description ? getExcerpt(item.description) : getExcerpt(item.acf.description) }}
          </div>

          <template slot="action">
            <router-link class="button button--teal" :to="{name:item.type+'-slug', params:{pageObject: item, slug: item.slug}}">More</router-link>
          </template>

        </card><!-- end pages card -->
        </template>
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
        return this.paged[this.page-1];
      }
      if(!this.apiType && !this.paged){
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
  },
  created(){
    this.$root.$on('resetpage', () => {
      this.paged=null; 
      this.page=1;
    })
  },
  data() {
    return {
      page: 1,
      apiPage: 1,
      apiTotal: 0,
      apiContent:[],
      paged:null,
      taxonomies:[]
    };
  },
  methods: {
    async fetchData(){
      if(!this.apiType){
        console.log(this.apiType);
        return;
      }
      const params = this.getParams(this.apiType, this.page);
      const results = await api.fetchData(this.apiType, params);
      this.apiTotal = this.apiType != 'posts' && results ? Number(results.headers['x-wp-total']) : results && results.data && results.data.found ? results.data.found : 0;
      this.apiContent = this.apiType != 'posts' && results ? results.data : results && results.data ? results.data.posts: [];
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
        if(type !== 'events' && !this.taxonomies.includes(type)){
          params.after = moment(this.selectedDate, 'YYYY-MM-DD').subtract(14, 'days').format('YYYY-MM-DD');
          params.before = moment(this.selectedDate, 'YYYY-MM-DD').add(14, 'days').format('YYYY-MM-DD');
        } else if(type=='events'){
          params.start_date = this.selectedDate;
        }
      }
      return params;
    },

    filterContent(filter, datestring, library){

      let content = !datestring ? this.contents : this.contents.filter(
          item => (item.type && item.type == 'event' && 
            `${item.start_date_details.year}-${
              item.start_date_details.month
            }-${item.start_date_details.day}` >= datestring) 
            || ((item.type && item.type != 'event') && (item.modified.substring(0,7) == this.selectedDate || item.date.substring(0, 7) == this.selectedDate.substring(0,7)))
        );

      //Filter Events by library
       content = !library || library == 'all' ? content : content.filter(
          item => item.acf && item.acf.location && item.acf.location.some(location => location.slug === library)
        );
      //Filter by terms
      //console.log(this.termFilter);
      if(this.termFilter){
        console.log(this.termFilter);
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
      if(this.apiType){
        const results = this.fetchData().then(results=>{
          this.apiContent = this.apiType != 'posts' && results ? results.data :results && results.data && results.data.posts ? results.data.posts : [];
          }
        ); 
      }
      this.$router.push({query:{page: this.page}})
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
    if(this.apiType){
      const results = this.fetchData().then(results=>{
        this.apiTotal = this.apiType != 'posts' && results ? Number(results.headers['x-wp-total']) : results && results.data && results.data.found ? results.data.found : 0;
        this.apiContent = this.apiType != 'posts' && results ? results.data :results && results.data && results.data.posts ? results.data.posts : [];
        }
      );
    }
    this.taxonomies = Object.keys(api.content).filter( key => api.content[key].content == 'taxonomy');
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
