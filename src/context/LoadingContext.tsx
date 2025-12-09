import { createContext, useContext, useState } from "react";

const LoadingContext = createContext<any>(null);

export function LoadingProvider({ children }: any) {
  const [loading, setLoading] = useState(true);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export const useGlobalLoading = () => useContext(LoadingContext);
