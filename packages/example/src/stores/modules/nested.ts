export default nx.$defineStore({
  state: {
    token: null,
    data: {
      child: {
        count: 0,
      },
    },
  },
  actions: {
    update: (state) => {
      console.log('update!');
      state.data.child.count++;
    },
  }
});
