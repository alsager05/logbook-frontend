import React, { createContext, useContext, useState } from "react";

const InstitutionContext = createContext();

export const InstitutionProvider = ({ children }) => {
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [isLoadingInstitution, setIsLoadingInstitution] = useState(false);

  const changeInstitution = (institution) => {
    setIsLoadingInstitution(true);
    setSelectedInstitution(institution);
    // Reset loading after a short delay to allow queries to start
    setTimeout(() => setIsLoadingInstitution(false), 300);
  };

  return (
    <InstitutionContext.Provider
      value={{
        selectedInstitution,
        setSelectedInstitution,
        changeInstitution,
        isLoadingInstitution,
      }}>
      {children}
    </InstitutionContext.Provider>
  );
};

export const useInstitution = () => {
  const context = useContext(InstitutionContext);
  if (!context) {
    throw new Error("useInstitution must be used within InstitutionProvider");
  }
  return context;
};
