<template>
  <main class="location" role="main" itemscope itemtype="http://schema.org/Library">

    <template v-if="locationObject">
      <div id="locationTop"></div>
      <template v-if="call" >
          <call-to-action :action="call.acf.action"
                          :copy="call.acf.copy"
                          :image="call.acf.image"
                          :heading="call.acf.heading"
                          :link="call.acf.link"
                          class="call-to-action--large"></call-to-action>
      </template>

      <header class="background--white d-flex p-4">

          <div class="col-md-10 m-auto">

              <div class="col-md-8" >

                  <heading class="channel__title text--dark text--serif"
                            level="h1" v-html="library.name" itemprop="name">
                  </heading>

                  <p class="channel__description" v-html="library.description">
                  </p>

              </div>

          </div>

      </header>

      <section class="background--white library__section p-3">

        <div class="col-lg-10 m-lg-auto">
          <div class="d-md-flex">
            <!-- BEGIN SIDEBAR -->
            <div class="col col-md-6 col-lg-4"> 
              <div class="location__info" style="display:inline-block">                  

                <!-- Begin sidebar content-->
     
                <template>
                  <card badge-label="Location Information"
                        heading="Hours"
                        class="card--background-gray text--dark my-2"
                        content-type="blog"
                        >
                    <div slot="copy">
                      <div class="location__hours__wrap d-flex flex-column">
                        <div class="location__hours" v-for="(day,index) in library.acf.operating_hours" :key="index"
                                  :class="getOrder(index, day)" v-html="getOperatingHours(index, day)"
                                  itemprop="openingHoursSpecification" itemtype="http://schema.org/OpeningHoursSpecification">
                          </div>
                        </div>

                  

                      <address class="location__address mt-4 pt-4 border-top" itemprop="location address" itemscope itemtype="http://schema.org/PostalAddress">
                        <div class="location__street h4" itemprop="streetAddress">{{library.acf.address}}</div>
                        <div v-if="library.acf.mailing_address" class="location__mailing h4">PO Box <span itemprop="postOfficeBoxNumber">{{library.acf.mailing_address}}</span></div>
                        <div class="location__city h4"><span itemprop="addressLocality">{{library.acf.city}}, {{library.acf.state}}</span> <span itemprop="postalCode">{{library.acf.zip}}</span></div>
                        <div class="location__phone mt-3">Phone: <span itemprop="telephone"> {{library.acf.phone}}</span></div>
                        <div class="location__fax">Fax: <span itemprop="faxNumber">{{library.acf.fax}}</span></div>
                      </address>
                      <div class="location__social mt-3">
                      <a v-if="library.acf.facebook_username" :href="`https://facebook.com/${library.acf.facebook_username}`" itemprop="sameAs"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path class='location__social-icon' d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg></a>
                      </div>
                      
                    </div>
          

                  </card>
                </template>
                <div class="d-flex flex-column">
                      <a class="button button--large button--aqua location__phone-button"
                            :href="`tel:1-${library.acf.phone}`" style="">
                            <span class="location__phone-button__icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path style="fill:#fff" d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>
                            </span>
                            <span> {{library.acf.phone}}</span>
                        </a>
                      <template v-for="contact in library.acf.contact">
                        <person :key="contact.person.ID"
                                :name="contact.person.post_title"
                                :title="contact.title"
                                type="organizer"
                                :personObject="contact.person">
                                </person>
                      </template>
                      <img :src="library.acf.building_image.url" class="flex-grow-0"/>
                  </div>
                
                  

                      <router-link v-if="library.slug !== 'headquarters'" itemprop="branchOf" class="link"
                    :to="'/locations/headquarters'">
                        Member of Fontana Regional Library
                  </router-link>


           </div>
  <div class="location__callsToAction d-flex flex-column" style="">
      <template v-for="(call, index) in locationCallsToAction" >
          <call-to-action v-if="index===1"
                          :key="call.id"
                          :action="call.acf.action"
                          :copy="call.acf.copy"
                          :image="call.acf.image"
                          :heading="call.acf.heading"
                          :link="call.acf.link"></call-to-action>
      </template>
      </div>
            
            </div> <!-- END SIDEBAR -->
            <!-- BEGIN MAIN CONTENT -->
            <div class="col col-lg-8">
              <!--BEGIN CHANNEL CONTENT -->

              <div v-if="locationEvents && locationEvents.length > 0"
                    class="card--background-gray py-2 mb-3 location-events">
                    <h3 class="h3 px-3">Upcoming Related Events</h3>

                    <div class="location-events__flex">

                    <event-card v-for="event in locationEvents" class="card--background-white location-events__card mb-3"
                              :event="event"
                              :key="event.id"/>
                              </div>

                  <router-link class="link pl-3 pb-3"
                    :to="{name: `Events`, params:{userLocation: library.slug}}">
                        View more events at {{ library.name }}
                  </router-link>

              </div>

              

                <template v-for="page in locationPages"><!-- pages card -->
                  <card badge-label="Information"
                        :heading="page.title.rendered"
                        class="card--background-gray text--dark my-2"
                        content-type="blog"
                        :key="page.id">
                    <div slot="copy">
                      {{ getExcerpt(page.content.rendered) }}
                    </div>

                    <template slot="action">
                      <router-link class="button button--aqua" :to="`/${page.slug}`">More</router-link>
                    </template>

                  </card>
                </template><!-- end pages card -->

                <template v-for="article in locationArticles"><!-- articles card -->
                  <card badge-label="Article"
                        :heading="article.title.rendered"
                        class="card--background-gray"
                        content-type="blog"
                        :explainer="article.date | moment('dddd, MMMM Do')"
                        :key="article.id">
                    <div slot="copy">
                      {{ getExcerpt(article.content.rendered) }}
                    </div>

                    <template slot="action">
                      <router-link class="button button--orange" :to="`/articles/${article.slug}`">More</router-link>
                    </template>

                  </card>
                </template><!-- end articles card -->
               <Showcase class="mt-4" v-if="locationCollection.length > 0"
                          :collection-items="locationCollection"
                          :heading="`New at ${library.name}`" />
              <!-- END CHANNEL CONTENT -->

            </div><!--close main content col-8 -->
          </div><!--close flex div -->
         
        </div><!-- close col-10 div -->

      </section>

    </template>

  </main>
</template>

<script>
import CallToAction from '../patterns/CallToAction.vue';
import Card from '../patterns/Card.vue';
import CollectionItem from '../patterns/CollectionItem.vue';
import EventCard from '../patterns/EventCard.vue';
import Heading from '../elements/Heading.vue';
import Showcase from '../patterns/Showcase.vue';
import Person from '../patterns/Person.vue';
import moment from 'moment';
export default {
  name: 'Location',
  components: {
    CallToAction,
    Card,
    CollectionItem,
    EventCard,
    Heading,
    Showcase,
    Person
  },
  computed: {
    locationCallsToAction() {
      return this.$store.getters.getContentByService(
          'callsToAction', '',
          this.library.slug,
        );
    },
    call(){
      let cta = this.locationCallsToAction;
      return (cta && cta.length>0) ? cta[0] : null;
    },
    locationCollection() {
       return this.$store.getters.getContentByService(
          'collection', '',
          this.library.slug,
        );
    },
    locationPages() {
       return this.$store.getters.getContentByService(
          'pages', '',
          this.library.slug,
        );
    },
    locationArticles() {
       return this.$store.getters.getContentByService(
          'articles', '',
          this.library.slug,
        );
    },
    locationEvents() {
       return this.$store.getters.getContentByService(
          'events', '',
          this.library.slug,
        );
    },
  },
  data() {
    return {
      library: this.locationObject,
      articles:[],
      callsToAction:[],
      pages:[],
      collection:[],
      events:[],
    };
  },
 watch:{
   locationObject(){
     this.library = this.locationObject;
   }
 },
  methods: {
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
    getOrder(day, hours){
      const weekday = moment().day(day).weekday();
      
      const format = 'hh:mm a';
      const time = moment();
      const today = time.day();
      let current = 'closed';
      if(today === weekday && !hours.closed){
        const open = moment(hours.open, format);
        const close = moment(hours.close, format);
        current = time.isBetween(open, close) ? 'open' : 'closed';
        if(current ==='open' && close.diff(time, 'minutes') < 46){
          current = "closing-soon"; 
        }
      } 
      return today==weekday ? `order-0 ${current}`: weekday-today >0 ? 'order-'+ (weekday-today) : 'order-' + ((7-today) + weekday);
    },
    getOperatingHours(day, hours){
      const format = 'hh:mm a';
      day = day[0].toUpperCase() + day.substring(1).toLowerCase();
      return hours.closed 
                ? `<span class='location__hours__day__name'>${day}</span> <span class='location__hours__day__hours--closed'>Closed</span></div>`
                : `<span class='location__hours__day__name' itemprop="dayOfWeek" href="http://schema.org/${day}">${day}</span> <span class='location__hours__day__hours'><span itemprop="opens" content="${moment(hours.open, format).format("HH:mm:ss")}">${hours.open}</span>- <span itemprop="closes" content="${moment(hours.close, format).format("HH:mm:ss")}">${hours.close}</span></span></div>`;
    }
  },
  mounted(){
    if(this.locationObject){
      this.library = this.locationObject;
    } else {
      this.library = this.$store.getters.getLocationBySlug(this.$route.params.slug)
    }

  },
  props: {
    locationObject: {
      type: Object,
    }
  },
};
</script>

<style lang="scss">
.location__social-icon{
  fill: $color-blue-alternate;
}
.location__phone-button{
  font-size:1.4em;
  position:relative;
  .location__phone-button__icon{
  display:inline-block;
  width:1em;
  height:1em;
  margin-right:.2em;
  vertical-align:text-top;
  }
  svg{
    width:100%;
    height:auto;
  }
}
.location__address {
  font-style:normal;
  
}
.location__street,
.location__city{
}
.location__fax{
  font-weight:normal;
}
.location__hours.order-0{
  font-weight:bold;
}
.location__hours.order-0.open:before{
  content: "Currently Open";
  background-color: rgba($color-teal, .3);
} 
.location__hours.order-0.closed:before{
  content: "Currently Closed";
  background-color: rgba($color-pink, .3);
} 
.location__hours.order-0.closing-soon:before{
  content: "Closing Soon";
  background-color:rgba($color-orange, .3);
}
.location__hours.order-0:before{
  display:block;
  text-align:center;
  padding: .3em 1em;
  position:absolute;
  top:0;
  left:0;
  width:100%;
} 
.location__hours{
  margin-bottom:.75em;
  .location__hours__day__hours,
  .location__hours__day__hours--closed{
    float:right;
  }
}
.location-events__flex{
  width:100%;
}
.location-events__card{
  min-width:200px;
  max-width:600px;
  margin:1em;
  /*max-height:30vw;*/
  overflow:hidden;
  flex: 1 1 50%;
  @media #{$media-query-medium} {
    
    flex: 1 1 40%;
  }
  @media #{$media-query-medium} {
    max-width:100%;
    flex: 1 1 50%;
  }
  @media (min-width:1350px) {
    flex: 1 1 33%;
  }
 
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
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.float-right{
  float:right;
}
</style>