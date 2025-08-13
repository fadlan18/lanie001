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
    const res = await fetch('https://api008.tojounauna.go.id/api/profils?populate=Foto')
    if (!res.ok) throw new Error('Gagal mengambil data profil')

    const json = await res.json()
    if (json.data && json.data.length > 0) {
      profil.value = json.data[0] // ambil item pertama
    }
  } catch (err) {
    console.error(err)
    error.value = 'Gagal memuat data profil.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-6">
    <h2 class="text-3xl font-bold mb-6 text-green-800 text-center">myProfile</h2>

    <div v-if="loading" class="text-center text-gray-600">Memuat profil...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <div v-else-if="!profil" class="text-center text-gray-500">Data tidak ditemukan.</div>

    <div
      v-else
      class="bg-white rounded-2xl shadow-lg p-6 max-w-5xl mx-auto space-y-6 hover:shadow-xl transition-shadow duration-300"
    >
      <div class="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
        <!-- Foto -->
        <div class="bg-white rounded-xl shadow-md p-3 flex justify-center items-center w-full sm:w-64">
          <img
            v-if="getImageUrl(profil.Foto)"
            :src="getImageUrl(profil.Foto)"
            :alt="profil.Foto?.name || 'Foto Profil'"
            class="w-full h-auto max-h-[320px] object-contain rounded-lg"
          />
          <div
            v-else
            class="w-full h-[320px] flex items-center justify-center bg-gray-200 text-gray-500 rounded-lg"
          >
            No Image
          </div>
        </div>

        <!-- Info -->
        <div class="flex-1 space-y-3">
          <h3 class="text-2xl font-bold text-green-800">
            {{ profil.Nama }}
          </h3>

          <p class="text-gray-700">
            <span class="font-medium text-green-700">Email:</span> {{ profil.Email }}
          </p>

          <p class="text-gray-700">
            <span class="font-medium text-green-700">Kelas:</span> {{ profil.Kelas }}
          </p>

          <p class="text-gray-700">
            <span class="font-medium text-green-700">Tahun Masuk:</span> {{ profil.Tahun_Masuk }}
          </p>

          <p class="text-gray-700">
            <span class="font-medium text-green-700">Hobi:</span> {{ profil.Hobi }}
          </p>

          <p class="text-gray-600 whitespace-pre-line text-justify leading-relaxed">
            {{ profil.Kredo }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
