<template>
    <main class="background--white event" role="main" v-if="page">
      <breadcrumb v-if="page" :route="$route" :title="page.title && page.title.rendered ? page.title.rendered : page.title"/>
        <article v-if="page">
          <header class="col-11 col-md-10 col-lg-6 m-auto p-lg-4">
              <a v-if="type==='blog'"
                  class="wordpress-follow-button"
                  href="https://fontanalib.wordpress.com"
                  data-blog="https://fontanalib.wordpress.com"
                  data-lang="en"
                  data-show-follower-count="true">Follow Shelf Life in the Mountains on WordPress.com</a>

            
                
                <heading class="event__title text--dark text--serif" v-if="page.title && page.title.rendered" v-html="page.title.rendered"></heading>
                <heading class="event__title text--dark text--serif" v-else-if="page.title" v-html="page.title"></heading>

                <em class="event__time text--dark" v-if="type ==='blog'">
                    Posted: {{page.date | moment("dddd, MMMM Do YYYY")}}
                </em>
                <div class="heading__separator"></div>
                <p class="event__excerpt" v-if="page.excerpt && page.excerpt.rendered" v-html="page.excerpt.rendered"></p>
                <p class="event__excerpt" v-else-if="page.excerpt" v-html="page.excerpt"></p>
                <p class="event__excerpt" v-else-if="page.acf && page.acf.description" v-html="page.acf.description"></p>
                <a class="button" v-if="page.acf && page.acf.url" :href="page.acf.url">Visit {{page.acf.name}}</a>
                <div class="mb-3 clearfix" v-if="type === 'blog'">
                  <a :href="page.URL" class="float-left">
                  <c-button aria-label="read on wordpress.com"
                                class="text--uppercase text--white button--blue-alternate"
                                type="button">
                                <svg class="icon" id="icon-wordpress"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M2.597 7.81l4.911 13.454c-3.434-1.668-5.802-5.19-5.802-9.264 0-1.493.32-2.91.891-4.19zm16.352 3.67c0-1.272-.457-2.153-.849-2.839-.521-.849-1.011-1.566-1.011-2.415 0-.978.747-1.88 1.862-1.819-1.831-1.677-4.271-2.701-6.951-2.701-3.596 0-6.76 1.845-8.601 4.64.625.02 1.489.032 3.406-.118.555-.034.62.782.066.847 0 0-.558.065-1.178.098l3.749 11.15 2.253-6.756-1.604-4.394c-.555-.033-1.08-.098-1.08-.098-.555-.033-.49-.881.065-.848 2.212.17 3.271.171 5.455 0 .555-.033.621.783.066.848 0 0-.559.065-1.178.098l3.72 11.065 1.027-3.431c.444-1.423.783-2.446.783-3.327zm-6.768 1.42l-3.089 8.975c.922.271 1.898.419 2.908.419 1.199 0 2.349-.207 3.418-.583-.086-.139-3.181-8.657-3.237-8.811zm8.852-5.839c.224 1.651-.099 3.208-.713 4.746l-3.145 9.091c3.061-1.784 5.119-5.1 5.119-8.898 0-1.79-.457-3.473-1.261-4.939zm2.967 4.939c0 6.617-5.384 12-12 12s-12-5.383-12-12 5.383-12 12-12 12 5.383 12 12zm-.55 0c0-6.313-5.137-11.45-11.45-11.45s-11.45 5.137-11.45 11.45 5.137 11.45 11.45 11.45 11.45-5.137 11.45-11.45z"/></svg>
                                Read it on WordPress
                  </c-button>
                  </a>
                  <div class="page__stats mt-1 float-right">
                    <a class="btn button--pink btn-sm" v-on:click="count=1">
                                <svg class="icon" id="icon-like" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 4.248c-3.148-5.402-12-3.825-12 2.944 0 4.661 5.571 9.427 12 15.808 6.43-6.381 12-11.147 12-15.808 0-6.792-8.875-8.306-12-2.944z"/></svg>
                                  Likes <span class="badge badge-light">{{page.like_count + count}}</span></a>

                      <a :href="page.URL+'#comments'" class="btn btn-sm button--aqua">
                      <svg class="icon" id="icon-like" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" fill-rule="evenodd" clip-rule="evenodd"><path d="M20 15c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1m-3 0c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1m-3 0c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1m5.415 4.946c-1 .256-1.989.482-3.324.482-3.465 0-7.091-2.065-7.091-5.423 0-3.128 3.14-5.672 7-5.672 3.844 0 7 2.542 7 5.672 0 1.591-.646 2.527-1.481 3.527l.839 2.686-2.943-1.272zm-13.373-3.375l-4.389 1.896 1.256-4.012c-1.121-1.341-1.909-2.665-1.909-4.699 0-4.277 4.262-7.756 9.5-7.756 5.018 0 9.128 3.194 9.467 7.222-1.19-.566-2.551-.889-3.967-.889-4.199 0-8 2.797-8 6.672 0 .712.147 1.4.411 2.049-.953-.126-1.546-.272-2.369-.483m17.958-1.566c0-2.172-1.199-4.015-3.002-5.21l.002-.039c0-5.086-4.988-8.756-10.5-8.756-5.546 0-10.5 3.698-10.5 8.756 0 1.794.646 3.556 1.791 4.922l-1.744 5.572 6.078-2.625c.982.253 1.932.407 2.85.489 1.317 1.953 3.876 3.314 7.116 3.314 1.019 0 2.105-.135 3.242-.428l4.631 2-1.328-4.245c.871-1.042 1.364-2.384 1.364-3.75"/></svg>
                      Comments <span class="badge badge-light">{{page.discussion.comment_count}}</span></a>
                    </div>
                  
                                
                </div>
                

                <div class="col-6 mr-1" v-if="author">

                        <person contentContainerClass= "d-flex row mb-3 person" 
                                :type="type"
                                :personObject="author"
                                >
                                </person>
                      </div>
                </header>

                
                <section class="background--gray page__content">

                <div class="col-11 col-md-10 col-lg-6 m-auto pt-4 pb-4 p-lg-4">

                    <div v-if="page.content && page.content.rendered" v-html="page.content.rendered"></div>
                    <div v-else-if="page.content" v-html="page.content"></div>

                </div>
            </section>
        </article>
    </main>
</template>

<script>
import * as api from "../store/api.js";
import Breadcrumb from "../elements/Breadcrumb.vue";
import CButton from "../elements/Button.vue";
import CallToAction from '../patterns/CallToAction.vue';
import Heading from '../elements/Heading.vue';
import Person from '../patterns/Person.vue';

(function(d){var f = d.getElementsByTagName('SCRIPT')[0], p = d.createElement('SCRIPT');p.type = 'text/javascript';p.async = true;p.src = '//widgets.wp.com/platform.js';f.parentNode.insertBefore(p,f);}(document));
export default {
  name: "Page",

  components:{
    Breadcrumb,
    CButton,
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
      if(this.page.type === 'page'){
        return null;
      }
      if(this.type==='blog'){
        return this.page.author;
      } else if(!isNaN(parseFloat(this.page.author)) && isFinite(this.page.author)){
        let wpAuthor =this.$store.getters.getAuthorById(this.page.author);
        return wpAuthor;
      }
    }

  },
  data(){
    return{
      count: 0,
      page: null,
      related:[],
    }
  },
  methods:{
     getPage(slug, type){
      if(this.pageObject && (this.pageObject.slug || this.pageObject.id)){
        return this.pageObject;
      } 
      /* let page = this.$store.getters.getContentBySlug(slug, type);
      if(page){
        return page;
      } */

      let page = this.fetchPage(type).then(page=>{
        let t = page.type=='page' ? 'pages' : page.type=='post' && page.site_ID ? 'posts' : page.type=='post' ? 'articles' : page.type+'s';
      this.page=page;
      this.$store.commit('addMoreContent', {contentType: t, content:[page]});
      });
      

      return page;
 
    },
    async fetchPage(type){
      let post;
      await api.fetchData('articles', {slug: this.$route.params.slug}).then(results=>{
        if(type=='articles'){
          post = results.data[0];
        }
        this.related = [...this.related, ...results.data];
      })
     await api.fetchData('posts', {slug: this.$route.params.slug}).then(results=>{
        if(type=='articles' || (type=='articles' && !post)){
          post = results.data[0];
        }
        this.related = [...this.related, ...results.data];
      })
      await api.fetchData('pages', {slug: this.$route.params.slug}).then(results=>{
        if(!post){
          post = results.data[0];
        }
        this.related = [...this.related, results.data];
      })
      await api.fetchData('resources', {slug: this.$route.params.slug}).then(results=>{
        if(!post){
          post = results.data[0];
        }
        this.related = [...this.related, results.data];
      })
      
      if(!post){
        post=this.related[0];
      }
      console.log(post);
      return post;
    }
  },
  beforeMount(){
    if(!this.pageObject){
      this.getPage(this.$route.params.slug, this.$route.name);
    }

  },
  mounted(){
    this.page = this.getPage(this.$route.params.slug, this.$route.name);
  },
  watch:{
    pageObject(){
      this.page = this.getPage();
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
@import "~bootstrap/scss/_badge";
@import "~bootstrap/scss/_breadcrumb";
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