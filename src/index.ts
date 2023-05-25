import EnvManager from '@jswork/env-manager';

declare var wx: any;

const viteEnv = new EnvManager({
  prefix: 'VITE_APP_',
  env: process.env,
});

class ViteEnvs {
  public static get(key: string): any {
    // @ts-ignore
    return viteEnv.get(key, import.meta.env);
  }

  public static set(inCmdRc: any): void {
    return viteEnv.set(inCmdRc);
  }
}

// for commonjs es5 require
if (typeof module !== 'undefined' && module.exports && typeof wx === 'undefined') {
  module.exports = ViteEnvs;
}

export default ViteEnvs;