import React from "react";
import ReactDOM from "react-dom/client";

import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

import {
  AuthProvider
} from "./context/AuthContext";

import {
  CartProvider
} from "./context/CartContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <AuthProvider>

      <CartProvider>

        <App />

        <Toaster
          position="top-right"
          reverseOrder={false}
        />

      </CartProvider>

    </AuthProvider>

  </React.StrictMode>
);