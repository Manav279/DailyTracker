<script setup lang="ts">
import { ref } from 'vue';
import { dataService } from '../services/dataService';
import AppCard from '../components/ui/AppCard.vue';
import AppButton from '../components/ui/AppButton.vue';

const fileInput = ref<HTMLInputElement | null>(null);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');
const isPersisted = ref(false);

const handleBackup = async () => {
  const result = await dataService.exportData();
  if (result) showMessage('Backup started successfully!', 'success');
  else showMessage('Backup failed.', 'error');
};

const triggerImport = () => {
  fileInput.value?.click();
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    if (!file) return;
    const result = await dataService.importData(file);
    
    if (result.success) {
      showMessage(result.message, 'success');
      // Optional: Refresh page to reflect data? 
      // Dexie live queries should update automatically, but often a full reload is cleaner for "Restore"
      setTimeout(() => window.location.reload(), 1500);
    } else {
      showMessage(result.message, 'error');
    }
    
    // Reset input
    target.value = '';
  }
};

const handleReset = async () => {
  if (confirm('ARE YOU SURE? This will delete ALL your tasks and journal entries permanently.')) {
    await dataService.clearAllData();
    showMessage('All data deleted.', 'success');
    setTimeout(() => window.location.reload(), 1500);
  }
};

const checkPersistence = async () => {
    // Check if already persisted
    if (navigator.storage && navigator.storage.persisted) {
        isPersisted.value = await navigator.storage.persisted();
    }
}

const enablePersistence = async () => {
    isPersisted.value = await dataService.requestPersistentStorage();
};

const showMessage = (msg: string, type: 'success' | 'error') => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => message.value = '', 3000);
};

checkPersistence();
</script>

<template>
  <div class="px-6 pt-12 pb-24">
    <header class="mb-8 animate-slide-up-fade">
      <h1 class="text-4xl font-semibold tracking-tight leading-[1.1] bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent">
        Settings
      </h1>
      <p class="text-foreground-muted mt-2">Manage your data and privacy.</p>
    </header>

    <div class="space-y-6 animate-slide-up-fade [animation-delay:100ms] opacity-0 fill-mode-forwards">
      
      <!-- Storage Status -->
      <AppCard>
          <div class="flex items-center justify-between">
              <div>
                  <h3 class="font-semibold text-base mb-1">Storage Mode</h3>
                  <p class="text-xs text-foreground-muted">
                      {{ isPersisted ? 'Persistent Storage is active.' : 'Browser may clear data to save space.' }}
                  </p>
              </div>
              <div v-if="isPersisted" class="text-emerald-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <AppButton v-else variant="ghost" class="text-xs" @click="enablePersistence">Enable</AppButton>
          </div>
      </AppCard>

      <!-- Data Management -->
      <AppCard>
        <h3 class="font-semibold text-lg mb-4">Data Safety</h3>
        
        <div class="space-y-4">
            <AppButton variant="secondary" class="w-full justify-between group" @click="handleBackup">
                <span>Backup Data (Export JSON)</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-foreground-muted group-hover:text-white transition-colors"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            </AppButton>

            <AppButton variant="ghost" class="w-full justify-between group border border-white/10 hover:border-white/20" @click="triggerImport">
                <span>Restore Data (Import JSON)</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-foreground-muted group-hover:text-white transition-colors"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </AppButton>
            <input type="file" ref="fileInput" accept=".json" class="hidden" @change="handleFileChange" />
        </div>
      </AppCard>

      <!-- Danger Zone -->
      <div class="pt-8">
          <AppButton variant="ghost" class="w-full text-red-400 hover:text-red-300 hover:bg-red-400/10 justify-center" @click="handleReset">
              Reset All Data
          </AppButton>
          <p class="text-[10px] text-center text-foreground-muted mt-2">Cannot be undone.</p>
      </div>

       <!-- Message Toast (Simple implementation) -->
      <div v-if="message" class="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-medium shadow-xl border backdrop-blur-md animate-fade-in z-50 whitespace-nowrap"
           :class="messageType === 'success' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-100' : 'bg-red-500/20 border-red-500/30 text-red-100'">
          {{ message }}
      </div>

    </div>
  </div>
</template>

<style scoped>
.animate-slide-up-fade {
  animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.fill-mode-forwards {
  animation-fill-mode: forwards;
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
    from { opacity: 0; transform: translate(-50%, 10px); }
    to { opacity: 1; transform: translate(-50%, 0); }
}
.animate-fade-in {
    animation: fadeIn 0.3s ease-out forwards;
}
</style>
