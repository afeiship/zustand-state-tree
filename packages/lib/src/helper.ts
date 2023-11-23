export const isFunction = (value) => typeof value === 'function';
export const isObject = (value) => typeof value === 'object' && value !== null;

export const isZstore = (store) => isFunction(store.getState);

export const getValueFromState = (state) => {
  if (!isObject(state)) return state;

  const keys = Object.keys(state);
  const result = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = state[key];
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
    if (isZstore(store)) return [store, subk];
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
      const value = isZstore(store) ? store.getState() : getx(store);
      result[key] = getValueFromState(value);
    });
    return result;
  };
  return getx(stores);
};
