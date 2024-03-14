import PropTypes from "prop-types";
import { createContext, useState } from "react";

export const StoreContext = createContext({});

function StoreContextProvider({ children }) {
  const [storeInfo, setStoreInfo] = useState({});

  return (
    <StoreContext.Provider value={{ storeInfo, setStoreInfo }}>
      {children}
    </StoreContext.Provider>
  );
}

StoreContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StoreContextProvider;
