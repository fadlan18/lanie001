<template>
  <div id="pswp-gallery"></div>

  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <div class="bg-green-600 text-white text-3xl font-bold py-6 px-4 flex justify-between items-center shadow transition duration-300">
      <div>
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

      <!-- Burger Menu (hanya di layar kecil) -->
      <button class="md:hidden text-white text-2xl" @click="isMenuOpen = !isMenuOpen">
        ☰
      </button>
    </div>

    <div class="flex flex-1">
      <!-- Sidebar -->
      <!-- Sidebar -->
<div
  class="bg-gray-800 text-white w-40 p-4 space-y-4 fixed md:static top-0 left-0 h-full md:h-auto transition-transform duration-300 z-50"
  :class="{
    '-translate-x-full': screenIsSmall && !isMenuOpen,
    'translate-x-0': !screenIsSmall || isMenuOpen
  }"
>
  <button
    v-for="menu in Object.keys(views)"
    :key="menu"
    @click="currentViewName = menu; isMenuOpen = false"
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

    <!-- Overlay -->
    <div
  v-if="screenIsSmall && isMenuOpen"
  class="fixed inset-0 bg-black bg-opacity-50 z-40"
  @click="isMenuOpen = false"
></div>

      <!-- Main Content -->
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
import { ref, onMounted, computed } from 'vue'
import Profil from '@/components/Profil.vue'
import Galeri from '@/components/Galeri.vue'
import Diary from '@/components/Diary.vue'

const views = { Profil, Galeri, Diary }
const currentViewName = ref('Profil')

// Menu toggle
const isMenuOpen = ref(false)
const screenIsSmall = computed(() => window.innerWidth < 768)

// Header state
const headerText = ref('Memuat...')
const loadingHeader = ref(true)
const headerError = ref(null)

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

<style scoped>
@media (max-width: 768px) {
  .-translate-x-full {
    transform: translateX(-100%);
  }
}
</style>
