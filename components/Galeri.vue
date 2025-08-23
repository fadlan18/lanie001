<script setup>
import { ref, onMounted } from 'vue'
import PhotoSwipe from 'photoswipe'
import 'photoswipe/style.css'

const galeris = ref([])
const loading = ref(true)
const error = ref(null)
const expandedThemes = ref({}) // simpan state tema yang di-expand

const API_URL = 'https://api008.tojounauna.go.id'

onMounted(async () => {
  try {
    const res = await fetch(`${API_URL}/api/app100-galeris?populate=*`)
    const json = await res.json()

    galeris.value = (json.data || []).map(item => {
      // di API Anda, strukturnya langsung ada field tema, time, images
      const attr = item.attributes || item
      const imagesData = attr.images || []

      const images = (imagesData || []).map(img => ({
        url: img.url, // masih relative
        name: img.name || 'Gambar',
        width: img.width || 1200,
        height: img.height || 800
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'id', { numeric: true }))

      return {
        id: item.id,
        tema: attr.tema || 'Tanpa Tema',
        date: attr.time || attr.createdAt || '',
        images
      }
    })
  } catch (err) {
    console.error('Galeri fetch error:', err)
    error.value = 'Gagal memuat galeri.'
  } finally {
    loading.value = false
  }
})

function toggleExpand(id) {
  expandedThemes.value[id] = !expandedThemes.value[id]
}

function openSingleImage(image) {
  const pswp = new PhotoSwipe({
    dataSource: [
      {
        src: `${API_URL}${image.url}`,
        width: image.width,
        height: image.height,
        alt: image.name
      }
    ],
    showHideAnimationType: 'fade',
    zoom: false,
    arrowKeys: false,
    closeOnVerticalDrag: true
  })
  pswp.init()
}
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Galeri</h1>

    <div v-if="loading" class="text-center text-gray-500 py-10">Memuat data galeri...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>
    <div v-if="galeris.length === 0 && !loading" class="text-gray-600">Belum ada data galeri.</div>

    <div class="space-y-10">
      <div
        v-for="galeri in galeris"
        :key="galeri.id"
        class="bg-white rounded-xl shadow-md p-4 border"
      >
        <h2 class="font-semibold text-lg mb-1">Tema: {{ galeri.tema }}</h2>
        <p class="text-sm text-gray-500 mb-3">
          Tanggal: {{ new Date(galeri.date).toLocaleDateString('id-ID', { dateStyle: 'long' }) }}
        </p>

        <div v-if="galeri.images.length > 0">
          <!-- Grid galeri -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <div
              v-for="(image, index) in (expandedThemes[galeri.id] ? galeri.images : galeri.images.slice(0, 4))"
              :key="index"
              class="block overflow-hidden rounded-lg bg-gray-100 hover:opacity-80 transition cursor-pointer"
              @click="openSingleImage(image)"
            >
              <div class="aspect-[4/3]">
                <img
                  :src="`${API_URL}${image.url}`"
                  :alt="image.name"
                  loading="lazy"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <!-- Tombol Lihat Semua / Sembunyikan -->
          <div v-if="galeri.images.length > 4" class="mt-3 flex justify-center">
            <button
              @click="toggleExpand(galeri.id)"
              class="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-md
                    hover:bg-gray-100 hover:border-gray-400 transition"
            >
              {{ expandedThemes[galeri.id] ? 'Sembunyikan' : `Lihat Semua (${galeri.images.length})` }}
            </button>
          </div>
        </div>

        <div v-else class="text-gray-500 italic">Belum ada gambar untuk galeri ini.</div>
      </div>
    </div>
  </div>
</template>
