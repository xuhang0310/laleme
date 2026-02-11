<script>
import { usePetStore } from '@/stores/pet'

export default {
  onLaunch: function () {
    console.log('App Launch')
    
    // --- Data Migration (Legacy to Pinia) ---
    try {
      // 1. Migrate User Data
      const userStatePinia = uni.getStorageSync('user_state_pinia')
      if (!userStatePinia) {
        const legacyUser = uni.getStorageSync('user_state')
        if (legacyUser) {
          const newUserState = {
            food: legacyUser.food || 0,
            pendingFood: legacyUser.pendingFood || 0,
            dailyRecordCount: legacyUser.dailyRecordCount || 0,
            lastRecordDate: legacyUser.lastRecordDate || new Date().toLocaleDateString()
          }
          uni.setStorageSync('user_state_pinia', newUserState)
          console.log('Migrated user state to Pinia')
        }
      }

      // 2. Migrate Pet Data
      const petStatePinia = uni.getStorageSync('pet_state_pinia')
      if (!petStatePinia) {
        const legacyUser = uni.getStorageSync('user_state')
        if (legacyUser && legacyUser.pet) {
          const newPetState = {
            hunger: legacyUser.pet.hunger || 60,
            exp: legacyUser.pet.exp || 0,
            level: legacyUser.pet.level || 1,
            status: 'normal',
            lastHungerUpdateTime: Date.now()
          }
          uni.setStorageSync('pet_state_pinia', newPetState)
          console.log('Migrated pet state to Pinia')
        }
      }
    } catch (e) {
      console.error('Migration failed:', e)
    }
  },
  onShow: function () {
    console.log('App Show')
    try {
      const petStore = usePetStore()
      petStore.checkHunger()
    } catch (e) {
      console.log('Pinia not ready or error checking hunger', e)
    }
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
/*每个页面公共css */
::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
}
</style>
