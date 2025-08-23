<template>
  <div class="bg-green-600 text-white text-center py-6 text-3xl font-bold">
    {{ headerData?.title || 'header' }}
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const headerData = ref(null)

onMounted(async () => {
  const res = await fetch('https://api008.tojounauna.go.id/api/app100-header')
  const json = await res.json()
  headerData.value = json.data?.attributes
})
</script>
