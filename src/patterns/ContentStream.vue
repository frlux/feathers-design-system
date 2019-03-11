<template>
  <section class="content" v-if="content">

    <template v-for="item in content[page-1]">
      <!-- events card -->
      <event-card v-if="type=='events' || item.type=='event'"
                  class="card--background-gray"
                  :event="item"
                  :key="item.id"/><!-- end events card -->

      <!-- pages card -->
      <card v-else-if="(type == 'pages' || type=='articles') || ((item.type=='post' || item.type=='page') && !item.site_ID)"
            :badge-label="type =='pages' ? 'Information' : 'Article'"
            :heading="item.title.rendered"
            :class="type =='pages' ? 'card--background-white text--dark' : 'card--background-gray'"
            content-type="blog"
            :key="item.id">
        <div slot="copy">
          {{ getExcerpt(item.content.rendered) }}
        </div>

        <template slot="action">
          <router-link class="button" :class="type =='pages' || item.type=='page' ? 'button--aqua' : 'button--orange'" :to="{name: item.page=='page'? 'pages-slug' : 'articles-slug', params:{pageObject: item, slug: item.slug}}">More</router-link>
        </template>

      </card><!-- end pages card -->

    <!--collection card-->
    <collection-item v-else-if="type == 'collection' || item.type=='collection-item'"
                    class="card--background-blue-dark"
                    :item="item"
                    heading-level="h3"
                    :key="item.id"
                    subheading-class="mt-1 text--white"
                    subheading-level="h4"/><!--end collection card-->

    <!-- blog template-->
      <card v-else-if="type=='blog' || item.type=='post'"
            :key="item.id"
            class="card--background-white text--dark border my-1"
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
            :explainer="item.type.toUpperCase()"
            badge-label=" "
            :heading="item.title.rendered || item.title"
            class='card--background-blue-alternate text--white my-2'
            content-type="blog"
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
                v-model="page">
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
      if(!this.apiType){
        let c= chunk(this.contents, this.perPage);
        console.log(c);
        return c
      }
      let params = this.apiParams;
      params.per_page = this.perPage;
      params.page = this.page;
      
      const results = this.api.fetchData(this.apiType, params);
      this.apiTotal = results.headers['x-wp-total'];
      return results.data;
    },
    total(){
      if(!this.apiType){
        return this.contents.length;
      }
      return this.apiTotal;
    },

  },
  data() {
    return {
      page: 1,
      apiTotal: 0,
    };
  },
  methods: {
    async fetchContent(type,params){
      api.fetchData(type, params)
          .then(response =>{
            const total = response.headers['x-wp-total'];
            return response.data
          }).catch(error=> console.log(error));

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
  },
};
</script>

<style lang="scss">
</style>
