<template>
    <component class="call-to-action" :is="element">

        <card :button-label="action"
              class="align-items-center card--background-blue-base col-sm-10 d-md-flex flex-row-reverse justify-content-end m-md-auto pl-0"
              :copy="copy"
              :heading="heading"
              :image="image"
              type="deck">

            <template slot="action" v-if="link">
                <a class="button button--aqua button--large"
                             :href="link">
                    {{ action }}
                </a>
            </template>

        </card>

        <div class="background-image-test d-none d-sm-block"
             :style="`background-image: url(${image});`"></div>

    </component>
</template>

<script>
import Card from "../patterns/Card.vue"

export default {
  name: "CallToAction",

  components: {
    Card,
  },

  props: {
    action: {
      required: true,
      type: String,
    },
    copy: {
      required: true,
      type: String,
    },
    element: {
      default: "div",
      type: String,
    },
    image: {
      required: true,
      type: String,
    },
    heading: {
      required: true,
      type: String,
    },
    link: {
      type: String,
    },
  },
}
</script>

<style>
.call-to-action {
  position: relative;
}
</style>
