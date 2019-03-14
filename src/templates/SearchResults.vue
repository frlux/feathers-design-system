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

                        Sidebar

                    </div>

                    <div class="col col-lg-8">

                        <filter-results :total="total"
                                      :filter="q"/>

                        <content-stream :key="'search-'+q"
                                        type="mixed"
                                        @totalresults="total=$event"
                                        :filter="q"
                                        api-type='mixed'/>

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


export default {
  name: "SearchResults",

  components: {
    CallToAction,
    Heading,
    ContentStream,
    FilterResults
  },
  data(){
    return{
      results: [],
      total: 0,
      count:{
        events: 0,
        pages: 0,
        posts: 0,
        articles: 0,
        collection: 0,
        resources: 0,
        services: 0,
        locations: 0,
        featuredCollections: 0,
      },
      q: null
    }
  },
  computed: {
    sortedResults() {
      let results;
      if (!this.q) {
        results = this.$store.getters.getSiteContent();
      } else {
        results = this.results;
      }
      
      if(results.length > 0){
          results = this.results.sort(function(a,b){
              let date1 = new Date(a.date);
              let date2 = new Date(b.date);
              return date1.getTime() - date2.getTime() });
        }

        return results;
      /* const regex = new RegExp(`${this.q}`, 'i');
      return this.searchResults.filter(result => Object.keys(result)
        .some(key => regex.test(result[key]))); */
    },
  },
  mounted(){
    this.q=this.filter;
  },
  created(){
    this.$root.$on('inputData', data=>{
      this.q=data;
    });
  },
  methods:{
    async getContent(){
      this.pageObject._links['wp:post_type'].forEach(link=>{
        let name = link.href.match(/(?:\/([a-z|-]*?)\?)/);
        name=name[1]=='calls-to-action' ? 'callsToAction' : name[1];

        this.fetchContent(name, link.href);
      })
    }, 
    async fetchContent(type, link){
      api.fetchLink(link)
          .then(response =>{
            this.count[type] = Number(response.headers['x-wp-total']);
            this.addContent(response.data, type);
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
};
</script>
