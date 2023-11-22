import React from 'react';

export interface ZustandStateTreeProps {
  stores: any;
  children: React.ReactNode;
}

// extend NxStatic
declare global {
  interface NxStatic {
    $get: any;
    $set: any;
    $use: any;
    $call: any;
  }
}

export default function ZustandStateTree({ stores, children }: ZustandStateTreeProps) {
  const getStore = (inKey) => {
    const [key, ...subkeys] = inKey.split('.');

    const getx = (k, subk) => {
      const store = nx.get(stores, k);
      if (typeof store.getState === 'function') {
        return [store, subk];
      }
      const keys = subk.split('.');
      return getx(k + '.' + keys.shift(), keys.join('.'));
    };
    return getx(key, subkeys.join('.'));
  };

  const getAllState = () => {
    const getx = (mod) => {
      const keys = Object.keys(mod);
      const result = {};
      keys.forEach((key) => {
        const store = nx.get(mod, key);
        if (typeof store.getState === 'function') {
          result[key] = store.getState();
        } else {
          result[key] = getx(store);
        }
      });
      return result;
    };
    return getx(stores);
  };

  // get state value from store
  nx.$get = (inKey, inDefault?) => {
    if (!inKey) return getAllState();
    const [useStore, leftKey] = getStore(inKey);
    const state = useStore.getState();
    return nx.get(state, leftKey, inDefault);
  };

  nx.$set = (inKey, inValue) => {
    const [useStore, leftKey] = getStore(inKey);
    const state = useStore.getState();
    state.__update__();
    useStore.setState(nx.set(state, leftKey, inValue));
    // trigger chagne:
  };

  nx.$use = (inKey, inDefault?) => {
    const [useStore, leftKey] = getStore(inKey);
    const selector = (state) => nx.get(state, leftKey, inDefault);
    return useStore(selector);
  };

  nx.$call = (inKey, ...inArgs) => {
    const [useStore, leftKey] = getStore(inKey);
    const state = useStore.getState();
    const action = nx.get(state, leftKey);
    return action(...inArgs);
  };

  return children;
}