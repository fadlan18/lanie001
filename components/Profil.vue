<script setup>
import { ref, onMounted } from 'vue'

const profil = ref(null)
const loading = ref(true)
const error = ref(null)

function getImageUrl(fotoObj) {
  if (!fotoObj || !fotoObj.url) return null
  const selected = fotoObj.formats?.medium || fotoObj
  return 'https://api008.tojounauna.go.id' + selected.url
}

onMounted(async () => {
  try {
    const res = await fetch('https://api008.tojounauna.go.id/api/profil?populate=*')
    if (!res.ok) throw new Error('Gagal mengambil data profil')
    const json = await res.json()
    profil.value = json.data?.attributes

    profil.value = json.data

  } catch (err) {
    console.error(err)
    error.value = 'Gagal memuat data profil.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4 text-indigo-700">Profil</h2>

    <div v-if="loading">Memuat profil...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="!profil">Data tidak ditemukan.</div>

    <div
      v-else
      class="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto space-y-4"
    >
      <!-- Container dengan 2 kotak -->
      <div class="flex flex-col sm:flex-row gap-6">
        <!-- Kotak Foto -->
        <div
          class="border rounded-lg p-2 bg-gray-50 flex justify-center items-center max-w-xs mx-auto sm:mx-0"
        >
          <img
            :src="getImageUrl(profil.Foto)"
            :alt="profil.Foto?.name || 'Foto Profil'"
            class="w-full h-auto max-h-[300px] object-contain rounded"
          />
        </div>

        <!-- Kotak Teks -->
        <div class="border rounded-lg p-4 flex-1 bg-gray-50">
          <h3 class="text-xl font-semibold mb-2 text-gray-800">
            {{ profil.Nama }}
          </h3>

          <p class="text-gray-700 mb-2">
            <span class="font-medium">Email:</span> {{ profil.Email }}
          </p>

          <p class="text-gray-600 whitespace-pre-line text-justify">
            {{ profil.Kredo }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

