<script setup>
import { ref, onMounted } from 'vue'

const diaries = ref([])
const loading = ref(true)
const error = ref(null)
const zoomImage = ref(null)
const expandedItems = ref({})

// Fungsi ambil teks dari blok editor
function extractPlainText(blocks) {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .map(block => block.children?.map(child => child.text).join(' ') || '')
    .join('\n\n')
}

// Potong teks
function getShortText(text, limit = 200) {
  if (text.length <= limit) return text
  return text.slice(0, limit) + '...'
}

// Buat URL gambar lengkap
function getImageUrl(fotoObj) {
  if (!fotoObj || !fotoObj.url) return null
  return 'https://api008.tojounauna.go.id' + fotoObj.url
}

// Zoom gambar
function openZoom(imgUrl) {
  zoomImage.value = imgUrl
}
function closeZoom() {
  zoomImage.value = null
}

// Toggle expand/collapse
function toggleExpand(id) {
  expandedItems.value[id] = !expandedItems.value[id]
}

// Ambil data API
onMounted(async () => {
  try {
    const res = await fetch('https://api008.tojounauna.go.id/api/app100-catatans?populate=*')
    if (!res.ok) throw new Error('Gagal mengambil data')
    const json = await res.json()

    // mapping data agar seragam dengan template
    diaries.value = (json.data || []).map(item => {
      return {
        id: item.id,
        tema: item.tema,
        konten: item.konten,
        tanggal: item.time || item.createdAt,
        images: item.images
      }
    })
  } catch (err) {
    console.error(err)
    error.value = 'Gagal memuat data diary.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="p-4 bg-gray-100 min-h-screen">
    <h2 class="text-3xl font-bold mb-6 text-indigo-700 text-center">Diary</h2>

    <div v-if="loading" class="text-center text-gray-600">Memuat catatan...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <div v-else-if="diaries.length === 0" class="text-center text-gray-500">
      Tidak ada catatan tersedia.
    </div>

    <div v-else>
      <ul class="space-y-6">
        <li
          v-for="item in diaries"
          :key="item.id"
          class="border border-emerald-700 rounded-lg p-4 
                 bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 
                 shadow-lg max-w-4xl mx-auto text-gray-200"
        >
          <div class="flex flex-col sm:flex-row gap-4 items-start">
            <!-- Foto -->
            <div v-if="item.images" class="flex-shrink-0 w-full sm:w-40 cursor-pointer">
              <img
                :src="getImageUrl(item.images.formats?.small || item.images)"
                :alt="item.images.name"
                class="rounded shadow-md w-full h-auto object-cover max-h-48 transition-transform hover:scale-105"
                @click="openZoom(getImageUrl(item.images))"
              />
            </div>

            <!-- Konten -->
            <div class="flex-1">
              <h3 class="text-2xl font-semibold text-emerald-300 mb-2">
                {{ item.tema }}
              </h3>

              <transition name="fade-slide" mode="out-in">
                <p
                  key="expandedItems[item.id]"
                  class="text-gray-200 text-justify whitespace-pre-line"
                >
                  {{ expandedItems[item.id] 
                      ? extractPlainText(item.konten) 
                      : getShortText(extractPlainText(item.konten), 200) }}
                </p>
              </transition>

              <div v-if="extractPlainText(item.konten).length > 200" class="mt-3">
                <button
                  @click="toggleExpand(item.id)"
                  class="px-4 py-1 rounded-full text-sm font-medium transition duration-300 shadow-md"
                  :class="expandedItems[item.id] 
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-white' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'"
                >
                  {{ expandedItems[item.id] ? 'Sembunyikan' : 'Selengkapnya' }}
                </button>
              </div>

              <p class="text-xs text-emerald-200 mt-3">
                📅 {{ new Date(item.tanggal).toLocaleDateString('id-ID',{ dateStyle:'long'}) }}
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Modal Zoom Gambar -->
    <div
      v-if="zoomImage"
      class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      @click.self="closeZoom"
    >
      <img
        :src="zoomImage"
        alt="Zoomed Foto"
        class="max-w-full max-h-full rounded shadow-xl"
      />
      <button
        class="absolute top-4 right-4 text-white text-4xl font-bold"
        @click="closeZoom"
      >
        &times;
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Efek fade + slide */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
