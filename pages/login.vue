<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">RTVE2030 Dashboard</h2>
      <p v-if="error" class="text-red-500 text-center mb-4">{{ error }}</p>
      <form @submit.prevent="handleSignin">
        <div class="mb-4">
          <label for="username" class="block text-gray-700"
            >Nombre de usuario</label
          >
          <input
            type="text"
            id="username"
            v-model="username"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-gray-700">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const authStore = useAuthStore();
const error = ref("");

const username = ref("");
const password = ref("");

const handleSignin = async () => {
  await authStore.login(username.value, password.value);
  if (authStore.error) {
    console.log(authStore.error);
    if (authStore.error.includes("401 Unauthorized")) {
      error.value = "Usuario o contraseña incorrectos.";
    } else {
      error.value = authStore.error;
    }
  } else {
    return navigateTo("/");
  }
};
</script>

<style lang="scss" scoped></style>
