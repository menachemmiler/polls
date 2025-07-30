import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n";
import { BrowserRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./context/userContext.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <div className="google-forms-theme">
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <UserProvider>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </UserProvider>
      </BrowserRouter>
    </I18nextProvider>
  </div>
);
