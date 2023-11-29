import { createRouter, createWebHashHistory } from 'vue-router';
import ConnectWallet from '@views/ConnectWallet.vue';
import Dashboard from '@views/Dashboard.vue';

const routes = [
  { path: '/', component: ConnectWallet },
  { path: '/dashboard', component: Dashboard },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
