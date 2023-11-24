import { PropsWithChildren } from 'react';
import { getAllState, getStore, getValueFromState } from './helper';
import defineStore from './defineStore';
import nx from '@jswork/next';

export type ZustandStateTreeProps = PropsWithChildren<{
  stores: Stores;
}>;

nx.$defineStore = defineStore;

export default function ZustandStateTree({ stores, children }: ZustandStateTreeProps) {
  nx.__stores__ = stores;

  // get state value from store
  nx.$get = (inKey, inDefault?) => {
    if (!inKey) return getAllState();
    const [useStore, leftKey] = getStore(inKey);
    const state = useStore.getState();
    const result = nx.get(state, leftKey, inDefault);
    return getValueFromState(result);
  };

  nx.$set = (inKey, inValue) => {
    const [useStore, leftKey] = getStore(inKey);
    const state = useStore.getState();
    const newState = nx.set(state, leftKey, inValue);
    state.__update__();
    useStore.setState(newState);
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
