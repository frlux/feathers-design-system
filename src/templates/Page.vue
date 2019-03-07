<template>
    <main class="background--white event" role="main">

        <article v-if="page">
          <header class="col-11 col-md-10 col-lg-6 m-auto p-lg-4">

                <heading class="event__title text--dark text--serif" v-if="page.title.rendered" v-html="page.title.rendered"></heading>
                <heading class="event__title text--dark text--serif" v-else-if="page.title" v-html="page.title"></heading>

                <span class="event__time text--dark" v-if="type ==='blog'">
                    {{page.date | moment("dddd, MMMM Do YYYY")}}
                </span>
                <div class="heading__separator"></div>

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

export default {
  name: "Page",

  components:{
    CallToAction,
    Heading,
    Person,

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