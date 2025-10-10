import React, { createContext, useReducer } from "react";

const initialState = {
  user: null,
  loading: false,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return { ...state, loading: false, user: action.payload, error: null };
    case "LOGIN_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
}

// Create Context
export const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (email, password) => {
    dispatch({ type: "LOGIN_START" });
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Accept ANY email + password for now
      if (email && password) {
        const user = { id: Date.now(), name: "Demo User", email };
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
      } else {
        throw new Error("Email and password are required");
      }
    } catch (err) {
      dispatch({ type: "LOGIN_ERROR", payload: err.message });
      throw err;
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
