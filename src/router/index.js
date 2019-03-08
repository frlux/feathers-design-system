import Vue from "vue";
import Router from "vue-router";
import Channel from "../templates/Channel.vue";
import Collection from '../templates/Collection.vue';
import Event from "../templates/Event.vue";
import Events from "../templates/Events.vue";
import Index from "../templates/Index.vue";
import Location from "../templates/Location.vue";
import Locations from "../templates/Locations.vue";
import Page from "../templates/Page.vue";
import NotFound from "../templates/NotFound.vue";
import SearchResults from "../templates/SearchResults.vue";
import Service from '../templates/Service.vue';
import Services from "../templates/Services.vue";
import * as api from "../store/api.js";

Vue.use(Router);

const router = new Router({
  mode: "history",

  routes: [
    {
      component: Channel,
      meta: {
        title: 'Blog',
      },
      name: 'Blog',
      path: '/blog',
      props: route => ({
        channelTitle: 'Shelf Life in the Mountains',
        channelDescription: `
          This is the blog for the Fontana Regional Library system, 
          serving Jackson, Macon, and Swain counties in western North Carolina.
          Our blog contributors come from all over our three county region and cover a 
          vast array of topics including historical and current events, technology, 
          cats and much more, as well as related books suggestions!
        `,
        network: 'blog',
        slug: 'any',
      }),
    },

    {
      component: Collection,
      meta: {
        title: 'Collections',
      },
      name: 'Collection',
      path: '/collection',
      props: route => ({
        channelTitle: route.params.channel ? route.params.channel : 'Collection',
        library: route.params.userLocation ? route.params.userLocation : '',
        slug: 'any',
      }),
    },
    {
      component: Collection,
      meta: {
        title: 'Collections',
      },
      name: 'Collection-type',
      path: '/collection/:type',
      props: route => ({
        channelTitle: route.params.channel ? route.params.channel : 'Collection',
        library: route.params.userLocation ? route.params.userLocation : '',
        slug: 'any',
        network: route.params.type,
      }),
    },
    {
      component: Collection,
      name: 'Collection-type-slug',
      path: '/collection/:type/:slug',
      props: route => ({
        channelTitle: route.params.channel ? route.params.channel : 'Collection',
        library: route.params.userLocation ? route.params.userLocation : '',
        slug: route.params.slug,
        network: route.params.type,
      }),
    },

    {
      component: Index,
      meta: {
        title: "Home"
      },
      name: "Index",
      path: "/",
      props: route => ({
        location: route.params.userLocation ? route.params.userLocation : router.app.$store.state.userLocation ? router.app.$store.state.userLocation : ''
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
        filter: route.params.filter ? route.params.filter : route.query.filter ? router.query.filter : '',
        location: route.params.userLocation ? route.params.userLocation : router.app.$store.state.userLocation ? router.app.$store.state.userLocation : '' 
      })
    },

    {
      component: Event,
      name: 'Events-slug',
      path: "/events/:slug",
      props: route => ({
        eventObject: !route.params.eventObject ? router.app.$store.getters.getEventBySlug(route.params.slug) : route.params.eventObject,
      }),
    },
    {
      component: Locations,
      meta: {
        title: "Locations"
      },
      name: "Locations",
      path: "/locations",
      props: route => ({
        filter: route.params.filter ? route.params.filter : route.query.filter ? router.query.filter : '',
      })
    },

    {
      component: Location,
      name: 'Locations-slug',
      path: "/locations/:slug",
      props: route => ({
        locationObject: !route.params.locationObject ? router.app.$store.getters.getLocationBySlug(route.params.slug) : route.params.locationObject,
      }),
    },
    {
      component: Channel,
      name: 'blog',
      path: "/blog",
      props: route => ({
        network: 'blog',
      }),
    },
    {
      component: Channel,
      name: 'pages',
      path: "/pages",
      props: route => ({
        network: 'pages',
      }),
    },
    {
      component: Channel,
      name: 'articles',
      path: "/articles",
      props: route => ({
        network: 'articles',
      }),
    },

    {
      component: SearchResults,
      name: "Search",
      path: "/search",
      props: route => ({
        filter: route.params.filter ? route.params.filter : route.query.filter ? router.query.filter : '',
        location: route.params.userLocation ? route.params.userLocation : router.app.$store.state.userLocation ? router.app.$store.state.userLocation : '' 
      })
    },

    {
      component: Services,
      name: "Services",
      path: "/services",
      props: route => ({
        filter: route.params.filter ? route.params.filter : route.query.filter ? router.query.filter : '',
        location: route.params.userLocation ? route.params.userLocation : router.app.$store.state.userLocation ? router.app.$store.state.userLocation : ''
      })
    },
    {
      component: Service,
      name:"Services-slug",
      path: "/services/:slug",
      meta: {parent: "Services"},
      props: route => ({
        serviceObject: !route.params.serviceObject ? router.app.$store.getters.getServiceBySlug(route.params.slug) : route.params.serviceObject,
        location: route.params.userLocation ? route.params.userLocation : router.app.$store.state.userLocation ? router.app.$store.state.userLocation : ''
      }),
    },
    {
      component: Service,
      name: "resources",
      path: "/resources",
      props: route => ({
        filter: route.params.filter ? route.params.filter : route.query.filter ? router.query.filter : '',
        location: route.params.userLocation ? route.params.userLocation : router.app.$store.state.userLocation ? router.app.$store.state.userLocation : ''
      })
    },
    {
      component: Service,
      name:"resources-slug",
      path: "/resources/:slug",
      meta: {parent: "Resources"},
      props: route => ({
        serviceObject: !route.params.serviceObject ? router.app.$store.getters.getServiceBySlug(route.params.slug) : route.params.serviceObject,
        location: route.params.userLocation ? route.params.userLocation : router.app.$store.state.userLocation ? router.app.$store.state.userLocation : ''
      }),
    },
    {
      component: Page,
      name: 'pages-slug',
      path: "/pages/:slug",
      meta: {parent: "pages", type: {store: 'pages', wp: 'page'}},
      props: route => ({
        pageObject: !route.params.pageObject ? router.app.$store.getters.getContentBySlug(route.params.slug, 'pages') : route.params.pageObject,
        moreContent: !route.params.moreContent ? router.app.$store.getters.getContentBySlug(route.params.slug, null, 'all') : route.params.moreContent,
      }),
    },
    {
      component: Page,
      name: 'articles-slug',
      path: "/articles/:slug",
      meta: {parent: "articles", type: {store: 'articles', wp: 'post'}},
      props: route => ({
        pageObject: route.params.pageObject ? router.app.$store.getters.getContentBySlug(route.params.slug, 'articles') : route.params.pageObject,
        moreContent: route.params.moreContent ? router.app.$store.getters.getContentBySlug(route.params.slug, null, 'all') : route.params.moreContent
      }),
    },
    {
      component: Page,
      name: 'blog-slug',
      path: "/blog/:slug",
      meta: {parent: "blog", type: {store: 'posts', wp: 'post'}},
      props: route => ({
        pageObject: !route.params.pageObject ? getContentBySlug(route.params.slug, 'posts') : route.params.pageObject,
        moreContent: !route.params.moreContent ? router.app.$store.getters.getContentBySlug(route.params.slug, null, 'all') : route.params.moreContent,
      }),
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
function getContentBySlug(slug, type){
  let item = router.app.$store.getters.getContentBySlug(slug, type);
  
  if(!item){
    api.fetchData(type, {slug: slug}).then(results=>
      item = results[0]
    )
  }
  return item;

}
/* router.beforeEach((to, from, next) => {
  if(!hasLocationQueryParameter(to) && hasLocationQueryParameter(from)){
    next({name: to.name, query: from.query});
  } else {
    next();
  }
});

function hasLocationQueryParameter(route) {
  return !!route.query.location;
}
async function getEventObject(eventSlug){
  await api.fetchData('events', {slug: eventSlug}).then(results=>{
    return results.data;
  });
} */

export default router;
