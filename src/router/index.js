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
import store from "@/store";
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
      name: 'blog',
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
        contentContainer: router.app.$store.state.posts,
        location: route.query.location,
        filter: route.query.search
      }),
    },

    {
      component: Collection,
      meta: {
        title: 'Collections',
      },
      name: 'collection',
      path: '/collection',
      
      props: route => ({
        channelTitle: route.params.channel ? route.params.channel : 'Collection',
        library: route.params.userLocation ? route.params.userLocation : '',
        slug: 'any',
        collection: router.app.$store.state.collection,
      }),
    },
    {
      component: Collection,
      meta: {
        title: 'Collections',
      },
      name: 'collection-type',
      path: '/collection/:type',
      props: route => ({
        channelTitle: route.params.channel ? route.params.channel : 'Collection',
        library: route.params.userLocation ? route.params.userLocation : '',
        slug: 'any',
        network: route.params.type,
        collection: router.app.$store.state.collection,
      }),
    },
    {
      component: Collection,
      name: 'collection-type-slug',
      path: '/collection/:type/:slug',
      props: route => ({
        channelTitle: route.params.channel ? route.params.channel : 'Collection',
        library: route.params.userLocation ? route.params.userLocation : '',
        slug: route.params.slug,
        network: route.params.type,
        collection: router.app.$store.state.collection,
      }),
    },

    {
      component: Index,
      meta: {
        title: "Home"
      },
      name: "index",
      path: "/",
      props: route => ({
        location: route.params.userLocation ? route.params.userLocation : router.app.$store.state.userLocation ? router.app.$store.state.userLocation : ''
      })
    },

    {
      component: Events,
      meta: {
        title: "Events",
      },
      name: "events",
      path: "/events",
      props: route => ({
        filter: route.params.filter ? route.params.filter : route.query.search ? router.query.search : '',
        location: route.params.userLocation ? route.params.userLocation : router.app.$store.state.userLocation ? router.app.$store.state.userLocation : '',
        eventsContainer: router.app.$store.state.events,
      })
    },

    {
      component: Event,
      name: 'events-slug',
      path: "/events/:slug",
      meta:{
        parent: {name:"events", text:"Events"}, type: {store: 'events', wp: 'event'},
      },
      props: route => ({
        pageObject: !route.params.pageObject ? router.app.$store.getters.getEventBySlug(route.params.slug) : route.params.pageObject,
      }),
    },
    {
      component: Locations,
      meta: {
        title: "Locations"
      },
      name: "locations",
      path: "/locations",
      props: route => ({
        filter: route.params.filter ? route.params.filter : route.query.search ? router.query.search : '',
      })
    },

    {
      component: Location,
      meta:{
        parent: {name:"locations", text:"Locations"}, type: {store: 'locations'},
      },
      name: 'locations-slug',
      path: "/locations/:slug",
      props: route => ({
        pageObject: !route.params.pageObject ? router.app.$store.getters.getLocationBySlug(route.params.slug) : route.params.pageObject,
      }),
    },
    {
      component: Channel,
      name: 'pages',
      path: "/pages",
      beforeEnter(to, from, next){
        if(!router.app.$store.state.pages || router.app.$store.state.pages.length < 10){
          router.app.$store.dispatch("getPages").then(next())
        } else{
          next();
        }
      },
      props: route => ({
        network: 'pages',
        channelTitle: 'Library Information',
        channelDescription: `
          Find Information about general library services, how-to's and more.
        `,
        contentContainer: router.app.$store.state.pages,
        location: route.query.location,
        filter: route.query.search
      }),
    },
    {
      component: Channel,
      name: 'articles',
      path: "/articles",
      beforeEnter(to, from, next){
        if(!router.app.$store.state.articles || router.app.$store.state.pages.articles < 10){
          router.app.$store.dispatch("getArticles").then(next())
        } else{
          next();
        }
      },
      props: route => ({
        network: 'articles',
        channelTitle: 'Library News and Updates',
        channelDescription: `
          Find updates and news about Library activities, services, and more.
        `,
        contentContainer: router.app.$store.state.articles,
        location: route.query.location,
        filter: route.query.search
      }),
    },
    {
      component: Channel,
      name: 'resources',
      path: "/resources",
      beforeEnter(to, from, next){
        if(!router.app.$store.state.resources || router.app.$store.state.pages.resources < 10){
          router.app.$store.dispatch("getResources").then(next())
        } else{
          next();
        }
      },
      props: route => ({
        network: 'resources',
        channelTitle: 'Library Databases and Online Resources',
        channelDescription: `
        `,
        contentContainer: router.app.$store.state.resources,
        location: route.query.location,
        filter: route.query.search
      }),
    },

    {
      component: SearchResults,
      name: "search",
      path: "/search",
      props: route => ({
        filter: route.query.search,
        location: route.query.location 
      })
    },

    {
      component: Services,
      name: "services",
      path: "/services",
      props: route => ({
        filter: route.query.search,
        location: route.query.location
      })
    },
    {
      component: Service,
      name:"services-slug",
      path: "/services/:slug",
      meta: {parent: {name: "services", text: "Services"}},
      props: route => ({
        pageObject: !route.params.pageObject ? router.app.$store.getters.getServiceBySlug(route.params.slug) : route.params.pageObject,
        location: route.params.userLocation ? route.params.userLocation : router.app.$store.state.userLocation ? router.app.$store.state.userLocation : '',
        slug: route.params.slug
      }),
    },
    {
      component: Page,
      name: 'pages-slug',
      path: "/pages/:slug",
      meta: {parent: {name:"pages", text:"Information"}, type: {store: 'pages', wp: 'page'}, breadcrumb:true},
      props: route => ({
        pageObject: router.app.$store.getters.getContentBySlug(route.params.slug, 'pages'),
        moreContent: !route.params.moreContent ? router.app.$store.getters.getContentBySlug(route.params.slug, null, 'all') : route.params.moreContent,
        slug: route.params.slug
      }),
    },
    {
      component: Page,
      name: 'articles-slug',
      path: "/articles/:slug",
      meta: {parent: {name: "articles", text: 'Articles'}, type: {store: 'articles', wp: 'post'}, breadcrumb:true},
      props: route => ({
        pageObject: router.app.$store.getters.getContentBySlug(route.params.slug, 'articles'),
        moreContent: route.params.moreContent ? router.app.$store.getters.getContentBySlug(route.params.slug, null, 'all') : route.params.moreContent,
        slug: route.params.slug
      }),
    },
    {
      component: Page,
      name: 'blog-slug',
      path: "/blog/:slug",
      meta: {parent: {name:"blog", text:"Shelf Life in the Mountains"}, type: {store: 'posts', wp: 'post'}, breadcrumb:true},
      props: route => ({
        pageObject: !route.params.pageObject ? getContentBySlug(route.params.slug, 'posts') : route.params.pageObject,
        moreContent: !route.params.moreContent ? router.app.$store.getters.getContentBySlug(route.params.slug, null, 'all') : route.params.moreContent,
        slug: route.params.slug
      }),
    },
    {
      component: Page,
      name: 'resources-slug',
      path: "/resources/:slug",
      meta: {parent: {name:"resources", text:"Library Databases and Online Resources"}, type: {store: 'resources', wp: 'resource'}, breadcrumb:true},
      props: route => ({
        pageObject: !route.params.pageObject ? getContentBySlug(route.params.slug, 'resources') : route.params.pageObject,
        moreContent: !route.params.moreContent ? router.app.$store.getters.getContentBySlug(route.params.slug, null, 'all') : route.params.moreContent,
        slug: route.params.slug
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
/* async function getpageObject(eventSlug){
  await api.fetchData('events', {slug: eventSlug}).then(results=>{
    return results.data;
  });
}  */

export default router;
