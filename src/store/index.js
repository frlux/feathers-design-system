import Vue from "vue";
import Vuex from "vuex";

import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    callsToAction: [],
    collection: [],
    events: [],
    featuredCollections: [],
    locations: [],
    menu: [],
    pages: [],
    posts: [],
    resources: [],
    services: [],
  },

  actions: {
    getCallsToAction({ commit }) {
      return new Promise(resolve => {
        axios
          .get("http://fontana.local/wp-json/wp/v2/calls-to-action")
          .then(({ data }) => {
            commit("addCallsToActionToState", data);
            resolve();
          });
      });
    },

    getCollection({ commit }) {
      return new Promise((resolve) => {
        axios
          .get('http://fontana.local/wp-json/wp/v2/collection')
          .then(({ data }) => {
            commit('addCollectionToState', data);
            resolve();
          });
      });
    },

    getFeaturedCollections({ commit }) {
      return new Promise(resolve => {
        axios.get('http://fontana.local/wp-json/wp/v2/featured-collection')
          .then(({ data }) => {
            commit('addFeaturedCollectionToState', data);
            resolve();
          });
      });
    },

    getLocations({ commit }) {
      return new Promise(resolve => {
        axios
          .get("http://fontana.local/wp-json/wp/v2/locations")
          .then(({ data }) => {
            commit("addLocationsToState", data);
            resolve();
          });
      });
    },

    getPages({ commit }) {
      return new Promise(resolve => {
        axios
          .get("http://fontana.local/wp-json/wp/v2/pages")
          .then(({ data }) => {
            commit("addPagesToState", data);
            resolve();
          });
      });
    },

    getPosts({ commit }) {
      return new Promise(resolve => {
        axios
          .get(
            "https://public-api.wordpress.com/rest/v1.1/sites/fontanalib.wordpress.com/posts/?number=10"
          )
          .then(({ data }) => {
            commit("addPostsToState", data.posts);
            resolve();
          });
      });
    },

    getResources({ commit }) {
      return new Promise(resolve => {
        axios
          .get("http://fontana.local/wp-json/wp/v2/resources")
          .then(({ data }) => {
            commit("addResourcesToState", data);
            resolve();
          });
      });
    },

    getServices({ commit }) {
      return new Promise(resolve => {
        axios
          .get("http://fontana.local/wp-json/wp/v2/services")
          .then(({ data }) => {
            commit("addServicesToState", data);
            resolve();
          });
      });
    },

    getUpcomingEvents({ commit }) {
      return new Promise(resolve => {
        axios
          .get("http://fontana.local/wp-json/tribe/events/v1/events")
          .then(({ data }) => {
            commit("addEventsToState", data.events);
            resolve();
          });
      });
    }
  },

  getters: {
    getCallsToActionByCategory: state => categoryName => {
      const actionsByService = state.callsToAction.filter(
        call =>
          call.acf.services
            ? call.acf.services.some(service => service.slug === categoryName)
            : []
      );

      return actionsByService;
    },

    getContentByService: state => (
      contentType,
      serviceName = 'any',
      locationName = null,
    ) => {
      let contentFilteredByLocation;
      let contentByService;

      if (serviceName === 'any') {
        contentByService = state[`${contentType}`];
      } else {
        contentByService = state[`${contentType}`].filter(
          call =>
            call.acf.services
              ? call.acf.services.some(service => service.slug === serviceName)
              : []
        );
      }

      if (locationName && locationName !== 'all') {
        contentFilteredByLocation = contentByService.filter(
          content =>
            content.acf.location
              ? content.acf.location.some(
                  location => location.slug === locationName
                )
              : []
        );
      }
      return locationName && locationName !== 'all' ? contentFilteredByLocation : contentByService;
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
          event => event.venue.slug === locationName
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
    getRandomContentItem: state => contentType => {
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

    getServiceBySlug: state => slug => {
      return state.services.find(service => service.slug === slug);
    },
  },

  mutations: {
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

    addEventsToState(state, events) {
      state.events = events;
    },

    addResourcesToState(state, resources) {
      state.resources = resources;
    },

    addServicesToState(state, services) {
      state.services = services;
    }
  }
});
