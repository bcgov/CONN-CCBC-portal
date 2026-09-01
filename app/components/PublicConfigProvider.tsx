import React, { createContext, useContext } from 'react';

export interface PublicConfig {
  OPENSHIFT_APP_NAMESPACE: string;
  ENABLE_MOCK_TIME: boolean;
  COVERAGES_FILE_NAME: string;
}

export const defaultPublicConfig: PublicConfig = {
  OPENSHIFT_APP_NAMESPACE: '',
  ENABLE_MOCK_TIME: false,
  COVERAGES_FILE_NAME: '',
};

const PublicConfigContext = createContext<PublicConfig>(defaultPublicConfig);

export const PublicConfigProvider = ({
  value,
  children,
}: {
  value: PublicConfig;
  children: React.ReactNode;
}) => (
  <PublicConfigContext.Provider value={value}>
    {children}
  </PublicConfigContext.Provider>
);

export const usePublicConfig = () => useContext(PublicConfigContext);
