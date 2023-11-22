import { create } from 'zustand';

const moduleFiles = import.meta.glob('./modules/**/*.ts', { eager: true });

const modules = Object.keys(moduleFiles).reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/modules\/(.*)\.\w+$/, '$1');
  const value = moduleFiles[modulePath]!.default;
  // modules[moduleName] = value;
  nx.set(modules, moduleName.replace(/\//g, '.'), value);
  return modules;
}, {} as Record<string, any>);

export default modules;
