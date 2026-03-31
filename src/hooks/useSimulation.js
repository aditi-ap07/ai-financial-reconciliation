/**
 * Hook for live simulation updates using random factor (demo only). 
 */
import { useState, useEffect } from 'react';

export function useSimulation(callback) {
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (!callback) return undefined;
    setIsSimulating(true);
    const timer = setInterval(() => {
      callback();
    }, 60000);
    return () => {
      clearInterval(timer);
      setIsSimulating(false);
    };
  }, [callback]);

  return { isSimulating };
}
