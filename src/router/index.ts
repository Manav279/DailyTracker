import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import TodayView from '../views/TodayView.vue'
import JournalView from '../views/JournalView.vue'
import AnalyticsView from '../views/AnalyticsView.vue'
import SettingsView from '../views/SettingsView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: MainLayout,
            children: [
                {
                    path: '',
                    name: 'today',
                    component: TodayView
                },
                {
                    path: 'journal',
                    name: 'journal',
                    component: JournalView
                },
                {
                    path: 'analytics',
                    name: 'analytics',
                    component: AnalyticsView
                },
                {
                    path: 'settings',
                    name: 'settings',
                    component: SettingsView
                }
            ]
        }
    ]
})

export default router
