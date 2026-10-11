import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Maps the item type used in components to the array name in the store.
const KEY = { mood: 'moods', place: 'places' };

// Global favorites state. `persist` saves it to localStorage automatically,
// so favorites survive a page refresh.
const useFavoritesStore = create(
  persist(
    (set, get) => ({
      moods: [], // saved mood bundles (mood ids)
      places: [], // saved places (place ids)

      // Adds the item if missing, removes it if present. Returns true when added.
      toggle: (type, id) => {
        const key = KEY[type];
        const list = get()[key];
        const added = !list.includes(id);
        set({ [key]: added ? [...list, id] : list.filter((x) => x !== id) });
        return added;
      },

      clearAll: () => set({ moods: [], places: [] }),
    }),
    {
      name: 'mazag-favorites', // localStorage key
      partialize: (state) => ({ moods: state.moods, places: state.places }),
    }
  )
);

export default useFavoritesStore;
