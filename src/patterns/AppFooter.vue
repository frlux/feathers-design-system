<template>

    <footer class="align-items-start d-md-flex justify-content-center justify-content-md-between p-3">

        <div class="col-md-6 col-xl-4 pl-0 pr-0 pt-md-3 mb-3">

            <card class="card--background-blue-dark mb-3"
                  :heading="library.name"
                  subheading="Fontana Regional Library"
                  subheading-class="h4 mt-0 text--white"
                  v-if="library">

                <template slot="copy">
                    {{library.acf.phone}} <br><br>
                    {{library.acf.librarian}} <br>
                    {{library.acf.address}} <br>
                    {{library.acf.city}}, {{library.acf.state}} {{library.acf.zip}} <br><br>
                    Fax: {{library.acf.fax}}
                    </template>

            </card>

        </div>
                <!-- Footer menu: only one dropdown level anticipated -->
        <nav class="d-flex flex-wrap menu menu--footer p-3" role="navigation">

            <div class="p-0" v-for="item in menuList.items.items" :key="item.ID">

                <!-- Top-level menu items with children generate dropdown with no click available -->
                <div class="p-2" v-if="menuParent(menuList.items.items, item)">
                    <Dropdown button-class="menu__item menu__item--location nav-link text--ellipsis text--nowrap text--white"
                            class="align-self-center nav-item"
                            dropdown-menu-class="text--nowrap text--right"
                            label-class="menu__item__label">
                        <template slot="label">{{ item.title }}</template>                        
                        <template slot="items"
                                v-for="subMenu in menuLoad(menuList.items.items, item.ID)">
                            <a v-if="subMenu.target === '_blank'" :href="subMenu.url" target="_blank" :key="item.object_id">
                                {{ subMenu.title }}
                            </a>
                            <router-link v-else
                                    class="d-block dropdown__menu__item link link--undecorated mb-1 mt-1 text--underlined"
                                    :key="subMenu.ID"
                                    :to="`${getUrl(subMenu)}`">                            
                                {{ subMenu.title }}
                            </router-link>
                        </template>
                    </Dropdown>
                </div>

                <!-- Top level menu items with no children have no dropdown but are clickable -->
                <div class="p-2" v-else-if="item.menu_item_parent == '0'">  
                    <a v-if="item.target === '_blank'" :href="item.url" target="_blank">
                        {{ item.title }}
                    </a>                            
                    <router-link v-else class="d-block link link--undecorated mb-3 p-2 menu__item"
                            :to="`${getUrl(item)}`">
                        <span class="menu__item__label text--white">
                            {{ item.title }}
                        </span>
                    </router-link>
                </div>

            </div>

        </nav>

        <div class="d-flex">
            <span>
	            <a href="https://fontanalib.wordpress.com/" target="_blank"><img alt="Subscribe to our blog" src="http://www.fontanalib.org/sites/default/files/default_images/wp.png" style="width: 32px; height: 32px;margin-bottom: 3px;" /></a>
	            <a href="https://www.facebook.com/fontanalib" target="_blank"><img alt="Like us on Facebook" src="http://www.fontanalib.org/sites/default/files/default_images/fb.png" style="width: 32px; height: 32px;margin-bottom: 3px;" /></a>
	            <a href="https://www.youtube.com/user/FontanaRegLibrary" target="_blank"><img alt="Subscribe to our YouTube Channel" src="http://www.fontanalib.org/sites/default/files/default_images/yt.png" style="width: 32px; height: 32px; margin-bottom: 3px;" /></a>
	            <a href="https://twitter.com/fontanalib" target="_blank"><img alt="Follow us on Twitter" src="http://www.fontanalib.org/sites/default/files/default_images/tw.png" style="width: 32px; height: 32px; margin-bottom: 3px;" /></a>
	            <a href="https://www.instagram.com/fontanalib/" target="_blank"><img alt="Follow us on instagram" src="http://www.fontanalib.org/sites/default/files/default_images/inst.png" style="width: 32px; height: 32px; margin-bottom: 3px;" /></a>
	            <a href="http://fontanalib.tumblr.com/" target="_blank"><img alt="Follow us on Tumblr" src="http://www.fontanalib.org/sites/default/files/default_images/tu.png" style="width: 32px; height: 32px; margin-bottom: 3px;" /></a>
            </span>
        </div>

    </footer>

</template>

<script>
import Card from './Card.vue';
import Search from './Search.vue';

export default {
  name: 'AppFooter',

  components: {
    Card,
    Search,
  },
  computed:{
    menuList() {
      const menus = this.$store.state.menu;
      return menus.find(menu=>menu.name==='top');
    },
    library(){
      return this.pageObject ? this.pageObject 
                  : this.$store.state.userLocation ? this.$store.getters.getLocationBySlug(this.$store.state.userLocation)
                  : this.$store.getters.getLocationBySlug('headquarters');
    }
  },
  methods: {
    /**
     * Links to pages on Wordpress menus are complete URLs but just need slug stripped off to be consistent
     */
    getUrl(item) {
        var url = item.url;
        var end = url.length;
        var start = 0;
        if (item.object == 'page') {
            if (end > 0) {
                if (url.lastIndexOf('/') == end-1) {
                    end -= 1;
                    url = url.substring(0,end);
                }
                start = url.lastIndexOf('/');
                if (start != -1) {
                    url = '/page' + url.substring(start,end);
                }
            }
        }
        return url;
    },
    menuParent(list,item) {
        var i;
        for (i = list.length; i > 0 && list[i-1].menu_item_parent != item.ID; i--);
        return i > 0;
    },
    menuLoad(list,id) {
        var i = 0;
        var menuSub = [];
        for (i = 0; i < list.length; i++) {
            if (list[i].menu_item_parent == id) {
                menuSub.push(list[i]);
            }
        }
        return menuSub;
    },
  },

  props: {
    /**
     * An array of menu items that include `title` and `url` properties.
     */
    menuItems: {
      type: Array,
    },

    /**
     * A `location` object from which to derive hours and contact information.
     */
    pageObject: {
      type: Object,
    },
  },
};
</script>
