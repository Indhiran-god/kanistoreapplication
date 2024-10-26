// context.js
import { createContext } from 'react';

const Context = createContext({
  fetchUserDetails: null, // Provide a default value
});

export default Context;
