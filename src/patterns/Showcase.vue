<template>

    <div class="showcase">

        <card class="card--background-gray mb-3"
              content-type="collection"
              :heading="heading">

            <template slot="copy">

                <div class="d-flex flex-wrap">
                    <div class="col-6 col-md-2"
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
                                  subheading-level="h4">
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
