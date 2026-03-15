import React, { createContext, useState, useContext, useCallback } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [activeRequests, setActiveRequests] = useState(0);

  const startLoading = useCallback(() => {
    setActiveRequests(prev => prev + 1);
  }, []);

  const stopLoading = useCallback(() => {
    setActiveRequests(prev => Math.max(0, prev - 1));
  }, []);

  const isLoading = activeRequests > 0;

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

// Global reference for non-React files (like api.js)
let globalStartLoading = () => {};
let globalStopLoading = () => {};

export const setGlobalLoadingHandlers = (start, stop) => {
  globalStartLoading = start;
  globalStopLoading = stop;
};

export const startGlobalLoading = () => globalStartLoading();
export const stopGlobalLoading = () => globalStopLoading();
