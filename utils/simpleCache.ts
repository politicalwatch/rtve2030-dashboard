function simpleCache(maxSize: number = 10) {
  const cache = new Map<string, any>();

  function setMaxSize(size: number): void {
    maxSize = size;
  }

  function add(key: string, value: any): void {
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    cache.set(key, value);
  }

  function get(key: string): any | undefined {
    return cache.get(key);
  }

  return {
    setMaxSize,
    add,
    get,
  };
}

export default simpleCache;
