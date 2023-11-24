import { create } from 'zustand';
import nx from '@jswork/next';
import { persist as persistMiddleware } from 'zustand/middleware';
import { immer as immerMiddleware } from 'zustand/middleware/immer';
import { wrap, computed } from './middlewares';
import { isFunction } from './helper';

export default (storeConfig: StoreConfig) => {
  const { immer, state, getters, actions, watch, persist } = storeConfig;
  const immerWrap = immer ? immerMiddleware : (fn) => fn;
  const persistWrap = persist ? (fn) => persistMiddleware(fn, persist) : (fn) => fn;

  // wrap actions -> add: () => set((state) => ({ count: state.count + 1 })),
  const createActions = (set) => {
    const _actions = {};
    nx.forIn(actions, (key, action) => {
      _actions[key] = () => set(action);
    });
    return _actions;
  };

  // getters
  const store = create(
    computed(
      persistWrap(
        wrap(
          immerWrap((set, _, api) => {
            const _actions = createActions(set);
            const _state = isFunction(state) ? state.call(api, storeConfig) : state;
            return {
              ..._state,
              ..._actions,
            };
          }),
        ),
      ),
      (state) => {
        const result = {};
        nx.forIn(getters, (key, getter) => {
          result[key] = getter(state);
        });
        return result;
      },
    ),
  );

  //watch
  store.subscribe((res, old) => {
    nx.forIn(watch, (key, watcher) => {
      const oldValue = nx.get(old, key);
      const newValue = nx.get(res, key);
      if (oldValue !== newValue) {
        watcher(newValue, oldValue);
      }
    });
  });

  return store;
};
