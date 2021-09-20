
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/', component: () => import('pages/Index.vue') },
      { path: '/login', component: () => import('pages/Login.vue') },
      {
        path: '/contacts',
        component: () => import('pages/Contacts.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/callslist',
        component: () => import('pages/CallList.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/bookings',
        component: () => import('pages/Bookings.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/emails',
        component: () => import('pages/Emails.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: '/admin',
        component: () => import('pages/Admin.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
