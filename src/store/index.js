import Vue from "vue"
import Vuex from "vuex"

import axios from "axios"
import union from "lodash/union"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    callsToAction: [],
    collection: [],
    events: [],
    locations: [],
    pages: [],
    posts: [],
    resources: [],
    services: [],
  },

  actions: {
    getCallsToAction({ commit }) {
      return new Promise(resolve => {
        axios.get("http://fontana.local/wp-json/wp/v2/calls-to-action").then(({ data }) => {
          commit("addCallsToActionToState", data)

          resolve()
        })
      })
    },

    getCollection({ commit }) {
      return new Promise(resolve => {
        axios.get("http://fontana.local/wp-json/wp/v2/collection").then(({ data }) => {
          commit("addCollectionToState", data)
          resolve()
        })
      })
    },

    getLocations({ commit }) {
      return new Promise(resolve => {
        axios.get("http://fontana.local/wp-json/wp/v2/locations").then(({ data }) => {
          commit("addLocationsToState", data)
          resolve()
        })
      })
    },

    getPages({ commit }) {
      return new Promise(resolve => {
        axios.get("http://fontana.local/wp-json/wp/v2/pages").then(({ data }) => {
          commit("addPagesToState", data)
          resolve()
        })
      })
    },

    getResources({ commit }) {
      return new Promise(resolve => {
        axios.get("http://fontana.local/wp-json/wp/v2/resources").then(({ data }) => {
          commit("addResourcesToState", data)
          resolve()
        })
      })
    },

    getServices({ commit }) {
      return new Promise(resolve => {
        axios.get("http://fontana.local/wp-json/wp/v2/services").then(({ data }) => {
          commit("addServicesToState", data)
          resolve()
        })
      })
    },

    getUpcomingEvents({ commit }) {
      return new Promise(resolve => {
        axios.get("http://fontana.local/wp-json/tribe/events/v1/events").then(({ data }) => {
          commit("addEventsToState", data.events)
          resolve()
        })
      })
    },
  },

  getters: {
    getCallsToActionByCategory: state => categoryName => {
      const actionsByService = state.callsToAction.filter(
        call => (call.acf.services ? call.acf.services.some(service => service.slug === categoryName) : [])
      )

      return actionsByService
    },

    getContentByService: state => (contentType, serviceName = "any", locationName = null) => {
      let contentFilteredByLocation
      let contentByService

      if (serviceName === "any") {
        contentByService = state[`${contentType}`]
      } else {
        contentByService = state[`${contentType}`].filter(
          call => (call.acf.services ? call.acf.services.some(service => service.slug === serviceName) : [])
        )
      }

      if (locationName) {
        contentFilteredByLocation = contentByService.filter(
          content => (content.acf.location ? content.acf.location.some(location => location.slug === locationName) : [])
        )
      }
      return locationName ? contentFilteredByLocation : contentByService
    },

    getEvents: state => (dateString = null, locationName = null) => {
      let events
      let eventsFilteredByLocation

      if (dateString) {
        events = state.events.filter(
          event =>
            `${event.start_date_details.year}-${event.start_date_details.month}-${event.start_date_details.day}` ===
            dateString
        )
      } else {
        events = state.events
      }

      if (locationName) {
        eventsFilteredByLocation = events.filter(event => event.venue.slug === locationName)
      }

      return locationName ? eventsFilteredByLocation : events
    },

    getEventBySlug: state => slug => {
      return state.events.find(event => event.slug === slug)
    },

    getServiceBySlug: state => slug => {
      return state.services.find(service => service.slug === slug)
    },
  },

  mutations: {
    addCallsToActionToState(state, callsToAction) {
      state.callsToAction = callsToAction
    },

    addCollectionToState(state, collection) {
      state.collection = collection
    },

    addLocationsToState(state, locations) {
      state.locations = locations
    },

    addPagesToState(state, pages) {
      state.pages = pages
    },

    addEventsToState(state, events) {
      state.events = events
    },

    addResourcesToState(state, resources) {
      state.resources = resources
    },

    addServicesToState(state, services) {
      state.services = services
    },
  },
})
