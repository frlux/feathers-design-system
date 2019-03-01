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

                        <div class="alert alert--primary mb-3 pl-4 pr-4" v-if="filter">
                            <heading class="h3 text--dark text--serif" level="h2">Search</heading>
                            <p class="channel__subtitle mt-1 text--dark text--sans" v-if="filter">
                                Here is everything we can find that matches your search for <mark class="mark">{{ filter }}</mark>.
                            </p>
                        </div>

                        <template v-for="result in filteredSearchResults">

                            <card v-if="result.type && result.type ==='post'" class="card--background-gray mt-4" :key="result.id"
                            content-type="blog"
                            :heading="result.title.rendered ? result.title.rendered : result.title">
                            <div slot="copy">
                                        <div v-html="result.excerpt ? result.excerpt : result.content ? result.content : result.description"></div>
                                    </div>
                            </card>
                            <card v-else-if="result.taxonomy && result.taxonomy ==='services'" class="card--background-gray mt-4" :key="result.id"
                                  content-type="service"
                                  :copy="result.description"
                                  :heading="result.name">
                            </card>
                             <event-card v-else-if="result.start_date"
                        class="card--background-gray"
                        :event="result"
                        heading-class="h4 text--bold mt-4"
                        :truncate-excerpt="true"
                        :key="result.id"
                        />
                        <collection-item v-else-if="result.type && result.type ==='collection-item'" :key="result.id" class="card--background-blue-dark"
                           :item="randomCollectionItem"
                           heading-level="h3"
                           subheading-class="mt-1 text--white"
                           subheading-level="h4"
                           variant="feature"/>

                        </template>

                        <template v-if="filteredSearchResults.length === 0">
                            <p>Sorry, we couldn't find any results.</p>
                        </template>
                    </div>

                </div>

            </div>
        </section>

    </main>
</template>

<script>
import CallToAction from "../patterns/CallToAction.vue"
import Heading from "../elements/Heading.vue"

export default {
  name: "SearchResults",

  components: {
    CallToAction,
    Heading,
  },

  computed: {
    filteredSearchResults() {
      if (!this.filter) {
        return '';
      }

      const regex = new RegExp(`${this.filter}`, 'i');
      return this.searchResults.filter(result => Object.keys(result)
        .some(key => regex.test(result[key])));
    },

    searchResults() {
      let stuff =this.$store.getters.getSiteContent();
      console.log(stuff)
      return stuff
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
