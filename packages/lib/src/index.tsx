import { PropsWithChildren } from 'react';
import { getAllState, getStore, getValueFromState } from './helper';
import './defineStore';

type Stores = Record<string, any>;

export type ZustandStateTreeProps = PropsWithChildren<{
  stores: Stores;
}>;

// extend NxStatic
declare global {
  interface NxStatic {
    __stores__?: Stores;
    $get(key?: string, defaults?: any): any;
    $set(key: string, value: any): void;
    $use(key: string, defaults?: any): any;
    $call(key: string, ...args: any[]): any;
  }
}

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
