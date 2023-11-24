interface StoreConfig {
  immer?: boolean;
  state: Record<string, any> | ((stateConfog: StoreConfig) => Record<string, any>);
  getters?: Record<string, (state: any) => any>;
  actions?: Record<string, (state: any) => any>;
  watch?: Record<string, (newValue: any, oldValue: any) => void>;
  persist?: import('zustand/middleware/persist').PersistOptions<any>;
}

type Stores = Record<string, any>;

interface NxStatic {
  __stores__?: Stores;
  $defineStore: (cfg: StoreConfig) => any;
  $get(key?: string, defaults?: any): any;
  $set(key: string, value: any): void;
  $use(key: string, defaults?: any): any;
  $call(key: string, ...args: any[]): any;
}
