import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./screens/Home";
import Match from "./screens/Match";
import Header from "./components/Header";
import Profile from "./screens/Profile";
import Ranking from "./screens/Ranking";
import MatchInfo from "./screens/MatchInfo";
import Community from "./screens/Community";
import Auth from "./screens/Auth";

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
