<template>
    <main class="service" role="main">

        <template v-if="serviceObject">

            <template v-for="(call, index) in callsToAction" >
                <call-to-action v-if="index === 0"
                                :key="call.id"
                                :action="call.acf.action"
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
                        <!-- BEGIN SIDEBAR -->
                        <div class="co col-md-6 col-lg-4">
                          <!-- begin load more content buttons -->
                          <!-- <div v-if="active=='channel'">
                            <a class="button button button--pink"
                                v-if="total.pages > pages.length || pages.length > 10"
                                @click="getMoreContent('pages');">
                                See More Information
                            </a>
                            <a class="button button button--pink"
                                v-if="total.articles > articles.length || articles.length > 10"
                                @click="getMoreContent('articles');">
                                See More Articles
                            </a>
                            <a class="button button button--pink"
                                v-if="total.collection > collection.length || collection.length > 10"
                                @click="getMoreContent('collection');">
                                See More Collection Items
                            </a>
                            <a class="button button button--pink"
                                v-if="total.events > events.length || events.length > 10"
                                @click="getMoreContent('events');">
                                See More Events
                            </a>
                          </div>
                          <div v-if="active !=='channel'">
                            <a class="button button button--aqua"
                                @click="backToChannel();">
                                Back to {{ serviceObject.name }} Channel
                            </a>
                          </div>  --><!--end load more content buttons -->
                          <!--end sidebar content-->
                        </div><!-- END SIDEBAR -->
                        
                        <!-- BEGIN MAIN CONTENT -->
                        <div class="col col-lg-8">

                            <!-- <Showcase v-if="collection"
                                      :collection-items="collection.slice(1,10)"
                                      heading="Related Materials" /> -->
                            <content-stream :contents="content"
                                          type="mixed" />
                            

                        </div><!-- END MAIN CONTENT COLUMN -->
                    </div>

                </div>

            </section>

        </template>

    </main>
</template>

<script>
import * as api from '../store/api.js';
import CallToAction from '../patterns/CallToAction.vue';
import Card from '../patterns/Card.vue';
import CollectionItem from '../patterns/CollectionItem.vue';
import ContentStream from "../patterns/ContentStream.vue";
import EventCard from '../patterns/EventCard.vue';
import Heading from '../elements/Heading.vue';
import Showcase from '../patterns/Showcase.vue';
import Pagination from '../elements/Pagination.vue';

export default {
  name: 'Service',

  components: {
    CallToAction,
    Card,
    CollectionItem,
    ContentStream,
    EventCard,
    Heading,
    Showcase,
    Pagination
  },

  computed: {
    callsToAction() {
      /* const serviceCTA = this.content.filter(item => item.type && item.type === 'actions');

      if (serviceCTA.length > 0) {
        return serviceCTA;
      }
      this.fetchContent('callsToAction', {services: this.serviceObject.id});*/
      let ctas = this.content.filter(item => item.type && item.type === 'actions')
      const payload = {contentType: 'callsToAction', content: ctas};
      this.$store.commit('addMoreContent', payload); 
      
      return this.content.length==0? null : ctas && ctas.length > 0 ? ctas : this.$store.getters.getContentByService('callsToAction', 'any', this.location) ;
    },
  },
  data(){
    return{
      content: [],
      count:{
        callsToAction: 1,
        events: 1,
        pages: 1,
        posts: 1,
        articles: 1,
        collection: 1,
        resources: 1,
      },
      page: 1,
      active: 'channel',
      events:[],
      actions:[],
    }
  },
  methods: {
    getAuthor(authorId) {
      const author = this.$store.getters.getAuthorById(Number(authorId));
      return author.name;
    },
    checkContent(store, min, num, name){
      const content = this.content.filter(item => item.type && item.type === name);
      this.fetchContent(store, {services: this.serviceObject.id, per_page: num});
    },
  async getContent(type, args=null){
      this.serviceObject._links['wp:post_type'].forEach(link=>{
        let name = link.href.match(/(?:\/([a-z|-]*?)\?)/);
        name=name[1]=='calls-to-action' ? 'callsToAction' : name[1];

        this.fetchContent(name, link.href);
      })
    }, 
    async fetchContent(type, link){
      console.log('fetching...');
      api.fetchLink(link)
          .then(response =>{
            this.count[type] = response.headers['x-wp-total'];
            this.addContent(response.data, type);
          }).catch(error=> console.log(error));
    },
    addContent(items,type){
      console.log(type);
      if(type == 'callsToAction' || type == 'events'){
        for (let i=0; i < items.length; i++){
        const index = this[type].findIndex(item => item.id === items[i].id)
          if (index === -1){ 
            this[type].push(items[i]);
          }
        }
      } else{
        for (let i=0; i < items.length; i++){
          const index = this.content.findIndex(item => item.id === items[i].id)
          if (index === -1){ 
            this.content.push(items[i]);
          }
        }
      }
      if(this.content.length > 0){
          this.content.sort(function(a,b){
              let date1 = new Date(a.date);
              let date2 = new Date(b.date);
              return date1.getTime() - date2.getTime()});
        }
    }
  },
  
  mounted(){
    //let content = api.followLinks(this.serviceObject);
    this.getContent();
    console.log(this.content);

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
