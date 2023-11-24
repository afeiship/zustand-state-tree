import { create } from 'zustand';
import nx from '@jswork/next';
import pipe from '@jswork/pipe';
import { persist as persistMiddleware } from 'zustand/middleware';
import { immer as immerMiddleware } from 'zustand/middleware/immer';
import { wrap, computed } from './middlewares';
import { generateActions, generateGetters, isFunction } from './helper';

export default (storeConfig: StoreConfig) => {
  const { immer, state, getters, actions, watch, persist } = storeConfig;
  const immerWrap = immer ? immerMiddleware : nx.stubValue;
  const persistWrap = persist ? (fn) => persistMiddleware(fn, persist) : nx.stubValue;
  const computedWrap = getters ? (fn) => computed(fn, generateGetters(getters)) : nx.stubValue;
  const pipedWrap = pipe(
    wrap,
    immerWrap,
    persistWrap,
    computedWrap,
    create,
  );

  // getters
  const store = pipedWrap(
    (set, _, api) => {
      const _actions = generateActions(actions)(set);
      const _state = isFunction(state) ? state.call(api, storeConfig) : state;
      return {
        ..._state,
        ..._actions,
      };
    },
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
