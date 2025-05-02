import { memo } from "react"
import { Navigate } from "react-router"

export const MainPage = memo(() => {
    return <Navigate to={`/c/${crypto.randomUUID()}`} />
})