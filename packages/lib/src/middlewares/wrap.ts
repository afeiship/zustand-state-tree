export default (create) => (set, get, api) => {
  const state = create(set, get, api);
  return {
    ...state,
    __: 0,
    __update__: () => set((state) => ({ __: state.__ + 1 })),
  };
};
