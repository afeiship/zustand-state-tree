import EnvManager from '@jswork/env-manager';

declare var wx: any;

const viteEnv = new EnvManager({
  prefix: 'VITE_APP_',
  // @ts-ignore
  env: import.meta.env,
});

class ViteEnvs {
  public static get(key: string): any {
    return viteEnv.get(key);
  }

  public static set(inCmdRc: any): void {
    viteEnv.set(inCmdRc);
  }
}

// for commonjs es5 require
if (typeof module !== 'undefined' && module.exports && typeof wx === 'undefined') {
  module.exports = ViteEnvs;
}

export default ViteEnvs;
