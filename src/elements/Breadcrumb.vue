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
      let items = [];
      console.log(this.route);
    

        const current = this.route.params.pageObject ?
            {text: this.route.params.pageObject.title.rendered || this.route.params.pageObject.title,
             active: true}
            : this.title ? {text: this.title, active: true} 
            : { text: this.route.params.slug, active: true};

        
          const parent = {text: this.route.meta.parent[0].toUpperCase() + this.route.meta.parent.substring(1).toLowerCase(), to: {name: this.route.meta.parent}};

          items.push(parent, current);
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
    },
    title:{
      type: String,
    }
  }
}
</script>
<style lang="scss">
@import "~bootstrap/scss/_breadcrumb";
</style>
