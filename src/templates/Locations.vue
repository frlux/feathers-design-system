<template>

    <main class="channel" role="main">

        <header class="background--white d-flex p-4">

            <div class="col-md-10 m-auto">

                <div class="col-md-8">

                    <heading class="channel__title text--dark text--serif"
                             level="h1">
                        Locations
                    </heading>

                    <p class="channel__description">
                        The Heart of the Community, Enriching Lives and Inspiring the Future.</p>
                        <p>With 6 locations in Western North Carolina, Fontana Regional Library provides the public of Jackson, Macon, and Swain counties with excellent service and convenient access to resources for your educational, informational, and recreational needs.</p>

                </div>

            </div>

        </header>

        <section class="d-md-flex p-4" v-if="!q">

            <div class="col-md-8">

                <div class="d-flex flex-wrap align-items-stretch">

                    <template v-if="alternateLocation">

                        <div class="mb-4 locations__location-card" :key="alternateLocation.id">

                            <card :badge-label="alternateLocation.name"
                                  class="card--background-white"
                                  content-type="blog"
                                  :copy="alternateLocation.description"
                                  :explainer="alternateLocation.acf.city"
                                  :heading="alternateLocation.name"
                                  heading-class="sr-only"
                                  :key="alternateLocation.id" style="min-height: 197px;">
                                   <div slot="copy" class="row d-flex">
                                     <div class="col-4 order-2 align-self-end">
                      <img :src="alternateLocation.acf.building_image.url"/></div>
                                     <div class="col col-8 order-0">


                                     {{alternateLocation.acf.phone}}
                      <address class="location__address mt-4 pt-4 border-top" itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">
                        <div class="location__street h4" itemprop="streetAddress">{{alternateLocation.acf.address}}</div>
                        <div v-if="alternateLocation.acf.mailing_address" class="location__mailing h4">{{alternateLocation.acf.mailing_address}}</div>
                        <div class="location__city h4"><span itemprop="addressLocality">{{alternateLocation.acf.city}}, {{alternateLocation.acf.state}}</span> <span itemprop="postalCode">{{alternateLocation.acf.zip}}</span></div>
                        <div class="location__fax my-3">Fax: <span itemprop="faxNumber">{{alternateLocation.acf.fax}}</span></div>
                      </address>
                      </div>
                                     </div>
                                <template slot="action">
                                    <router-link class="button button--blue-alternate" :to="`/locations/${alternateLocation.slug}`">More</router-link>
                                </template>

                            </card>

                        </div>

                    </template>

                </div>

            </div>

            <div class="card background--gray p-4 mb-3">

                <template v-if="call" >
          <call-to-action :action="call.acf.action"
                          :copy="call.acf.copy"
                          :image="call.acf.image"
                          :heading="call.acf.heading"
                          :link="call.acf.link"></call-to-action>
      </template>

            </div>

        </section>

        <section class="background--white d-flex p-4">

            <div class="col-md-10 m-auto">

                <div class="d-md-flex">

                    <div class="col col-md-6 col-lg-4">

                        <div class="mt-3" style="width: 307.875px">
                            <div class="form-group">
                                <label class="form-label text--bold text--sans text--dark" for="serviceSidebarFilter">
                                    Filter Locations
                                </label>

                                <input class="form-control"
                                       id="serviceSidebarFilter"
                                       type="text"
                                       v-model.lazy="q">
                            </div>

                            <button class="button button--blue-alternate"
                                    v-on:click="q = null">Clear Filter</button>
                        </div>

                    </div>

                    <div class="col col-lg-8">

                        <div class="alert alert--primary mb-3 pl-4 pr-4" v-if="q">
                            <heading class="h3 text--dark text--serif" level="h2">Search</heading>
                            <p class="channel__subtitle mt-1 text--dark text--sans" v-if="q">
                                Here is everything we can find that matches your search for <mark class="mark">{{ q }}</mark>.
                            </p>
                        </div>

                        <template v-for="library in filteredLocations">

                        <div class="mb-4 locations__location-card" :key="library.id" :class="currentStatus(library.acf.operating_hours)">

                            <card :badge-label="library.name"
                                  class="card--background-gray"
                                  content-type="blog"
                                  :copy="library.description"
                                  :explainer="library.acf.city"
                                  :heading="library.name"
                                  heading-class="sr-only"
                                  :key="library.id" style="min-height: 197px;">
                                   <div slot="copy" class="row d-flex">
                                     <div class="col-4 order-2 align-self-end">
                      <img :src="library.acf.building_image.url"/></div>
                                     <div class="col col-8 order-0">


                                     {{library.acf.phone}}
                      <address class="location__address mt-4 pt-4 border-top" itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">
                        <div class="location__street h4" itemprop="streetAddress">{{library.acf.address}}</div>
                        <div v-if="library.acf.mailing_address" class="location__mailing h4">{{library.acf.mailing_address}}</div>
                        <div class="location__city h4"><span itemprop="addressLocality">{{library.acf.city}}, {{library.acf.state}}</span> <span itemprop="postalCode">{{library.acf.zip}}</span></div>
                        <div class="location__fax my-3">Fax: <span itemprop="faxNumber">{{library.acf.fax}}</span></div>
                      </address>
                      </div>
                                     </div>
                                <template slot="action">
                                    <router-link class="button button--blue-alternate" :to="`/locations/${library.slug}`">More</router-link>
                                </template>

                            </card>

                        </div>

                    </template>

                    </div>

                </div>

            </div>

        </section>

    </main>
</template>

<script>
import CallToAction from "../patterns/CallToAction.vue";
import Card from "../patterns/Card.vue";
import Heading from "../elements/Heading.vue";
import moment from 'moment';
export default {
  name: "Locations",
  components: {
    CallToAction,
    Card,
    Heading
  },
  computed: {
    call(){
      let cta = this.selectedLocation ? this.$store.getters.getContentByLibrary(
          'callsToAction', 
          this.selectedLocation.slug,
        ): this.$store.state.callsToAction;
      return (cta && cta.length>0) ? cta[0] : null;
    },
    selectedLocation(){
      let location = this.$store.state.userLocation ? this.$store.state.userLocation : (this.$router && this.$router.query && this.$router.query.location) ? this.$router.query.location : null;
      return location ? this.$store.getters.getLocationBySlug(location) : null;
    },
    alternateLocation(){
      if(this.selectedLocation){
        return this.selectedLocation;
      }
      let location = (this.call && this.call.acf && this.call.acf.location) ? this.call.acf.location[0].slug : 'headquarters';
      return this.$store.getters.getLocationBySlug(location);
    },
    filteredLocations() {
      if (!this.q) {
        return this.locations;
      }
      const value = this.q.toLowerCase();
      return  this.locations.filter(location => 
                  Object.keys(location).some(key => location[key] != null && 
                  location[key].toString().toLowerCase()
                  .includes(value) || Object.keys(location[key]).some(k => location[key][k] !== null &&
                  location[key][k].toString().toLowerCase().includes(value) )
                  ));
    },
    locations() {
      return this.$store.state.locations;
    },
   
  },
  data(){
    return{
      q: this.filter
    }
  },
  methods:{
     currentStatus(hours){
      const days = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
      
      const format = 'hh:mm a';
      const time = moment();
      const today = time.day();
      let current = 'closed';
      let dayOfWeek = days[today];
      if(!hours[dayOfWeek].closed){
      const open = moment(hours[dayOfWeek].open, format);
      const close = moment(hours[dayOfWeek].close, format);
      current = time.isBetween(open, close) ? 'open' : 'closed';
      if(current ==='open' && close.diff(time, 'minutes') < 46){
        current = "closing-soon"; 
      }
      } 
      return current;
    },
  },
  props: {
    filter: {
      type: String,
    },
  },
};
</script>
<style lang="scss">
.locations__location-card{
  flex: 1 0 45%;
  min-width:350px;
  margin: 0 1%;
}
.closed:before, .open:before, .closing-soon:before{
  display:block;
  padding:.5em;
  font-style:italic;
}
.closed:before{
  content:"Currently Closed";
  background-color: rgba($color-pink, .2)
}
.open:before{
  content:"Currently Open";
  background-color: rgba($color-teal, .2)
}
.closing-soon:before{
  content:"Closing Soon";
  background-color: rgba($color-orange, .2)
}
</style> 