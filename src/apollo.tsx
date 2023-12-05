import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";

export const isLoggedInVar = makeVar(Boolean(localStorage.getItem("token")));

export const logUserIn = (token: any) => {
  localStorage.setItem("token", token);
  isLoggedInVar(true);
};

export const logUserOut = () => {
  localStorage.removeItem("token");
  isLoggedInVar(false);
};

const uploadHttpLink = createUploadLink({
  uri: "https://increasing-appolonia-student777.koyeb.app/graphql",
  //uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      ...(token && { token }),
    },
  };
});

export const client = new ApolloClient({
  link: authLink.concat(uploadHttpLink),
  cache: new InMemoryCache(),
});
