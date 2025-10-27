import { createRouter, createWebHistory } from '@ionic/vue-router';
import HomePage from '../views/HomePage.vue';
import TabsPage from '../views/TabsPage.vue';
import Tab1Page from '../views/Tab1Page.vue';
import Tab2Page from '../views/Tab2Page.vue';
import Tab3Page from '../views/Tab3Page.vue';
import Tab4Page from '../views/Tab4Page.vue';
import Tab5Page from '../views/Tab5Page.vue';

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: Tab1Page
      },
      {
        path: 'tab2',
        component: Tab2Page
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
