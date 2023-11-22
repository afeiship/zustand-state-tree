export const getValueFromState = (state) => {
  const keys = Object.keys(state);
  const result = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = state[key];
    if (key === '__') continue;
    if (typeof value === 'function') continue;
    result[key] = value;
  }
  return result;
};
