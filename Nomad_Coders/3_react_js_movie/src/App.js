import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/Home";
import Detail from "./routes/Detail";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/movie/:id",
      element: <Detail />,
    },
  ],
  {
    basename: process.env.PUBLIC_URL || "/",
  }
);

function App() {
  return <RouterProvider router={router} />;
}
export default App;
