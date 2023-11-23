import { create } from 'zustand';
import nx from '@jswork/next';
import { persist as persistMiddleware } from 'zustand/middleware';
import { wrap, computed } from './middlewares';

// extend NxStatic
declare global {
  interface NxStatic {
    $defineStore: (cfg: StoreConfig) => any;
  }
}

interface StoreConfig {
  state: Record<string, any> | ((stateConfog: StoreConfig) => Record<string, any>);
  getters?: Record<string, (state: any) => any>;
  actions?: Record<string, (state: any) => any>;
  watch?: Record<string, (newValue: any, oldValue: any) => void>;
  persist?: any;
}

nx.$defineStore = (storeConfig: StoreConfig) => {
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
    computed(
      persistMiddleware(
        wrap((set, _, api) => {
          const _actions = createActions(set);
          const _state = typeof state === 'function' ? state.call(api, storeConfig) : state;
          return {
            ..._state,
            ..._actions,
          };
        }),
        persist
      ),
      (state) => {
        const result = {};
        nx.forIn(getters, (key, getter) => {
          result[key] = getter(state);
        });
        return result;
      }
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
