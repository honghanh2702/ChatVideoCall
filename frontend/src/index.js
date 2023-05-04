import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  useParams,
  Navigate
} from "react-router-dom";
import CreateVideoCall from "./page/CreateVideoCall";
import { ContextProvider } from "./Context";
import { Provider } from 'react-redux';
import store from './redux/store';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/createVideo/:roomID",
    element: <CreateVideoCall />,
    // errorElement: <CreateVideoCall />,

  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
    </Provider>
    {/* <App /> */}

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
