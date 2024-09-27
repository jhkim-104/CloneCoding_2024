import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/Home";
import Detail from "./routes/Detail";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/movie",
		element: <Detail />,
	},
]);

function App() {
	return <RouterProvider router={router} />;
}
export default App;
