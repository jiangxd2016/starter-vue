export function useModal() {
  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error('useModel must be called inside of setup()');
  }
  const model = instance?.appContext.config.globalProperties.$modal;

  return model;
}
