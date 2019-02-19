<template>

    <div class="showcase">

        <card class="card--background-gray mb-3"
              content-type="collection"
              :heading="heading">

            <template slot="copy">

                <div class="d-flex flex-wrap">
                    <div class="col-6 col-sm-4 col-md-4 col-xl-2 showcase__card"
                         :key="item.id"
                         v-for="(item, index) in collectionItems"
                         v-if="index < 6">

                        <a class="link link--undecorated" :href="`https://www.nccardinal.org/eg/opac/record/${item.acf.record_identifier}`">

                            <card content-container-class="p-0"
                                  :heading="item.title.rendered"
                                  heading-class="h4 text--bold text--nowrap text--ellipsis"
                                  heading-level="h3"
                                  :image="item.featured_image"
                                  :subheading="showcaseCreators(item)"
                                  subheading-class="h5 mt-1 text--nowrap text--ellipsis"
                                  subheading-level="h4"
                                  v-if="item">
                            </card>

                        </a>

                    </div>
                </div>

                <router-link class="link"
                             :to="collectionLink"
                             v-if="collectionLink">
                    {{ collectionLinkLabel }}
                </router-link>

            </template>

        </card>

    </div>

</template>

<script>
import Card from './Card.vue';

export default {
  name: 'Showcase',

  component: {
    Card,
  },

  methods: {
    showcaseCreators(item) {
      const { creators } = item.acf;
      const { name: creatorName } = creators.find(creator => creator.name);
      const hasMoreThanOneCreator = creators.length > 1;

      return `by ${creatorName} ${hasMoreThanOneCreator ? 'and others' : ''}`;
    },
  },

  props: {
    collectionLink: {
      type: String,
    },

    collectionLinkLabel: {
      default: 'See more',
      type: String,
    },

    collectionItems: {
      required: true,
      type: Array,
    },

    heading: {
      required: true,
      type: String,
    },
  },
};
</script>
<style lang="scss">
body {
  background-color:red;
  @media (min-width: 576px) {
  background-color:lime;
  }
  @media (min-width:992px) {
  background-color:yellow;
  }

}
.showcase__card{
  @media only screen and (max-width: 900px) and (min-width:768px) {padding-right:.5vw !important; padding-left:.5vw !important} 
}
.card__image{
  
  /* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {height:40vw;} 

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {height:30vw;} 

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {height:12vw;} 

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {height:15vw;} 

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {height:9vw;}
}
.card__image img{
  height:100%;
  width:auto !important;
  object-fit: cover;


}
</style>