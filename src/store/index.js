import Vue from "vue";
import Vuex from "vuex";

import * as api from "./api.js";
Vue.use(Vuex);


export default new Vuex.Store({
  state: {
    authors: [],
    callsToAction: [],
    collection: [],
    events: [],
    featuredCollections: [],
    locations: [],
    menu: [],
    pages: [],
    posts: [],
    articles: [],
    resources: [],
    services: [],
    userLocation: null,
    audience: [],
    genres: [],
    counts: {
      events: 0,
      pages: 0,
      posts: 0,
      articles: 0,
      resources: 0,
    },
    serviceCall:{
      callsToAction: 0,
      events: 0,
      pages: 0,
      posts: 0,
      articles: 0,
      collection: 0,
      resources: 0,
    }
  },

  actions: {
    async getAudiences({ commit }) {
      return new Promise(resolve => {
        const authors = api.fetchData('audience', {per_page: 50})
      .then( data=>{
        resolve();
        commit('addTermsToState', {taxonomy: 'audience', terms: data.data});
      });
    });
  },
  async getMenus({ commit }) {
    return new Promise(resolve => {
      const authors = api.fetchData('menuItems')
    .then( data=>{
      data.data.forEach(menu=>{
        const items = api.fetchMenu(menu.slug)
          .then(results=>{
          menu.menu = results.data;
          commit('addMenuItemsToState', [menu]);
          })
          resolve();
      })
     
      
    });
  });
    /* return new Promise(resolve => {
      const authors = api.fetchData('menuItems')
    .then( data=>{
      data.data.forEach(item=>{
        api.fetchData('menuItems', [], '/'+item.slug).then(menus=>{
          let menu ={name: item.slug, items: menus.data};
          commit('addMenuItemsToState', menu);
        }
        ).catch(error => {console.log(error)})
      })
      resolve();
    });
  }); */
},
    async getAuthors({ commit }) {
      return new Promise(resolve => {
        const authors = api.fetchData('authors')
      .then( data=>{
        commit('addAuthorsToState', data.data);
        resolve();
      });
    });
    },

      async getCallsToAction({ commit }) {
        return new Promise(resolve => {
          const authors = api.fetchData('callsToAction')
        .then( data=>{
          commit('addCallsToActionToState', data.data);
          resolve();
        });
      });
    },

      async getCollection({ commit }) {
        return new Promise(resolve => {
          const authors = api.fetchData('collection')
        .then( data=>{
          commit('addCollectionToState', data.data);
          resolve();
        });
      });
      
    },

      async getFeaturedCollections({ commit }) {
        return new Promise(resolve => {
          const authors = api.fetchData('featuredCollections')
        .then( data=>{
          commit('addFeaturedCollectionToState', data.data);
          resolve();
        });
      });
    },

    async getGenres({ commit }) {
      return new Promise(resolve => {
        const authors = api.fetchData('genres', {per_page: 50})
      .then( data=>{
        resolve();
        commit('addTermsToState', {taxonomy: 'genres', terms: data.data});
      });
    });
  },

      async getLocations({ commit }) {
        return new Promise(resolve => {
          const authors = api.fetchData('locations')
        .then( data=>{
          commit('addLocationsToState', data.data);
          resolve();
        });
      });
    },

      async getPages({ commit }) {
        return new Promise(resolve => {
          const authors = api.fetchData('pages')
        .then( data=>{
          commit("addCount", {type: 'pages', count: data.headers['x-wp-total']});
          commit('addPagesToState', data.data);
          resolve();
        });
      });
    },


      async getPosts({ commit }) {
        return new Promise(resolve => {
          const authors = api.fetchData('posts',{number: 10})
        .then( data=>{
          commit("addCount",{type: 'posts', count: data.data.found});        
          commit('addPostsToState', data.data.posts);
          resolve();
        });
      });
    },

      async getArticles({ commit }) {
        return new Promise(resolve => {
          const authors = api.fetchData('articles')
        .then( data=>{
          commit("addCount", {type: 'articles', count: data.headers['x-wp-total']});
          commit('addArticlesToState', data.data);
          resolve();
        });
      });
    },

      async getResources({ commit }) {
        return new Promise(resolve => {
          const authors = api.fetchData('resources')
        .then( data=>{
          commit("addCount", {type: 'resources', count: data.headers['x-wp-total']});
          commit('addResourcesToState', data.data);
          resolve();
        });
      });
    },


      async getServices({ commit }) {
        return new Promise(resolve => {
          const authors = api.fetchData('services',{per_page: 100})
        .then( data=>{
          commit('addServicesToState', data.data);
          resolve(data.data);
        });
      });
    },


      async getUpcomingEvents({ commit }) {
        return new Promise(resolve => {
          const authors = api.fetchData('events', {per_page: 100})
        .then( data=>{
          commit("addCount", {type: 'events', count: data.headers['x-wp-total']});
          commit('addEventsToState', data.data);
          resolve();
        });
      });
    },
    async getServiceContent({ commit }, serviceObject){
      //const serviceObject = state.services.find(service => service.slug == serviceSlug);
      console.log("serviceObject");
      console.log(serviceObject);
      serviceObject._links['wp:post_type'].forEach(link=>{
        
        let name = link.href.match(/(?:\/([a-z|-]*?)\?)/);
        name=name[1]=='calls-to-action' ? 'callsToAction' : name[1];
        console.log(name);
      api.fetchLink(link.href)
          .then(response =>{
            console.log("API FETCHLINK")
            console.log(response);
            commit("addServiceContent", {contentType: name, content: response.headers});
            commit("addMoreContent", {contentType: name, content: response.data});
          }).catch(error=> console.log(error));
      }
    )
  },
},

  getters: {
    getAuthorById: state => authorId => state.authors.find(author => author.id === authorId),

    getCallsToActionByCategory: state => categoryName => {
      const actionsByService = state.callsToAction.filter(
        call =>
          call.acf.services && call.acf.services.some(service => service.slug === categoryName)
      );

      return actionsByService;
    },
    getContentByService: state => (contentType = null, serviceName = null, locationName = null) => {
    
     let c = contentType ? state[contentType] : [
        ...state.resources,
        ...state.events,
        ...state.pages,
        ...state.posts,
        ...state.articles,
        ...state.collection,
      ];
      console.log("getContentByService");
      
      //const c = state[contentType];
      let contents;
      let contentsFilteredByService = [];

  
      if (locationName && locationName !== 'all') {
        contents = c.filter(
          page => page.acf && page.acf.location && page.acf.location.some(location => location.slug === locationName)
        );

        if(!contents || contents.length < 1){
          contents = c.filter(
            page => !page.acf.location || page.acf.location.some(location => location.slug === 'headquarters')
          );
        }
      } else {
        contents = c;
      }
      

      if(contentType && contentType === 'callsToAction'){
        contents.sort(
          (a,b) => (a.acf.priority > b.acf.priority) ? 1
                    : ((b.acf.priority > a.acf.priority) ? -1 
                    :  0));
      }
      
      if (serviceName && serviceName !== 'any') {
        contentsFilteredByService = contents.filter(
          page => page.acf && page.acf.services && page.acf.services.some(service => service.slug === serviceName)
        );
      } 
      
      return serviceName && serviceName !== 'any' ? contentsFilteredByService : contents;
    },

    getEvents: state => (dateString = null, locationName = null) => {
      let events;
      let eventsFilteredByLocation;

      if (dateString) {
        events = state.events.filter(
          event =>
            `${event.start_date_details.year}-${
              event.start_date_details.month
            }-${event.start_date_details.day}` === dateString
        );
      } else {
        events = state.events;
      }

      if (locationName && locationName !== 'all') {
        eventsFilteredByLocation = events.filter(
          event => event.acf.location && event.acf.location.some(location => location.slug === locationName)
        );
      }

      return locationName && locationName !== 'all' ? eventsFilteredByLocation : events;
    },

    getEventBySlug: state => slug => {
      return state.events.find(event => event.slug === slug);
    },

    /**
     * We can use `getRandomContentItem(services)` -- for example -- to return
     * a random service.
     */
    getRandomContentItem: state => (contentType) => {
      const content = state[contentType];
      return content[Math.floor(Math.random() * content.length)];
    },

    getSiteContent: state => () => {
      return [
        ...state.collection,
        ...state.events,
        ...state.pages,
        ...state.posts,
        ...state.services,
        ...state.resources,
        ...state.locations,
        ...state.articles,
      ];
    },

    getServiceBySlug: state => slug => state.services.find(service => service.slug === slug),
    getLocationBySlug: state => slug => state.locations.find(location => location.slug === slug),
    getContentBySlug: state => (slug, type=null, all=null) => {
      
      let content = !type ? [
        ...state.articles,
        ...state.pages,
        ...state.posts,
      ] : type=='blog' ? state.posts : state[type];
      if(!content || content.length < 1){
        return null;
      }
    
      content = content.filter(item => item.slug && item.slug === slug);
  
      return !all ? content[0] : content;
    },
    getTerm: state => (tid, taxonomy=null) => {
      let terms = taxonomy ? state[taxonomy] : [
        ...state.genres,
        ...state.audience,
        ...state.featuredCollections,
        ...state.services
      ];

      return isNaN(tid) ? terms.find(term => term.slug == tid) : terms.find(term => term.id == tid)
    }
  },

  mutations: {
    addArticlesToState(state, articles) {
      if(!state.articles || state.articles.length == 0){
        state.articles = articles;
      } else{
        for (let i=0; i < articles.length; i++){
          const index = state.articles.findIndex(item => item.id === articles[i].id)
          if (index === -1){ 
            state.articles.push(articles[i]);
          }
        }
      }
      
    },
  
    addAuthorsToState(state, authors) {
      state.authors = authors;
    },
  
    addCallsToActionToState(state, callsToAction) {
      if(!state.callsToAction || state.callsToAction.length == 0){
        state.callsToAction = callsToAction;
      } else{
        for (let i=0; i < callsToAction.length; i++){
          const index = state.callsToAction.findIndex(item => item.id === callsToAction[i].id)
          if (index === -1){ 
            state.callsToAction.push(callsToAction[i]);
          }
        }
      }
    },
  
    addCollectionToState(state, collection) {
      if(!state.collection || state.collection.length == 0){
        state.collection = collection;
      }else{
        for (let i=0; i < collection.length; i++){
          const index = state.collection.findIndex(item => item.id === collection[i].id)
          if (index === -1){ 
            state.collection.push(collection[i]);
          }
        }
      }
    },
  
    addEventsToState(state, events) {
      if(!state.events || state.events.length == 0){
        state.events = events;
      }else{
        for (let i=0; i < events.length; i++){
          const index = state.events.findIndex(item => item.id === events[i].id)
          if (index === -1){ 
            state.events.push(events[i]);
          }
        }
      }
    },
  
    addCount(state, count) {
      state.counts[count.type]=count.count;
    },
  
    addFeaturedCollectionToState(state, featuredCollections) {
      if(!state.featuredCollections || state.featuredCollections.length == 0){
      state.featuredCollections = featuredCollections;
      }else{
        for (let i=0; i < featuredCollections.length; i++){
          const index = state.featuredCollections.findIndex(item => item.id === featuredCollections[i].id)
          if (index === -1){ 
            state.featuredCollections.push(featuredCollections[i]);
          }
        }
      }
    },
  
    addLocationsToState(state, locations) {
      state.locations = locations;
    },
    
    addMenuItemsToState(state, menu) {
        if(!state.menu || state.menu.length == 0){
          state.menu = menu;
          }else{
            for (let i=0; i < menu.length; i++){
              const index = state.menu.findIndex(item => item.slug === menu[i].slug)
              if (index === -1){ 
                state.menu.push(menu[i]);
              }
            }
          }
    },
  
  
    addMoreContent(state, payload) {
      if(!Array.isArray(payload.content)){
        payload.content = [payload.content];
      }
      if(!state[payload.contentType] || state[payload.contentType].length == 0){
        state[payload.contentType] = payload.content;
      }
      for (let i=0; i < payload.content.length; i++){
        const index = state[payload.contentType].findIndex(item => item.id === payload.content[i].id)
        if (index === -1){ 
          state[payload.contentType].push(payload.content[i]);
        }
      }
    },
  
    addMoreEvents(state, moreEvents){
      for (let i=0; i < moreEvents.length; i++){
        const index = state.events.findIndex(event => event.id === moreEvents[i].id)
        if (index === -1){ 
          state.events.push(moreEvents[i]);
        }
      }
    },
  
    addPagesToState(state, pages) {
      if(!state.pages || state.pages.length==0){
      state.pages = pages;
      }else{
        for (let i=0; i < pages.length; i++){
          const index = state.pages.findIndex(item => item.id === pages[i].id)
          if (index === -1){ 
            state.pages.push(pages[i]);
          }
        }
      }
    },
  
    addPostsToState(state, posts) {
      if(!state.posts || state.posts.length==0){
      state.posts = posts;
      }else{
        for (let i=0; i < posts.length; i++){
          const index = state.posts.findIndex(item => item.id === posts[i].id)
          if (index === -1){ 
            state.posts.push(posts[i]);
          }
        }
      }
    },
  
    addResourcesToState(state, resources) {
      if(!state.resources || state.resources.length==0){
        state.resources = resources;
        }else{
          for (let i=0; i < resources.length; i++){
            const index = state.resources.findIndex(item => item.id === resources[i].id)
            if (index === -1){ 
              state.resources.push(resources[i]);
            }
          }
        }
    },
  
    addServicesToState(state, services) {
      if(!state.services || state.services.length==0){
        state.services = services;
        }else{
          for (let i=0; i < services.length; i++){
            const index = state.services.findIndex(item => item.id === services[i].id)
            if (index === -1){ 
              state.services.push(services[i]);
            }
          }
        }
    },
  
    setUserLocation(state, location){
      state.userLocation = location!=='all' ? location : null;
    },
    addTermsToState(state, payload){
      if(state[payload.taxonomy].length < 1){
        state[payload.taxonomy] = payload.terms;
      } else {
        for (let i=0; i < payload.terms.length; i++){
          const index = state[payload.taxonomy].findIndex(term => term.id === payload.terms[i].id)
          if (index === -1){ 
            state[payload.taxonomy].push(payload.terms[i]);
          }
        }
      }
    },
    addServiceContent(state, payload){
      state.serviceCall[payload.contentType] = Number(payload.content['x-wp-total']);
    },
  }
});
