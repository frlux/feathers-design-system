<template>

<component class="person background--gray p-1" :is="element" :class="contentContainerClass">
    <div class="align-items-center d-flex card person">
      <div class="person__avatar" v-if="avatar">
        <img :src="avatar" :class="{'person__avatar-rectangle' : rectangle}">
        </div>
        <div v-else class="person__avatar">
          <img src="https://source.unsplash.com/random/64x64">
          </div>

        <div class="person__content">
            <p class="align-items-center mt-3">
                <span class="text--dark text--bold text--underlined person__name">{{ nice_name }}</span> <br>
                <span class="text--small text--dark" v-if="description" v-html="description"></span>
            </p>
        </div>
    </div>


</component>

</template>
<script>
export default {
  name: "Person",
  computed:{
    avatar(){
      
      if(this.profileImage){
        return this.profileImage === Object(this.profileImage) ? this.getImage(this.profileImage) : this.profileImage;
      }
      let image = [];
      if(this.profile){
        switch(this.type){
          case 'organizer': if(this.profile.image){
            image.url = this.profile.image.url;
            image.w = this.profile.image.width;
            image.h = this.profile.image.height;
            } break;  
        }
      } else if (this.personObject && this.type){
        switch(this.type){
        case 'organizer': 
          const slug = this.personObject.post_name ? this.personObject.post_name : this.personObject.slug;
          const profile = this.fetchPerson(`https://fontana.librarians.design/wp-json/tribe/events/v1/organizers/by-slug/${slug}`);
          image = profile && profile.image ? [url => profile.image.url, w => profile.image.width, h => profile.image.height ] : [] ; break;
        case 'blog': return this.personObject.avatar_URL;
        }
      }
     
      return  this.getImage(image);
    },
    nice_name(){
      if(this.name){
        return this.name;
      }
      if(this.personObject){
        return this.type==='organizer'
                ? this.personObject.organizer || this.personObject.post_title
                : this.type==='blog' && this.personObject.first_name && this.personObject.last_name 
                ? this.personObject.first_name + " " + this.personObject.last_name
                : this.type==='blog' && this.personObject.name
                ? this.personObject.name
                : this.type==='blog'
                ? this.personObject.nice_name
                : this.personObject.name || '';
      }
      return ''
    },
    description(){
      if(this.title){
        return this.title;
      }
       if(this.personObject){
        return this.type==='organizer'
                ? this.personObject.description || this.personObject.post_content
                : this.type==='blog' 
                ? `<a href='https://fontanalib.wordpress.com/author/${this.personObject.login}/Read more from this blogger on Wordpress.com</a>`
                : this.personObject.content || '';
      }
    }
  },
  data(){
    return{
      profile: null,
      rectangle: false,
    }
  },
  methods:{
    async fetchPerson(url){
      await axios.get(url)
        .then((response) =>{
          switch(this.type){
            case 'organizer': this.profile = response.data; return response.data;
            default: this.profile = response.data; return response.data;
          }
        })
        .catch( (error)=>{
          return null;
        })
    },
    getImage(image){
      if(!image || !image.url){
        return null;
      }
      this.rectangle = image.w !== image.h;
      return image.url;
    }
  },
  props: {
    contentContainerClass:{
      type: String
    },
    element:{
      type: String,
      default:"div"
    },
    name: {
      type: String,
    },
    personObject:{
      type: Object
    },
    profileImage: null,
    title:{
      type: String,
    },
    type:{
      type: String,
    },
  },
  mounted(){
    
  }
};
</script>
<style lang="scss">
.person__avatar{
  flex: 0 0 100%;
    margin-left: 1rem;
    margin-right: 1rem;
    max-width: 64px;
    max-height:64px;
    width: 25%;
    overflow:hidden;
    border-radius:50%;
}
.person__avatar img {
  max-width: 100%;
  vertical-align: bottom;
}
.person__avatar-rectangle {
  min-width:64px;
  min-height:64px;
  margin:auto;
}
</style> 