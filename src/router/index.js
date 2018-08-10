import Vue from "vue";
import Router from "vue-router";
import Channel from "../templates/Channel.vue";
import Event from "../templates/Event.vue";
import Events from "../templates/Events.vue";
import Index from "../templates/Index.vue";
import NotFound from "../templates/NotFound.vue";
import SearchResults from "../templates/SearchResults.vue";
import Services from "../templates/Services.vue";

Vue.use(Router);

const router = new Router({
  mode: "history",

  routes: [
    {
      component: Index,
      meta: {
        title: "Home"
      },
      name: "Index",
      path: "/",
      props: route => ({
        location: route.query.location
      })
    },

    {
      component: Events,
      meta: {
        title: "Events"
      },
      name: "Events",
      path: "/events",
      props: route => ({
        filter: route.query.filter,
        location: route.query.location
      })
    },

    {
      component: Event,
      path: "/events/:slug",
      props: true
    },

    {
      component: SearchResults,
      name: "Search",
      path: "/search",
      props: route => ({
        filter: route.query.filter,
        location: route.query.location
      })
    },
    {
      component: Services,
      name: "Services",
      path: "/services",
      props: route => ({
        filter: route.query.filter,
        location: route.query.location
      })
    },
    {
      component: Channel,
      name: "Services",
      path: "/services/:slug",
      props: true
    },
    {
      component: Channel,
      path: "/service/:slug"
    },

    {
      path: "*",
      name: "NotFound",
      component: NotFound
    }
  ],

  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  }
});

router.beforeEach((to, from, next) => {
  if(!hasLocationQueryParameter(to) && hasLocationQueryParameter(from)){
    next({name: to.name, query: from.query});
  } else {
    next();
  }
});

function hasLocationQueryParameter(route) {
  return !!route.query.location;
}

export default router;
