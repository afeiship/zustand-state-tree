import nx from '@jswork/next';

export const isFunction = (inValue) => typeof inValue === 'function';
export const isObject = (inValue) => typeof inValue === 'object' && inValue !== null;
export const isZustandStore = (inStore) => isFunction(inStore.getState);

export const getValueFromState = (inState) => {
  if (!isObject(inState)) return inState;

  const keys = Object.keys(inState);
  const result = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = inState[key];
    if (key === '__') continue;
    if (isFunction(value)) continue;
    result[key] = value;
  }
  return result;
};

export const getStore = (inKey) => {
  const stores = nx.__stores__;
  const [key, ...subkeys] = inKey.split('.');
  const getx = (k, subk) => {
    const store = nx.get(stores, k);
    if (isZustandStore(store)) return [store, subk];
    const keys = subk.split('.');
    return getx(k + '.' + keys.shift(), keys.join('.'));
  };
  return getx(key, subkeys.join('.'));
};

export const getAllState = () => {
  const stores = nx.__stores__;
  const getx = (mod) => {
    const keys = Object.keys(mod);
    const result = {};
    keys.forEach((key) => {
      const store = nx.get(mod, key);
      const value = isZustandStore(store) ? store.getState() : getx(store);
      result[key] = getValueFromState(value);
    });
    return result;
  };
  return getx(stores);
};

export const generateGetters = (inGetters) => {
  return (state) => {
    const result = {};
    nx.forIn(inGetters, (key, getter) => {
      result[key] = getter(state);
    });
    return result;
  };
};

export const generateActions = (inActions) => {
  return (set) => {
    const _actions = {};
    nx.forIn(inActions, (key, action) => {
      _actions[key] = () => set(action);
    });
    return _actions;
  };
};
