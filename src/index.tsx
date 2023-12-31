import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Reset } from "styled-reset";
import { Provider } from "react-redux";
import { store } from "./store";
import ScrollToTop from "./components/ScrollTop";
import { ApolloProvider } from "@apollo/client";
import { client } from "./apollo";
import { HelmetProvider } from "react-helmet-async";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <HelmetProvider>
            <Reset />
            <ScrollToTop />
            <App />
          </HelmetProvider>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  </ApolloProvider>
);
