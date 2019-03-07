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
          <router-link class="button" :class="type =='pages' ? 'button--aqua' : 'button--orange'" :to="{name:'Channel'+'-'+type, params:{pageObject: item, slug: item.slug, type: type}}">More</router-link>
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
          <router-link class="button button--aqua" :to="{name: 'Channel-slug', params:{type: 'blog', slug: item.slug, pageObject: item}}">
            Info
          </router-link>
        </template>

      </card><!-- end blog card -->
    </template>

    <pagination v-if="total > 0"
                :key="total"
                :total="Math.ceil(total/perPage)"
                v-model="page">
    </pagination>
  </section>
  
</template>

<script>
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
    total(){
      return this.contents.length;
    },
    content(){
      return chunk(this.contents, this.perPage);
    }
  },
  data() {
    return {
      page: 1,
    };
  },
  methods: {
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
      default: 5
    }
  },
};
</script>

<style lang="scss">
</style>
