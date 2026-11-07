import React from "react";
import ReactDOM from "react-dom/client";
import AuthGate from "./AuthGate";
import App from "./App";
import "./styles.css";

// Fictional workspace data is restricted to local development.
// Production deployments pass through authentication and institute access checks.
function Root() {
  return import.meta.env.DEV ? <App /> : <AuthGate />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><Root /></React.StrictMode>);
