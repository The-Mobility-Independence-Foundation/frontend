"use client";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import PublicListings from "./pages/PublicListings";
import Forum from "./pages/Forum";
import Inventories from "./pages/Inventories";
import PrivateMessages from "./pages/PrivateMessages";

export default function Home() {
  
  return <div>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/listings" element={<PublicListings />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/inventories/:u_id" element={<Inventories />} />
        <Route path="/messages/:u_id" element={<PrivateMessages />} />
        <Route path="/listings/:u_id" element={<PublicListings />} />
      </Routes>
    </BrowserRouter>
  </div>
}
