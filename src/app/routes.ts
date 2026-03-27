import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./components/pages/Home";
import Study from "./components/pages/Study";
import Quiz from "./components/pages/Quiz";
import Results from "./components/pages/Results";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "study", Component: Study },
      { path: "quiz", Component: Quiz },
      { path: "results", Component: Results },
    ],
  },
]);
