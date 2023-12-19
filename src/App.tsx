import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Loader from "./components/Loader";
const Home = lazy(() => import("./screens/Home"));
const Match = lazy(() => import("./screens/Match"));
const Profile = lazy(() => import("./screens/Profile"));
const Ranking = lazy(() => import("./screens/Ranking"));
const MatchInfo = lazy(() => import("./screens/MatchInfo"));
const Community = lazy(() => import("./screens/Community"));
const Auth = lazy(() => import("./screens/Auth"));

function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/matching" element={<Match />} />
        <Route path="/matching/:date" element={<Match />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/match/:id" element={<MatchInfo />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/:id" element={<Community />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Suspense>
  );
}

export default App;
