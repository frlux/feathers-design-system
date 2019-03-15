<template>
    <main class="channel" role="main">
        <template v-for="(call, index) in callsToAction">
            <call-to-action class="call-to-action--large"
                            v-if="index === 0"
                            :key="index"
                            :action="call.acf.action"
                            :copy="call.acf.copy"
                            :image="call.acf.image"
                            :heading="call.acf.heading"
                            :link="call.acf.link" />
        </template>

        <header class="background--white d-flex p-4">

            <div class="col-md-10 m-auto">

                <div class="col-md-8">

                    <heading class="channel__title text--dark text--serif" level="h1">
                        {{ channelTitle }}
                    </heading>

                    <p class="channel__description">{{ channelDescription }}</p>

                </div>

            </div>

        </header>

        <section class="background--white library__section p-3">

            <div class="col-lg-10 m-lg-auto">

                <div class="d-md-flex">


                    <div class="col-md-4">
                      <content-search :date-filter="network !== 'resources' ? true : false" :location-filter="network !== 'resources' ? true : false"
                          :selected-date="network !== 'resources' ? selectedDate : null" @selectdate="selectedDate = $event"
                          :filter="filter" @querycontent="filter=$event"
                          :library="network !== 'resources' ? library : null" @filterlibrary="library = $event"
                          @clearcontentfilter="clearFilter()"
                          />
                    </div>

                    <div class="col col-lg-8">

                        <template v-if="network">
                          <filter-results :total="total"
                                          :selectedDate="selectedDate"
                                          :filter="filter"
                                          :location="library"
                                          :contentName="network.slice(-1) == 's' ? network.substring(0, network.length - 1) : network"/>
                          <content-stream :key="`${network}-${filter}-${library}-${selectedDate}`" 
                                          :type="network"
                                          @totalresults="total=$event"
                                          :filter="filter"
                                          :selected-date="selectedDate"
                                          :location="library"
                                          :api-type="network=='blog' ? 'posts': network"
                                          />
                        </template>

                    </div>

                </div>

            </div>
        </section>
   </main>
</template>

<script>
import CallToAction from "../patterns/CallToAction.vue";
import Card from '../patterns/Card.vue';
import Heading from "../elements/Heading.vue";
import ContentStream from "../patterns/ContentStream.vue";
import ContentSearch from '../elements/ContentSearch.vue';
import FilterResults from '../elements/FilterResults.vue';

export default {
  name: "Channel",

  components: {
    CallToAction,
    Card,
    Heading,
    ContentStream,
    ContentSearch,
    FilterResults
  },

  computed: {
    callsToAction() {
      return this.$store.getters.getCallsToActionByCategory(this.slug);
    },
  },
  created(){
    this.$root.$on('loadmore', data=>{
      this.loadmore=true;
    });
    this.$root.$on('resetPage', data=>{
      this.page=1;
    });
  },
  data(){
    return{
      items: [],
      filter: null,
      library: null,
      selectedDate: null,
      loadmore: null,
      page: 1,
      total: 0,
    }
  },
  watch:{
    selectedDate(){
      this.$root.$emit('resetpage')
    },
    filter(){
      this.$root.$emit('resetpage')
    },
    library(){
      this.$root.$emit('resetpage')
    }
  },
  methods:{
    clearFilter() {
      this.selectedDate = null;
      this.filter = null;
      this.library = null;
      this.page = 1;
    },

  },
  props: {
    channelDescription: {
      type: String,
    },

    channelTitle: {
      type: String,
      default: "Shelf Life in the Mountains"
    },

    network: {
      type: String,
      default:'blog'
    },
  },
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
</style>
