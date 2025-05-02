import { BrowserRouter, Route, Routes } from "react-router"
import { HomePage } from "./pages/HomePage"
import { MainPage } from "./pages/MainPage"

export const App = () => {
    return <BrowserRouter>
        <Routes>
            <Route path="/">
                <Route path="/" Component={MainPage} />
                <Route path="c">
                    <Route path="" Component={MainPage} />
                    <Route path=":chat_id" Component={HomePage} />
                </Route>
            </Route>
        </Routes>
    </BrowserRouter>
}