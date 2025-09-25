import React, { createContext, useReducer } from "react";

// Initial state
const initialState = {
  user: null,
  loading: false,
  error: null,
};

// Reducer
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

  // Mock login function (replace with API call)
  const login = async (email, password) => {
    dispatch({ type: "LOGIN_START" });
    try {
      // fake delay
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (email === "test@mail.com" && password === "123456") {
        const user = { id: 1, name: "Divya", email };
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
      } else {
        throw new Error("Invalid credentials");
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
