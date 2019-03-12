<template>
<component :is="wrapper">
  <div class="alert alert--primary mb-3 pl-4 pr-4" v-if="filter || location || total || (tags && tags.length > 0)">
    <heading v-if="filter || location || (tags && tags.length > 0)" class="h3 text--dark text--serif" level="h2">Search</heading>
    <p class="channel__subtitle mt-1 text--dark text--sans"
      v-if="filter || location || (tags && tags.length > 0)">
      Here is everything we can find that matches your search
      {{ filter ? 'for' : '' }} <mark class="mark">{{ filter }}</mark>
      <template v-if="location && locationDetails">
        <span v-if="contentName === 'event'">happening</span> at <router-link class="link" :to="{name: 'locations-slug', params:{slug: locationDetails.slug, pageObject: locationDetails}}">{{ locationDetails.name }}</router-link>
      </template> {{ tags && tags.length > 0 ? 'tagged:' : '.' }}
      <template v-for="tag in tags">
        <span :key="tag.id" class="badge filter-results__tag" :class="tag.taxonomy=='audience' ? 'badge-primary' : tag.taxonomy=='genres' ? 'badge-info' : 'badge-secondary'" v-html="tag.name"></span> 
        </template>
      
    </p>


    <p class="channel__subtitle text--dark text--large" v-if="selectedDate">
      Here are all the events that match your search for "{{ selectedDate }}".
    </p>
    <div v-if="total > 0" v-html="total==1 ? `1 ${contentName} found.` : total + ` ${contentName}s found.`" class="results_total text--dark text--sans m-2">
    </div>
          
  </div>
  <p  v-if="total == 0">Sorry, we couldn't find any {{ contentName }}s.</p>
  </component>
</template>
<script>
export default {
  name: 'FilterResults',
  computed:{
    locationDetails() {
      return this.location
        ? this.$store.state.locations.find(
            location => location.slug === this.location
          )
        : null;
    },
    tags(){
      let terms = [];
      for (const [taxonomy, value] of Object.entries(this.terms)){
        value.forEach(val => {
          const t = this.getTerm(val, taxonomy);
          terms.push(t);
      })
      }
      console.log(terms);
      return terms;
    }
  },
  methods:{
    getTerm(tid, tax){
      return this.$store.getters.getTerm(tid, tax);
    }

  },
  props: {
    selectedDate: {
      type: String
    },
    total: {
      type: Number
    },
    location:{
      type: String,
    },
    filter:{
      type: String,
    },
    wrapper:{
      type: String,
      default:"div"
    },
    contentName:{
      type: String,
      default: 'result'
    },
    terms:{
      type: Object
    }
  },
}
</script>
<style lang="scss">
@import "~bootstrap/scss/_badge";
.results_total{
  text-align:right;
}
.filter-results__tag{
  margin: 0 2px;
}

</style>
