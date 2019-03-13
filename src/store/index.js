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
          const authors = api.fetchData('posts')
        .then( data=>{
          console.log(data);  
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
          resolve();
        });
      });
    },


      async getUpcomingEvents({ commit }) {
        return new Promise(resolve => {
          const authors = api.fetchData('events')
        .then( data=>{
          commit("addCount", {type: 'events', count: data.headers['x-wp-total']});
          commit('addEventsToState', data.data);
          resolve();
        });
      });
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
     /*  const c = contentType ? state[contentType] : [
        ...state.callsToAction,
        ...state.resources,
        ...state.events,
        ...state.pages,
        ...state.posts,
        ...state.articles,
        ...state.collection,
      ]; */
      const c = state[contentType];
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
      

      if(contentType === 'callsToAction'){
        contents.sort(
          (a,b) => (a.acf.priority > b.acf.priority) ? 1
                    : ((b.acf.priority > a.acf.priority) ? -1 
                    :  0));
      }
      
      if (serviceName && serviceName !== 'any') {
        contentsFilteredByService = contentsFilteredByService.filter(
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
      console.log(content);
  
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
      state.articles = articles;
    },

    addAuthorsToState(state, authors) {
      state.authors = authors;
    },

    addCallsToActionToState(state, callsToAction) {
      state.callsToAction = callsToAction;
    },

    addCollectionToState(state, collection) {
      state.collection = collection;
    },

    addEventsToState(state, events) {
      state.events = events;
    },

    addCount(state, count) {
      state.counts[count.type]=count.count;
    },

    addFeaturedCollectionToState(state, featuredCollections) {
      state.featuredCollections = featuredCollections;
    },

    addLocationsToState(state, locations) {
      state.locations = locations;
    },
    
    addMenuItemsToState(state, menuItems) {
      state.menuItems = menuItems;
    },

    addMoreContent(state, payload) {
      console.log("ADDING...");
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
      state.pages = pages;
    },

    addPostsToState(state, posts) {
      state.posts = posts;
    },

    addResourcesToState(state, resources) {
      state.resources = resources;
    },

    addServicesToState(state, services) {
      state.services = services;
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
    }
  }
});
