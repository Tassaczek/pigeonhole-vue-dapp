import { createRouter, createWebHashHistory } from 'vue-router';
import ConnectWallet from '@views/ConnectWallet.vue';
import Dashboard from '@views/Dashboard.vue';
import Event from '@views/Event.vue';
import FindEvent from '@components/FindEvent.vue';
import SingleEvent from '@components/SingleEvent.vue';

const routes = [
  { path: '/', component: ConnectWallet },
  { path: '/dashboard', component: Dashboard },
  {
    path: '/event',
    component: Event,
    children: [
      {
        path: '',
        component: FindEvent,
      },
      {
        path: ':id',
        component: SingleEvent,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
