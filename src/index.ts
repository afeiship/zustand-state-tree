import EnvManager from '@jswork/env-manager';

declare var wx: any;

const viteEnv = new EnvManager({
  prefix: 'VITE_APP_',
  env: process.env,
});

class ViteEnvs {
  public static get(inKey?: string): any {
    return viteEnv.get(inKey);
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
