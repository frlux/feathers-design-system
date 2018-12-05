import Vue from "vue";
import Vuex from "vuex";

import axios from "axios";

Vue.use(Vuex);
const urls = {
authors: 'https://fontana.librarians.design/wp-json/wp/v2/users',
callsToAction: 'https://fontana.librarians.design/wp-json/wp/v2/calls-to-action',
collection: 'https://fontana.librarians.design/wp-json/wp/v2/collection?_embed',
featuredCollections: 'https://fontana.librarians.design/wp-json/wp/v2/featured-collections',
locations: 'https://fontana.librarians.design/wp-json/wp/v2/locations',
pages: 'https://fontana.librarians.design/wp-json/wp/v2/pages',
posts: 'https://public-api.wordpress.com/rest/v1.1/sites/fontanalib.wordpress.com/posts/?number=10',
articles: 'https://fontana.librarians.design/wp-json/wp/v2/posts',
resources: 'https://fontana.librarians.design/wp-json/wp/v2/resources',
services: 'https://fontana.librarians.design/wp-json/wp/v2/services?per_page=50',
events: 'https://fontana.librarians.design/wp-json/wp/v2/events',
};

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
    eventCount: 0,
  },

  actions: {
    getAuthors({ commit }) {
      return new Promise((resolve) => {
        axios
          .get(urls.authors)
          .then(({ data }) => {
            commit('addAuthorsToState', data);
            resolve();
          });
      });
    },

    getCallsToAction({ commit }) {
      return new Promise(resolve => {
        axios
          .get(urls.callsToAction)
          .then(({ data }) => {
            commit("addCallsToActionToState", data);
            resolve();
          });
      });
    },

    getCollection({ commit }) {
      return new Promise((resolve) => {
        axios
          .get(urls.collection)
          .then(({ data }) => {
            commit('addCollectionToState', data);
            resolve();
          });
      });
    },

    getFeaturedCollections({ commit }) {
      return new Promise(resolve => {
        axios.get(urls.featuredCollections)
          .then(({ data }) => {
            commit('addFeaturedCollectionToState', data);
            resolve();
          });
      });
    },

    getLocations({ commit }) {
      return new Promise(resolve => {
        axios
          .get(urls.locations)
          .then(({ data }) => {
            commit("addLocationsToState", data);
            resolve();
          });
      });
    },

    getPages({ commit }) {
      return new Promise(resolve => {
        axios
          .get(urls.pages)
          .then(({ data }) => {
            commit("addPagesToState", data);
            resolve();
          });
      });
    },

    getPosts({ commit }) {
      return new Promise(resolve => {
        axios
          .get(urls.posts)
          .then(({ data }) => {
            commit("addPostsToState", data.posts);
            resolve();
          });
      });
    },
    getArticles({ commit }) {
      return new Promise(resolve => {
        axios
          .get(urls.articles)
          .then(({ data }) => {
            commit("addArticlesToState", data);
            resolve();
          });
      });
    },
    getResources({ commit }) {
      return new Promise(resolve => {
        axios
          .get(urls.resources)
          .then(({ data }) => {
            commit("addResourcesToState", data);
            resolve();
          });
      });
    },

    getServices({ commit }) {
      return new Promise(resolve => {
        axios
          .get(urls.services)
          .then(({ data }) => {
            commit("addServicesToState", data);
            resolve();
          });
      });
    },

    getUpcomingEvents({ commit }) {
      return new Promise(resolve => {
        axios
          .get(urls.events)
          .then((data) => {
            commit("addEventCount",data.headers['x-wp-total']);
            commit("addEventsToState", data.data);
            resolve();
          });
      });
    },

    getMoreContent({commit}, serviceQuery) {
  
      return new Promise(resolve => {
        axios
          .get(urls[serviceQuery.contentType] + serviceQuery.urlParams)
          .then(({data}) => {
            let payload = {'content': data, 'contentType': serviceQuery.contentType};
            commit("addMoreContent", payload);
            resolve();
          });
      });
    }
  },

  getters: {
    getAuthorById: state => authorId => state.authors.find(author => author.id === authorId),

    getCallsToActionByCategory: state => categoryName => {
      const actionsByService = state.callsToAction.filter(
        call =>
          call.acf.services
            ? call.acf.services.some(service => service.slug === categoryName)
            : []
      );

      return actionsByService;
    },
    getContentByService: state => (contentType, serviceName = null, locationName = null) => {
      let contents;
      let contentsFilteredByService = [];

      if (locationName && locationName !== 'all') {
        contents = state[contentType].filter(
          page => page.acf.location.some(location => location.slug === locationName)
        );
      } else {
        contents = state[contentType];
      }
      
      if (serviceName && serviceName !== 'any') {
        contents.forEach(function(content){
          if (content.acf.services != null && content.acf.services !== false){ 
          contentsFilteredByService.push(content);
          }
        });
        contentsFilteredByService = contentsFilteredByService.filter(
          page => page.acf.services.some(service => service.slug === serviceName)
        );
      }
      return serviceName ? contentsFilteredByService : contents;
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
          event => event.acf.location.some(location => location.slug === locationName)
        );
      }

      return locationName && locationName !== 'all' ? eventsFilteredByLocation : events;
    },

    getEventBySlug: state => slug => {
      return state.events.find(event => event.slug === slug);
    },

    getEventCount: state => () => {
      return Number(state.eventCount);
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
  },

  mutations: {
    addAuthorsToState(state, authors) {
      state.authors = authors;
    },

    addCallsToActionToState(state, callsToAction) {
      state.callsToAction = callsToAction;
    },

    addCollectionToState(state, collection) {
      state.collection = collection;
    },

    addFeaturedCollectionToState(state, featuredCollections) {
      state.featuredCollections = featuredCollections;
    },

    addLocationsToState(state, locations) {
      state.locations = locations;
    },

    addPagesToState(state, pages) {
      state.pages = pages;
    },

    addPostsToState(state, posts) {
      state.posts = posts;
    },

    addArticlesToState(state, articles) {

      state.articles = articles;
    },

    addEventsToState(state, events) {
      state.events = events;
    },
    addEventCount(state, eventCount) {
      state.eventCount = eventCount;
    },

    addEventCount(state, eventCount) {
      state.eventCount = eventCount;
    },

    addMoreEvents(state, moreEvents){
      for (let i=0; i < moreEvents.length; i++){
        const index = state.events.findIndex(event => event.id === moreEvents[i].id)
        if (index === -1){ 
          state.events.push(moreEvents[i]);
        }
      }
    },

    addResourcesToState(state, resources) {
      state.resources = resources;
    },

    addServicesToState(state, services) {
      state.services = services;
    },

    addMoreContent(state, payload) {
      for (let i=0; i < payload.content.length; i++){
        const index = state[payload.contentType].findIndex(item => item.id === payload.content[i].id)
        if (index === -1){ 
          state[payload.contentType].push(payload.content[i]);
        }
      }
    }
  }
});
