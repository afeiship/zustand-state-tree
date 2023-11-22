import { create } from 'zustand';

export default create((set) => ({
  fishes: 0,
  addFish: () => set((state) => ({ fishes: state.fishes + 1 })),
  eatFish: () => set((state) => ({ fishes: state.fishes - 1 })),
}));
