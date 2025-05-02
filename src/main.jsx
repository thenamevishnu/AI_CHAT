import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css"
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

const container = document.getElementById("root");

const root = createRoot(container);

root.render(<PersistGate loading={null} persistor={persistor}>
    <Provider store={store}>
        <App />
        <Toaster position="top-right"/>
    </Provider>
</PersistGate>)