export default nx.$defineStore({
  state: {
    collapsed: false
  },
  getters: {
    width: (state) => (state.collapsed ? 80 : 200)
  },
  actions: {
    toggle: (state) => {
      // state.collapsed = !state.collapsed;
      return {
        collapsed: !state.collapsed
      };
    }
  },
  watch: {
    collapsed: (cur, old) => {
      console.log('cur collapsed:', cur);
    }
  },
  persist: {
    name: 'abc-test',
    partialize(state) {
      return {
        collapsed: state.collapsed
      };
    }
  }
});
