<template>
    <main class="library__channel" role="main">

        <header class="background--white d-flex p-4">

            <div class="col-md-10 m-auto">

                <div class="col-md-8">

                    <heading class="channel__title text--dark text--serif"
                             level="h1">
                        Search
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

                        <!-- begin load more content buttons -->
                          <div class='search__content d-flex flex-column align-items-start' v-if="active=='channel'">
                            <template v-for="type in searchableTypes">
                            <a :key="type" v-if="count[type] > 0"
                                class="search__content__button button button flex-grow-0"
                                :class="type=='events' ? 'button--teal'
                                        : type=='articles'? 'button--blue-alternate'
                                        : type=='collection'? 'button--pink'
                                        : type=='services' ? 'button--orange'
                                        :type=='pages' ? 'button--blue-base' : ''"
                                @click="active=type">
                                See More {{ getContentName(type) }}s <span class="badge badge-light">{{ count[type] }}</span>
                            </a>
                            </template>
                          </div>
                          <div v-if="active !=='channel'">
                            <a class="button button button--aqua"
                                @click="active='channel'">
                                Back to Search
                            </a>
                          </div> 

                    </div>

                    <div class="col col-lg-8">

                        <filter-results :total="total"
                                      :filter="q"/>

                       <!--  <content-stream :key="'search-'+q"
                                        type="mixed"
                                        @totalresults="total=$event"
                                        :filter="q"
                                        api-type='mixed'/> -->
                        <Showcase v-if="active=='channel' && collection && collection.length != 0"
                                  :collection-items="collection"
                                  heading="Related Materials" /> 
                        <content-stream :key="active"
                                        :contents="active==='channel'? results : null"
                                        @totalresults="total=$event"
                                        :filter="q"
                                        :type="active==='channel'? 'mixed' : active"
                                        :api-type="active==='channel'? null : active"/>


                        <!-- <template v-if="filteredSearchResults.length === 0">
                            <p>Sorry, we couldn't find any results.</p>
                        </template> -->
                    </div>

                </div>

            </div>
        </section>

    </main>
</template>

<script>
import CallToAction from "../patterns/CallToAction.vue"
import Heading from "../elements/Heading.vue"
import ContentStream from "../patterns/ContentStream.vue"
import FilterResults from '../elements/FilterResults.vue'
import Showcase from '../patterns/Showcase.vue'
import * as api from '../store/api.js'


export default {
  name: "SearchResults",

  components: {
    CallToAction,
    Heading,
    ContentStream,
    FilterResults,
    Showcase,
  },
  data(){
    return{
      results: [],
      total: 0,
      page: 1,
      count:{}, //push object with name, count
      q: null,
      active: 'channel',
      library: this.location
    }
  },
  computed: {
    callToAction(){
      let value = this.q ? this.q.toLowerCase() : null;
      let ctas = !value ? this.$store.state.callsToAction : this.$store.state.callsToAction.filter(item => 
                  Object.keys(item).some(key => item[key] != null && 
                  item[key].toString().toLowerCase().includes(value) || Object.keys(item[key]).some(k => item[key][k] !== null &&
                  item[key][k].toString().toLowerCase().includes(value) )
                  ));
      return ctas.length>0 ? ctas[0] : null;
    },
    collection(){
      const items = this.results.filter(item => item.type == 'collection-item');
      return items.slice(0,8);
    },
    event(){
      let events = this.results.filter(item => item.type == 'event');
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
    searchableTypes(){
      return Object.keys(api.content).filter( key => api.content[key].searchable === true);
    },
  },
  mounted(){
    this.q=this.filter;
    this.getContent();
  },
  created(){
    this.$root.$on('inputData', data=>{
      this.q=data;
    });
  },
  methods:{
    async getContent(){
      this.searchableTypes.forEach(type=>{
        let params = {search: this.q};

        if(type!=='posts'){
          params.per_page = 20;
        }

        if(this.library && type !=='posts'){
          let loc = this.$store.state.locations.find(location => location.slug === this.library);
          params.locations = loc.id;
        } 

        if(type=='posts' && this.library){
          params.tag=this.location;
        }
        this.fetchContent(type, params);
      })
    }, 
    async fetchContent(type, params){
      api.fetchData(type, params)
          .then(response =>{
            let num =  type!='posts' ? Number(response.headers['x-wp-total']) : Number(response.data.found);
            this.$set(this.count, type, num);
            let items = type != 'posts' ? response.data : response.data.posts;
            this.addContent(items, type);
          }).catch(error=> console.log(error));
    },
    addContent(items,type){
      
        if(this.results.length == 0){
          this.results = items;
        } else {
          for (let i=0; i < items.length; i++){
            const index = this.results.findIndex(item => item.id === items[i].id)
            if (index === -1){ 
              this.results.push(items[i]);
            }
          }
        }
      
      if(this.results.length > 0){
          this.results.sort(function(a,b){
            if(!a.date || !b.date){
              return 0;
            }
              let date1 = new Date(a.date);
              let date2 = new Date(b.date);
              return date1.getTime() - date2.getTime() });
        }
    },
    getContentName(type){
      return api.content[type].contentName;
    },
    clearFilter() {
      this.q = null;
      this.library = null;
    },
  },
  props: {
    filter: {
      type: String,
    },
    location: {
      type: String,
    },
  },
  watch:{
    q(){
      this.$root.$emit('resetpage')
    },
    library(){
      this.$root.$emit('resetpage')
    }
  }
};
</script>
<style lang="scss">
.search__content__button {
  /* float:left;
  clear:both; */
  margin:.5em 0;
}
</style>
