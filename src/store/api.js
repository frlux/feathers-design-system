import axios from "axios";
export const content = {
  audience: {
    url: 'https://fontana.librarians.design/wp-json/wp/v2/audience',
    content: 'taxonomy',
    field: 'audience',
    acf_field: 'target_readership',
    searchable: true,
  },
  authors: {
    url: 'https://fontana.librarians.design/wp-json/wp/v2/users',
    content: 'user',
    searchable: false,
  },
  callsToAction: {
    url: 'https://fontana.librarians.design/wp-json/wp/v2/calls-to-action',
    content: 'post',
    searchable: false,
  },
  collection: {
    url: 'https://fontana.librarians.design/wp-json/wp/v2/collection',
    content: 'post',
    searchable: true,
  },
  featuredCollections: {
    url: 'https://fontana.librarians.design/wp-json/wp/v2/featured-collections',
    content: 'taxonomy',
    field: 'featured-collections',
    searchable: true,
  },
  genres: {
    url: 'https://fontana.librarians.design/wp-json/wp/v2/genres',
    content: 'taxonomy',
    field: 'genres',
    acf_field: 'genre',
    searchable: true,
  },
  menuItems: {
    url: 'https://fontana.librarians.design/wp-json/fontana/v1/menus',
    content: 'menu',
    searchable: false,
  },
  locations: {
    url: 'https://fontana.librarians.design/wp-json/wp/v2/locations',
    content: 'taxonomy',
    field: 'locations',
    acf_field: 'location',
    searchable: true,
  },
  pages: {
    url: 'https://fontana.librarians.design/wp-json/wp/v2/pages',
    content: 'page',
    searchable: true,
  },
  posts: {
    url: 'https://public-api.wordpress.com/rest/v1.1/sites/fontanalib.wordpress.com/posts',
    content: 'blog',
    searchable: true,
  },
  articles: {
    url: 'https://fontana.librarians.design/wp-json/wp/v2/posts',
    content: 'post',
    searchable: true,
  },
  resources: {
    url: 'https://fontana.librarians.design/wp-json/wp/v2/resources',
    content: 'post',
    searchable: true,
  },
  services: {
    url: 'https://fontana.librarians.design/wp-json/wp/v2/services',
    content: 'taxonomy',
    field: 'services',
    acf_field: 'services',
    searchable: true,
  },
  events: {
    url: 'https://fontana.librarians.design/wp-json/wp/v2/events?',
    content: 'event',
    searchable: true,
  },
  subjects:{
    url: 'https://fontana.librarians.design/wp-json/wp/v2/subjects',
    content: 'taxonomy',
    field: 'subjects',
    acf_field: 'subjects',
    searchable: false,
  },
  links:{
    organizersBySlug: 'https://fontana.librarians.design/wp-json/tribe/events/v1/organizers/by-slug/',
    searchable: false,
    }
  };

export const fetchData = (type, param = []) => {
  try {
    console.log(type)
    return axios.get(content[type].url,{
      params: param
    })
  } catch (error) {
    console.error(error)
  }
}

export const fetchLink = (link) => {
  try {
    return axios.get(link)
  } catch (error) {
    console.error(error)
  }
}

export const fetchPerson = (type, slug) => {
  
  try {
    let person = content.links[type] + slug;
    return axios.get(person)
  } catch (error) {
    console.error(error)
  }
}
