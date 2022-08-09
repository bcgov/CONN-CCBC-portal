import React from 'react';

const ErrorContext = React.createContext({
  error: null,
  setError: null,
});

export default ErrorContext;
