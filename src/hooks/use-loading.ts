import useBoolean from './use-boolean';

export default function useLoading(initValue = false) {
  const {
    bool: loading,
    setTrue: startLoading,
    setFalse: endLoading,
    setBool: setLoading,
  } = useBoolean(initValue);

  return {
    loading,
    setLoading,
    startLoading,
    endLoading,
  };
}
