<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><router-link to="/">Home</router-link></li>
      <li v-for="item in trail" :key="item.text" class="breadcrumb-item" :class="item.active ? 'active' : ''">
        <router-link v-if="item.to && !item.active" :to="item.to" v-html="item.text"></router-link>
        <a v-else-if="!item.active && item.href" :href="item.href" ></a>
        <span v-else v-html="item.text"></span>
      </li>
    </ol>
  </nav>
</template>
<script>
export default {
  name: "Breadcrumb",
  status: "prototype",
  release: "1.0.0",
  computed:{
    trail(){
      if(this.items && this.items.length>0){
        return this.items;
      }
      
      return this.getItemsFromRoute();
    
    }
  },
  methods:{
    getItemsFromRoute(){
      let items = [];
    

        const current = this.$route.params.object ?
            {text: this.$route.params.object.title.rendered || this.$route.params.object.title,
             active: true}
            : this.title ? {text: this.title, active: true}
            : this.title ? {text: this.title, active: true} 
            : {text: this.$route.params.slug, active: true};

        if(this.$route.meta && this.$route.meta.grandParent){
          const grandParent = {text: this.$route.meta.grandParent[0].toUpperCase() + this.$route.meta.grandParent.substring(1).toLowerCase(), to: {name: this.$route.meta.grandParent}};
          items.push(grandParent);
        }

        if(this.$route.meta && this.$route.meta.parent){
          const parent = {text: this.$route.meta.parent.text, to: {name: this.$route.meta.parent.name}};
          items.push(parent);
        }

          items.push(current);
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
.breadcrumb{
  margin-top:0;
}
</style>
<docs>
  ```jsx
  <div>
<breadcrumb route="$route" title="Page Title" :items='[{text: "Parent", to:"blog"}, {text: "Child", to:"blog-slug"}]'/>
  </div>
  ```
</docs>
