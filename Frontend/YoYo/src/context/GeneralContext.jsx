import { createContext, useState } from 'react';

const GeneralContext = createContext({
  isLoading: false,
  setLoading: () => {},
});

const GeneralProvider = ({ children }) => {
  const [isLoading, setLoading] = useState(false);

  return (
    <GeneralContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </GeneralContext.Provider>
  );
};

export { GeneralContext, GeneralProvider };