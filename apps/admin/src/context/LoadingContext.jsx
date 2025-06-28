import React, { createContext, useContext, useState, useCallback } from 'react';

const LoadingContext = createContext({
  isLoading: false,
  setLoading: () => {},
  setLoadingText: () => {},
  loadingText: 'Loading...'
});

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');

  const setLoading = useCallback((loading, text = 'Loading...') => {
    setIsLoading(loading);
    setLoadingText(text);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, loadingText, setLoadingText }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}

