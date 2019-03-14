<template>
    <main class="channel" role="main" :key="$route.params.slug">
        <template v-for="(call, index) in callsToAction" >
            <call-to-action v-if="index === 0"
                            :key="call.id"
                            :action="call.acf.action"
                            class="p-3"
                            :copy="call.acf.copy"
                            :image="call.acf.image"
                            :heading="call.acf.heading"></call-to-action>
        </template>

        <header class="background--white d-flex p-4">

            <div class="col-md-10 m-auto">

                <div class="col-md-8">

                    <heading class="channel__title text--dark text--serif" level="h1" v-html="!term && !collectionTitle ? 'Newly Added' : !term ? collectionTitle : term.name">
                    </heading>

                    <p class="channel__description" v-html="!term && !collectionDescription ? 'The Freshest Items' : !term ? collectionDescription : term.description"></p>

                </div>

            </div>

        </header>

        <section class="background--white library__section p-3">

            <div class="col-lg-10 m-lg-auto">

                <div class="d-md-flex">


                    <div class="col-md-4">
                      <content-search :filter="filter" @querycontent="filter=$event; page=1"
                          :library="location" @filterlibrary="location = $event"
                          @clearcontentfilter="clearFilter()"
                          contentName="collection item"
                          :selected="selected" @selectedterms="addSelected($event)"/>
                  
                        
                    </div>

                    <div class="col col-lg-8">
                      <filter-results :total="total"
                                      :filter="filter"
                                      :location="location"
                                      :terms="selected"
                                      contentName="collection item"/>

                        <content-stream v-if="collection && collection.length>0"
                                        :contents="collection"
                                        type="collection"
                                        @totalresults="total=$event"
                                        :filter="filter"
                                        :location="location"
                                        :term-filter='selected'/>

                        

                    </div>
              

                </div>

            </div>
        </section>
   </main>
</template>

<script>
import CallToAction from "../patterns/CallToAction.vue";
import ContentSearch from '../elements/ContentSearch.vue';
import ContentStream from "../patterns/ContentStream.vue";
import Heading from "../elements/Heading.vue";
import * as api from '../store/api.js';
import FilterResults from '../elements/FilterResults.vue';

export default {
  name: 'Collection',

  components: {
    CallToAction,
    ContentSearch,
    ContentStream,
    Heading,
    FilterResults,
  },

  computed: {
    callsToAction() {
      return this.$store.state.callsToAction;
      //return this.$store.getters.getCallsToActionByCategory(this.slug);
       /**
       * NEED to get by featured collection
       */
    },
  },
  data(){
    return{
      collection: [],
      filter: null,
      location: this.library ? this.library : '',
      total: 0,
      page: 1,
      selected:{
        genres:[],
        audience:[]
      },
      counts:{
        collection: 0,
      },
      loaded: false,
      browse: true,
    }
  },
  mounted(){
    if(!this.network || this.network == 'new'){
        this.browse=false;
        this.getNew();
      }
      if(this.network && this.network !== 'new' && this.slug !== 'any' && this.term){
        this.getCollectionByTerm();
      }
      this.$root.$on('inputData', data=>{
      this.q=data;
    });
    this.$root.$on('resetPage', data=>{
      this.page=1;
    });
  },
  beforeMount(){
    this.collection = this.$store.state.collection;
  },
  methods:{
    addSelected(selected){
      this.selected[selected.taxonomy] = selected.terms;
    },
   getNew(bulk=null){
    this.fetchContent('collection',{per_page:100});
    },
    getCollectionByTerm(){
      switch(this.network){
        case 'genres': this.fetchContent('collection', {per_page:100, genres: this.term.id});
        // case 'featured-collection': this.fetchContent('collection',{per_page:100, page: 1, 'featured-collection': });
      }
    },

    fetchContent(type, params){
      api.fetchData(type, params).then(response =>{
            this.counts[type] = response.headers['x-wp-total'];
            if(params.page){
              params.page++;
            }
            this.addItems(type, response.data, params);
            this.loaded=true;
          }).catch(error=> console.log(error)); 
    },
    addItems(store, items, params=null){
      for (let i=0; i < items.length; i++){
        const index = this[store].findIndex(item => item.id === items[i].id)
        if (index === -1){ 
          this[store].push(items[i]);
        }
      }
      if(params && params.page && params.new){
        while(Math.ceil(this.counts[store]/100) >= params.page){
          this.fetchContent('collection', params);
        }
      }
    },
    clearFilter() {
      this.selected.genres = [];
      this.filter = null;
      this.location = '';
      this.selected.audience = [];
    },
  },
  props: {
    collectionDescription: {
      type: String,
    },

    collectionTitle: {
      type: String,
    },

    network: {
      type: String,
      default: 'new'
    },

    slug: {
      required: true,
      type: String
    },

    term:{
      type: Object
    },
    library:{
      type: String,
    }
  },
  beforeMount(){
    if(this.$route.query.search ){
      this.filter=this.$route.query.search;
    }
    if(this.$route.query.level ){
      let level = this.$store.getters.getTerm(this.$route.query.level, 'audience')
      this.selected.audience.push(level.id);
    }
    if(this.$route.query.location){
      this.location = this.$route.query.location;
    }
    if(this.$route.query.genre ){
      let genre = this.$store.getters.getTerm(this.$route.query.genre, 'genres')
      this.selected.genres.push(genre.id);
    }
  },
  watch:{
    selected(){
      this.$root.$emit('resetpage')
    },
    selectedAudience(){
      this.$root.$emit('resetpage')
    },
    filter(){
      this.$root.$emit('resetpage')
    },
    location(){
      this.$root.$emit('resetpage')
    },
    $route(){
     
    }
  }
};
</script>

<style lang="scss">
.channel {
  &__title {
    @media #{$media-query-medium} {
      font-size: $font-size-xx-large;
    }
  }

  &__description {
    color: $color-blue-alternate;
    font-family: $font-family-text;
    font-size: $font-size-base;

    @media #{$media-query-medium} {
      font-size: $font-size-large;
    }
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
.collection__sample__cover{
  max-width:125px;
  max-height:150px;
}
</style>
