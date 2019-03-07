<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
      <li v-for="item in trail" :key="item.text" class="breadcrumb-item" :class="item.active ? 'active' : ''">
        <router-link v-if="item.to && !item.active" :to="item.to">{{ item.text }}</router-link>
        <a v-else-if="!item.active && item.href" :href="item.href" >{{ item.text }}</a>
        <span v-else>{{item.text}}</span>
      </li>
    </ol>
  </nav>
</template>
<script>
export default {
  name: "Breadcrumb",
  computed:{
    trail(){
      if(this.items && this.items.length>0){
        return this.items;
      }
      if(this.route){
        return this.getItemsFromRoute();
      }
    }
  },
  methods:{
    getItemsFromRoute(){
      console.log(this.route);
      let items = [];
      if(this.route && this.route.name){
        const current = this.route.params.pageObject ?
            {text: this.route.params.pageObject.title.rendered || this.route.params.pageObject.title,
             active: true}
            : { text: this.route.params.slug, active: true};

        if(this.route.name == 'Channel-slug'){
          const parent = {text: this.route.params.type.charAt(0).toUpperCase() + this.route.params.type.slice(1),
                          to: {name: 'Channel-'+this.route.params.type}}
          items.push(parent, current);
          console.log(items);
          return items;
        }
      }
     items = [
          {
            text: 'Blog',
            to: { name: 'Channel-blog' }
          },
          {
            text: 'GGG',
            href: 'https://fontanalib.wordpress.com',
            active: true
          }
        ];
      return items;
    }
  
  },
  mounted(){
    
  },
  watch:{
    $route(){
      
    }
  },
  props:{
    route:{
      type: Object
    },
    items:{
      type: Array
    }
  }
}
</script>
<style lang="scss">
@import "~bootstrap/scss/_breadcrumb";
</style>
