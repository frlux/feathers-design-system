<template>
    <main class="service background--white " role="main">
      


        <template v-if="pageObject">

            <template v-for="(call, index) in callsToAction" >
                <call-to-action class="call-to-action--large"
                                v-if="index === 0"
                                :key="call.id"
                                :action="call.acf.action"
                                :copy="call.acf.copy"
                                :image="call.acf.image"
                                :heading="call.acf.heading"
                                :link="call.acf.link"></call-to-action>
            </template>
<breadcrumb :title="pageObject.name" :items="[{text: 'Services', to: '/services'},{text: pageObject.name, active: true}]"/>
            <header class="d-flex p-4">
              

                <div class="col-md-10 m-auto">

                    <div class="col-md-8">
                        <heading class="channel__title text--dark text--serif"
                                 level="h1" v-html="pageObject.name">
                        </heading>

                        <p class="channel__description" v-html="pageObject.description">
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
                          <div class='service__channel--content d-flex flex-column align-items-start' v-if="active=='channel'">
                            <a class="button button button--blue-base flex-grow-0"
                                v-if="count.pages"
                                @click="active='pages'">
                                See More Information Pages <span class="badge badge-light">{{ count.pages }}</span>
                            </a>
                            <a class="button button button--blue-alternate flex-grow-0"
                                v-if="count.posts"
                                @click="active='articles'">
                                See More Articles <span class="badge badge-light">{{ count.posts }}</span>
                            </a>
                            <a class="button button button--pink flex-grow-0"
                                v-if="count.collection"
                                @click="active='collection'">
                                See More Collection Items <span class="badge badge-light">{{ count.collection }}</span>
                            </a>
                            <a class="button button button--teal flex-grow-0"
                                v-if="count.events"
                                @click="active='events'">
                                See More Events <span class="badge badge-light">{{ count.events }}</span>
                            </a>
                            <a class="button button button--orange flex-grow-0"
                                v-if="count.resources"
                                @click="active='resources'">
                                See More Resources <span class="badge badge-light">{{ count.resources }}</span>
                            </a>
                          </div>
                          <div v-if="active !=='channel'">
                            <a class="button button button--aqua"
                                @click="active='channel'">
                                Back to {{ pageObject.name }} Channel
                            </a>
                          </div> 
                          <!--end load more content buttons -->
                          <content-search :filter="q" @querycontent="q=$event"
                          :library="library" @filterlibrary="library = $event"
                          @clearcontentfilter="clearFilter()"/>
                          <!--end sidebar content-->
                        </div>
                        
                        <!-- BEGIN MAIN CONTENT -->
                        <div class="col col-lg-8">
                          <filter-results v-if="active == 'channel'"
                                      :total="total"
                                      :filter="q"
                                      :location="library"
                                      :prefetch-total='apiTotal'/>
                            <filter-results v-if="active != 'channel'"
                                      :total="total"
                                      :filter="q"
                                      :location="library"/>
 
                            <Showcase v-if="active=='channel' && collection && collection.length != 0"
                                      :collection-items="collection"
                                      heading="Related Materials" /> 
                            <content-stream :key="`${active}-${q}-${library}`"
                                            v-if="active==='channel'"
                                            :contents="contentContainer"
                                            @totalresults="total=$event"
                                            :filter="q"
                                            :location="library"
                                            type="mixed" />
                            <content-stream :key="`${active}-${q}-${library}`"
                                            v-if="active!='channel'"
                                            :contents="channelContainer"
                                            @totalresults="total=$event"
                                            :filter="q"
                                            :location="library"
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
import Breadcrumb from "../elements/Breadcrumb.vue";
import CallToAction from '../patterns/CallToAction.vue';
import ContentStream from "../patterns/ContentStream.vue";
import ContentSearch from '../elements/ContentSearch.vue';
import FilterResults from '../elements/FilterResults.vue';
import Heading from '../elements/Heading.vue';
import Showcase from '../patterns/Showcase.vue';

export default {
  name: 'Service',

  components: {
    Breadcrumb,
    CallToAction,
    ContentStream,
    ContentSearch,
    FilterResults,
    Heading,
    Showcase,
  },

  computed: {
    count(){
      return this.$store.state.serviceCall;  
    },
    callsToAction() {
      let ctas = this.$store.getters.getContentByService('callsToAction', this.slug, this.library);
      //const payload = {contentType: 'callsToAction', content: ctas};
      //this.$store.commit('addMoreContent', payload); 
      return ctas && ctas.length > 0 ? ctas : this.$store.getters.getContentByService('callsToAction', 'any', this.library) ;
    },
    collection(){
      const items = this.contentContainer.filter(item => item.type == 'collection-item');
      return items.slice(0,8);
    },
    event(){
      let events = this.contentContainer.filter(item => item.type == 'event');
      let randomEvent1 = events[Math.floor(Math.random() * events.length)];
      events = events.filter(item => item.id !== randomEvent1.id);
      
      return [events[Math.floor(Math.random() * events.length)], randomEvent1]
    },
    apiTotal(){
      let vals = Object.values(this.count);
      return vals.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue;
        }, 0)
    },
    contentContainer(){
      return this.$store.getters.getContentByService(null, this.slug, this.library);
    }
  },
  data(){
    return{
      total: 0,
      page: 1,
      active: 'channel',
      q: null,
      library: null,
      channelContainer: [],
    }
  },
  methods: {
    getAuthor(authorId) {
      const author = this.$store.getters.getAuthorById(Number(authorId));
      return author.name;
    },
    clearFilter() {
      this.q = null;
      this.library = null;
    },
  },
  props: {
    pageObject: {
      type: Object,
    },
    slug: {
      type: String,
    },
    location: {
      type: String
    },
    filter: {
      type: String
    }
  },
  watch:{
    q(){
      this.$root.$emit('resetpage')
    },
    library(){
      this.$root.$emit('resetpage')
    },
    active(){
      this.$emit('channel', {service: this.slug, channel: this.active});
    }
  }
};
</script>

<style lang="scss">
.service__channel--content a.button {
  /* float:left;
  clear:both; */
  margin:.5em 0;
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
