<template>
    <main class="channel" role="main">
        <template v-for="(call, index) in callsToAction" v-if="index === 0">
            <call-to-action :action="call.acf.action"
                            class="p-3"
                            :copy="call.acf.copy"
                            image="https://source.unsplash.com/random"
                            :heading="call.acf.heading"></call-to-action>
        </template>

        <section class="background--white d-flex p-4">

            <div class="col-md-10 m-auto">

                <div class="col-md-8">

                    <heading class="channel__title text--dark text--serif" level="h1">
                        {{ service.name }}
                    </heading>

                    <p class="channel__description">{{ service.description }}</p>

                    {{ pages }}

                </div>

                <div class="col-md-4">
                    Sidebar
                </div>

            </div>

        </section>
   </main>
</template>

<script>
import CallToAction from "../patterns/CallToAction.vue"
import Heading from "../elements/Heading.vue"

export default {
  name: "Channel",

  components: {
    CallToAction,
    Heading,
  },

  computed: {
    callsToAction() {
      return this.$store.getters.getCallsToActionByCategory(this.slug)
    },

    collection() {
      return this.$store.getters.getContentByService("collection", this.slug)
    },

    pages() {
      return this.$store.getters.getContentByService("pages", this.slug)
    },

    service() {
      return this.$store.getters.getServiceBySlug(this.slug)
    },
  },

  props: {
    slug: {
      default: "any",
      required: true,
      type: String,
    },
  },
}
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
