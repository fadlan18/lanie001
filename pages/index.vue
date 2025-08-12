<template>

  <div id="pswp-gallery"></div>
  
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <div class="bg-green-600 text-white text-3xl font-bold py-6 text-center shadow transition duration-300">
      <template v-if="loadingHeader">
        Memuat Header...
      </template>
      <template v-else-if="headerError">
        {{ headerError }}
      </template>
      <template v-else>
        {{ headerText }}
      </template>
    </div>

    <!-- Main content -->
    <div class="flex flex-1">
      <!-- Sidebar Menu -->
      <div class="bg-gray-800 text-white w-40 p-4 space-y-4">
        <button
          v-for="menu in Object.keys(views)"
          :key="menu"
          @click="currentViewName = menu"
          :class="[
            'w-full text-left px-4 py-2 rounded transition duration-200 font-semibold',
            currentViewName === menu
              ? 'bg-white text-gray-800 shadow'
              : 'hover:bg-gray-600'
          ]"
        >
          {{ menu }}
        </button>
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 bg-gray-100 p-6">
        <component :is="views[currentViewName]" />
      </div>
    </div>

    <!-- Footer -->
    <div class="bg-gray-800 text-white py-3 text-center">
      Footer
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Profil from '@/components/Profil.vue'
import Galeri from '@/components/Galeri.vue'
import Diary from '@/components/Diary.vue'

// Daftar tampilan (views)
const views = {
  Profil,
  Galeri,
  Diary
}

// State aktif menu
const currentViewName = ref('Profil')

// Header state
const headerText = ref('Memuat...')
const loadingHeader = ref(true)
const headerError = ref(null)

// Ambil data header dari API Strapi
onMounted(async () => {
  try {
    const res = await fetch('https://api008.tojounauna.go.id/api/header')
    const json = await res.json()
    headerText.value = json?.data?.Headertext || 'Header Tidak Ditemukan'
  } catch (e) {
    console.error(e)
    headerError.value = 'Gagal memuat header'
    headerText.value = 'Terjadi Kesalahan'
  } finally {
    loadingHeader.value = false
  }
})
</script>
