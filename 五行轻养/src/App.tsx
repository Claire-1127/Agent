import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Chat from "@/pages/Chat";
import ConstitutionAssessment from "@/pages/ConstitutionAssessment";
import Results from "@/pages/Results";
import Recommendations from "@/pages/Recommendations";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from '@/contexts/authContext';
import { AuthProvider } from '@/contexts/AuthProvider';



export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/assessment" replace />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/assessment" element={<ConstitutionAssessment />} />
        <Route path="/results" element={<Results />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
      </Routes>
    </AuthProvider>
  );
}
