import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
// import HomePage from "./routes/HomePage/HomePage";
// import AuthPage from "./routes/AuthPage/AuthPage";
// import CreatePage from "./routes/CreatePage/CreatePage";
// import PostPage from "./routes/PostPage/PostPage";
// import SearchPage from "./routes/SearchPage/SearchPage";
// import UserProfilePage from "./routes/UserProfilePage/UserProfilePage";
import MainLayout from "./routes/MainLayout/MainLayout";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const HomePage = React.lazy(() => import("./routes/HomePage/HomePage"));
const AuthPage = React.lazy(() => import("./routes/AuthPage/AuthPage"));
const CreatePage = React.lazy(() => import("./routes/CreatePage/CreatePage"));
const PostPage = React.lazy(() => import("./routes/PostPage/PostPage"));
const SearchPage = React.lazy(() => import("./routes/SearchPage/SearchPage"));
const UserProfilePage = React.lazy(() => import("./routes/UserProfilePage/UserProfilePage"));

const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/Create" element={<CreatePage />} />
            <Route path="/Pin/:id" element={<PostPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/:userName" element={<UserProfilePage />} />
          </Route>
          <Route path="/Auth" element={<AuthPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
