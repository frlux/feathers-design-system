<template>
    <main class="background--white event" role="main">

        <article v-if="page">
          <header class="col-11 col-md-10 col-lg-6 m-auto p-lg-4">

                <heading class="event__title text--dark text--serif" v-if="page.title.rendered" v-html="page.title.rendered"></heading>
                <heading class="event__title text--dark text--serif" v-else-if="page.title" v-html="page.title"></heading>

                <em class="event__time text--dark" v-if="type ==='blog'">
                    Posted: {{page.date | moment("dddd, MMMM Do YYYY")}}
                </em>
                <div class="heading__separator"></div>
                <p class="event__excerpt" v-if="page.excerpt" v-html="page.excerpt"></p>
                <div class="mb-3" v-if="type === 'blog'">
                  <a :href="page.URL">
                  <c-button aria-label="read on wordpress.com"
                                class="text--uppercase text--white button--blue-alternate"
                                type="button">
                                <svg class="icon" id="icon-wordpress"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M2.597 7.81l4.911 13.454c-3.434-1.668-5.802-5.19-5.802-9.264 0-1.493.32-2.91.891-4.19zm16.352 3.67c0-1.272-.457-2.153-.849-2.839-.521-.849-1.011-1.566-1.011-2.415 0-.978.747-1.88 1.862-1.819-1.831-1.677-4.271-2.701-6.951-2.701-3.596 0-6.76 1.845-8.601 4.64.625.02 1.489.032 3.406-.118.555-.034.62.782.066.847 0 0-.558.065-1.178.098l3.749 11.15 2.253-6.756-1.604-4.394c-.555-.033-1.08-.098-1.08-.098-.555-.033-.49-.881.065-.848 2.212.17 3.271.171 5.455 0 .555-.033.621.783.066.848 0 0-.559.065-1.178.098l3.72 11.065 1.027-3.431c.444-1.423.783-2.446.783-3.327zm-6.768 1.42l-3.089 8.975c.922.271 1.898.419 2.908.419 1.199 0 2.349-.207 3.418-.583-.086-.139-3.181-8.657-3.237-8.811zm8.852-5.839c.224 1.651-.099 3.208-.713 4.746l-3.145 9.091c3.061-1.784 5.119-5.1 5.119-8.898 0-1.79-.457-3.473-1.261-4.939zm2.967 4.939c0 6.617-5.384 12-12 12s-12-5.383-12-12 5.383-12 12-12 12 5.383 12 12zm-.55 0c0-6.313-5.137-11.45-11.45-11.45s-11.45 5.137-11.45 11.45 5.137 11.45 11.45 11.45 11.45-5.137 11.45-11.45z"/></svg>
                                Read it on WordPress
                  </c-button>
                  </a>
                </div>
                

                <div class="col-6 mr-1" v-if="author">

                        <person contentContainerClass= "d-flex row mb-3 person" 
                                :type="type"
                                :personObject="author">
                                </person>
                      </div>
                </header>

                
                <section class="background--gray page__content">

                <div class="col-11 col-md-10 col-lg-6 m-auto pt-4 pb-4 p-lg-4">

                    <div v-if="page.content.rendered" v-html="page.content.rendered"></div>
                    <div v-else-if="page.content" v-html="page.content"></div>

                </div>
            </section>
        </article>
    </main>
</template>

<script>
import * as api from "../store/api.js";
import CallToAction from '../patterns/CallToAction.vue';
import Heading from '../elements/Heading.vue';
import Person from '../patterns/Person.vue';
import CButton from "../elements/Button.vue";

export default {
  name: "Page",

  components:{
    CallToAction,
    Heading,
    Person,
    CButton
  },
  computed:{
    type(){
      if(this.page.type==='post'){
        if(this.page.site_ID && this.page.site_ID == 11573626){
          return 'blog';
        }
        return 'article';
      }
      return this.page.type || null;
    },
    author(){
      if(this.type==='blog'){
        return this.page.author;
      }else if(!isNaN(parseFloat(this.page.author)) && isFinite(this.page.author)){
        return this.$store.getters.getAuthorByID(this.page.author);
      }
    }

  },
  data(){
    return{
      page: this.pageObject,
    }
  },
  mounted(){
    console.log(this.$route);
  },
  watch:{
    pageObject(){
      this.page = this.pageObject;
    }

  },
  props:{
    pageObject: {
      type:Object
    },
    moreContent:{
      type: Array
    },
  }
}
</script>
<style lang="scss">
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

.page__content {
  font-size:1rem;
  color: $color_blue_dark;
  
  
  p{
    margin: 2em 0;
  }
  .tiled-gallery{
    margin:auto;
    padding:2em 0;
    text-align:center;
    display:flex;
    flex-flow: column;
    align-items: center;
    .gallery-row{
      display:flex;
      flex-flow:row wrap;
      .gallery-group{
        display:flex;
        flex-flow:column;
        a{
          display:flex;
          flex-flow:column;
        }
      }
    }
    .tiled-gallery-item{
      margin-bottom:1em;
    }
  }
  .alignnone{
    max-width:100%;
    img{
      max-width:100%;
      height:auto;
    }
  }
  .wp-caption-text,
  .tiled-gallery-caption{
    text-align:center;
    margin-top:0;
    font-style: italic;
    color:$color_blue_alternate;
  }
}

</style>