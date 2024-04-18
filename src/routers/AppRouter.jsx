import React from "react";
import { Route, Routes } from "react-router-dom";
import { Character, HomePage } from "../pages";

export const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pokemon/:id" element={<Character />} />

            <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        </Routes>
    );
};
