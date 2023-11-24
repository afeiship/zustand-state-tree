export default nx.$defineStore({
  state() {
    return { collapsed: false };
  },
  getters: {
    width: (state) => (state.collapsed ? 80 : 200),
  },
  actions: {
    toggle: (state) => {
      state.collapsed = !state.collapsed;
    },
  },
  watch: {
    collapsed: (cur, old) => {
      console.log('cur collapsed:', cur, old);
    },
  },
  persist: {
    name: 'abc-test',
    partialize(state) {
      return {
        collapsed: state.collapsed,
      };
    },
  },
});
