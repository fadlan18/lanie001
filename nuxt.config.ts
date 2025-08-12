// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  nitro: {
    preset: 'vercel'
  },

  modules: ['@nuxtjs/tailwindcss'],
  css: ['@/assets/css/tailwind.css'],

  devtools: { enabled: true },
  routeRules: {
    // prerender index route by default
    '/': { prerender: true },
  },

  nitro: {
    compatibility: {
      date: '2025-07-27'
    }
  }
});
