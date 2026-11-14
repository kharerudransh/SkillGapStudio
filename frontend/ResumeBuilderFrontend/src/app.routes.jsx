import { createBrowserRouter } from "react-router";
import LandingPage from "./LandingPage";
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";
import Home from "./features/interview/pages/Home";
import Protected from "./features/auth/components/Protected";
import Interview from "./features/interview/pages/Interview";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/home",
        element: <Protected><Home /></Protected>
    },  
    {
        path: "/home/interview",
        element: <Protected><Interview /></Protected>
    },
    {
        path: "/interview",
        element: <Protected><Interview /></Protected>
    }
]);
