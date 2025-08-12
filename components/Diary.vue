<script setup>
import { ref, onMounted } from 'vue'

// State utama
const diaries = ref([])
const loading = ref(true)
const error = ref(null)
const zoomImage = ref(null)

// Fungsi ambil teks dari blok editor
function extractPlainText(blocks) {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .map(block => block.children?.map(child => child.text).join(' ') || '')
    .join('\n\n')
}

// Buat URL gambar lengkap
function getImageUrl(fotoObj) {
  if (!fotoObj || !fotoObj.url) return null
  return 'https://api008.tojounauna.go.id' + fotoObj.url
}

// Fungsi zoom gambar
function openZoom(imgUrl) {
  zoomImage.value = imgUrl
}

function closeZoom() {
  zoomImage.value = null
}

// Ambil data dari API
onMounted(async () => {
  try {
    const res = await fetch('https://api008.tojounauna.go.id/api/diaries?populate=*')
    if (!res.ok) throw new Error('Gagal mengambil data')
    const json = await res.json()
    diaries.value = json.data
  } catch (err) {
    console.error(err)
    error.value = 'Gagal memuat data diary.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4 text-indigo-700">Diary</h2>

    <div v-if="loading">Memuat catatan...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="diaries.length === 0">Tidak ada catatan tersedia.</div>

    <div v-else>
      <ul class="space-y-6">
        <li
          v-for="item in diaries"
          :key="item.id"
          class="border rounded-lg p-4 bg-white shadow-md max-w-4xl mx-auto"
        >
          <div class="flex flex-col sm:flex-row gap-4 items-start">
            <!-- Gambar (jika ada) -->
            <div v-if="item.Foto" class="flex-shrink-0 w-full sm:w-40 cursor-pointer">
              <img
                :src="getImageUrl(item.Foto.formats?.medium || item.Foto)"
                :alt="item.Foto.name"
                class="rounded shadow-sm w-full h-auto object-cover max-h-48 transition-transform hover:scale-105"
                @click="openZoom(getImageUrl(item.Foto))"
              />
            </div>

            <!-- Teks -->
            <div class="flex-1">
              <h3 class="text-xl font-semibold text-indigo-700 mb-1">
                {{ item.Tema }}
              </h3>

              <p class="text-gray-800 text-justify whitespace-pre-line">
                {{ extractPlainText(item.Catatan) }}
              </p>

              <p class="text-sm text-gray-500 mt-2">
                Tanggal: {{ item.Tanngal || 'Tidak diketahui' }}
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Modal Zoom Gambar -->
    <div
      v-if="zoomImage"
      class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
      @click.self="closeZoom"
    >
      <img
        :src="zoomImage"
        alt="Zoomed Foto"
        class="max-w-full max-h-full rounded shadow-lg"
      />
      <button
        class="absolute top-4 right-4 text-white text-3xl font-bold"
        @click="closeZoom"
      >
        &times;
      </button>
    </div>
  </div>
</template>
