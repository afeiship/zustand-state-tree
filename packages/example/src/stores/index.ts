const moduleFiles = import.meta.glob<{ default: any }>('./modules/**/*.ts', { eager: true });
const camelCase = (str: string) => str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

const modules = Object.keys(moduleFiles).reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/modules\/(.*)\.\w+$/, '$1');
  const value = moduleFiles[modulePath].default;
  const key = moduleName.replace(/\//g, '.');
  // modules[moduleName] = value;
  nx.set(modules, camelCase(key), value);
  return modules;
}, {} as Record<string, any>);

export default modules;
