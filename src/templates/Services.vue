<template>

    <main class="channel" role="main">

        <header class="background--white d-flex p-4">

            <div class="col-md-10 m-auto">

                <div class="col-md-8">

                    <heading class="channel__title text--dark text--serif"
                             level="h1">
                        Services
                    </heading>

                    <p class="channel__description">
                        We are able to offer loads of services across multiple
                        counties, which can help connect you to free events, tax
                        experts, your ancestry, or get you free books, movies,
                        and much, much more.                     </p>

                </div>

            </div>

        </header>

        <section class="d-md-flex p-4" v-if="!q">

            <div class="col-md-8">

                <div class="d-md-flex flex-md-wrap">

                    <template v-for="(service, index) in featuredServices" v-if="index < 6">

                        <div class="mb-4 col-md-6" :key="service.id">

                            <card :badge-label="service.name"
                                  class="card--background-white"
                                  content-type="service"
                                  :copy="service.description"
                                  explainer="Featured"
                                  :heading="service.name"
                                  heading-class="sr-only"
                                  :key="service.id" style="min-height: 197px;">

                                <template slot="action">
                                    <router-link class="button button--orange" :to="`/services/${service.slug}`">More</router-link>
                                </template>

                            </card>

                        </div>

                    </template>

                </div>

            </div>

            <template v-if="call">

          <call-to-action :action="call.acf.action"
                          :copy="call.acf.copy"
                          :image="call.acf.image"
                          :heading="call.acf.heading"
                          :link="call.acf.link"
                          ></call-to-action>


            </template>

        </section>

        <section class="background--white d-flex p-4">

            <div class="col-md-10 m-auto">

                <div class="d-md-flex">

                    <div class="col col-md-6 col-lg-4">

                        <div class="mt-3" style="width: 307.875px">
                            <div class="form-group">
                                <label class="form-label text--bold text--sans text--dark" for="serviceSidebarFilter">
                                    Filter services by title
                                </label>

                                <input class="form-control"
                                       id="serviceSidebarFilter"
                                       type="text"
                                       v-model="q">
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

                        <template v-for="service in filteredServices">

                            <card class="card--background-gray mb-4"
                                  content-type="service"
                                  :copy="service.description"
                                  :heading="service.name"
                                  :key="service.id" style="min-height: 197px;">



                                <template slot="action">
                                    <router-link class="button button--orange" :to="`/services/${service.slug}`">
                                        {{ service.acf.button_text ? service.acf.button_text : 'Read more'}}
                                    </router-link>
                                </template>

                            </card>

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

export default {
  name: "Services",

  components: {
    CallToAction,
    Card,
    Heading
  },

  computed: {
    call(){
      const ctas = this.$store.state.callsToAction.filter(cta => cta.services && cta.services.length > 0);
      return ctas[0];
    },
    featuredServices() {
      const servicesWithDescriptions = this.services.filter(
        service => service.description !== ""
      );
      return servicesWithDescriptions;
    },

    filteredServices() {
      let value = this.q ? this.q.toLowerCase() : null;
      return !value ? this.services : this.services.filter(service => 
                  Object.keys(service).some(key => service[key] != null && 
                  service[key].toString().toLowerCase().includes(value) || Object.keys(service[key]).some(k => service[key][k] !== null &&
                  service[key][k].toString().toLowerCase().includes(value) )
                  ));
    },

    services() {
      return this.$store.state.services;
    }
  },
  data(){
    return{
      q: this.filter,
    }
  },
  mounted(){
    this.$root.$on('inputData', data=>{
      console.log(data);
      this.q=data;
    });

  },

  props: {
    filter: {
      type: String,
    },
  },
};
</script>
