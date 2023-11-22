import { create } from 'zustand';
import nx from '@jswork/next';
import { computed, persist as persistMiddleware } from './middlewares';

// extend NxStatic
declare global {
  interface NxStatic {
    $defineStore: any;
  }
}

nx.$defineStore = (storeConfig) => {
  const { state, getters, actions, watch, persist } = storeConfig;

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
    persistMiddleware(
      computed(
        (set) => {
          const _actions = createActions(set);
          return {
            ...state,
            ..._actions,
            __: 0,
            __update__: () => set((state) => ({ __: state.__ + 1 })),
          };
        },
        (state) => {
          const result = {};
          nx.forIn(getters, (key, getter) => {
            result[key] = getter(state);
          });
          return result;
        }
      ),
      persist
    )
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
