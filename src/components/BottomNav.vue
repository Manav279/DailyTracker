<script setup lang="ts">

// Simple Router Link Logic is handled by RouterLink component
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center pb-safe">
    <!-- Floating Glass Dock -->
    <div class="pointer-events-auto bg-background-elevated/80 backdrop-blur-xl border border-white/[0.08] shadow-2xl rounded-2xl mb-4 mx-4 px-6 h-16 flex items-center gap-8 ring-1 ring-white/[0.05]">
      
      <!-- Today Tab -->
      <router-link to="/" class="group flex flex-col items-center justify-center text-foreground-muted transition-colors hover:text-foreground active:scale-95" active-class="" exact-active-class="!text-accent">
        <div class="relative w-6 h-6 mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full transition-all group-hover:-translate-y-0.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <div class="absolute inset-0 bg-accent/20 blur-md opacity-0 group-[.router-link-exact-active]:opacity-100 transition-opacity duration-300"></div>
        </div>
        <span class="text-[10px] font-medium tracking-wide">Today</span>
      </router-link>
      
      <!-- Journal Tab -->
      <router-link to="/journal" class="group flex flex-col items-center justify-center text-foreground-muted transition-colors hover:text-foreground active:scale-95" active-class="!text-accent">
        <div class="relative w-6 h-6 mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full transition-all group-hover:-translate-y-0.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          <div class="absolute inset-0 bg-accent/20 blur-md opacity-0 group-[.router-link-active]:opacity-100 transition-opacity duration-300"></div>
        </div>
        <span class="text-[10px] font-medium tracking-wide">Journal</span>
      </router-link>

      <!-- Analytics Tab -->
      <router-link to="/analytics" class="group flex flex-col items-center justify-center text-foreground-muted transition-colors hover:text-foreground active:scale-95" active-class="!text-accent">
        <div class="relative w-6 h-6 mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full transition-all group-hover:-translate-y-0.5"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
          <div class="absolute inset-0 bg-accent/20 blur-md opacity-0 group-[.router-link-active]:opacity-100 transition-opacity duration-300"></div>
        </div>
        <span class="text-[10px] font-medium tracking-wide">Analytics</span>
      </router-link>

      <!-- Settings Tab -->
      <router-link to="/settings" class="group flex flex-col items-center justify-center text-foreground-muted transition-colors hover:text-foreground active:scale-95" active-class="!text-accent">
        <div class="relative w-6 h-6 mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full transition-all group-hover:rotate-45"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          <div class="absolute inset-0 bg-accent/20 blur-md opacity-0 group-[.router-link-active]:opacity-100 transition-opacity duration-300"></div>
        </div>
        <span class="text-[10px] font-medium tracking-wide">Settings</span>
      </router-link>
    </div>
  </nav>
</template>
