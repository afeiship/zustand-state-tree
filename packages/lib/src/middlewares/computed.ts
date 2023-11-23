//@thanks to: https://github.com/cmlarsen/zustand-middleware-computed-state
//how develop middleware: https://github.com/pmndrs/zustand#middleware

export default (create, compute) => (set, get, api) => {
  const setWithComputed = (update, replace) => {
    set((state) => {
      const updated = typeof update === 'function' ? update(state) : update;
      const computedState = compute({ ...state, ...updated });
      return { ...updated, ...computedState };
    }, replace);
  };
  api.setState = setWithComputed;
  const state = create(setWithComputed, get, api);
  return { ...state, ...compute(state) };
};
