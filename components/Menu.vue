<template>
  <div class="bg-gray-800 text-white p-4 space-y-2 w-32">
    <button @click="$emit('menuClick', 'Profil')" class="block w-full text-left">Profil</button>
    <button @click="$emit('menuClick', 'Galeri')" class="block w-full text-left">Galeri</button>
    <button @click="$emit('menuClick', 'Diary')" class="block w-full text-left">Diary</button>

  </div>
</template>
