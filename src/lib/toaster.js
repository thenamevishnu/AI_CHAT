import toast from "react-hot-toast"

export const toaster = {
    success: message => {
        return toast(message, {
            icon: "✅",
            duration: 2000,
            style: {
                background: "#333",
                color: "#ddd"
            }
        })
    },
    error: message => {
        return toast(message, {
            icon: "❌",
            duration: 2000,
            style: {
                background: "#333",
                color: "#ddd"
            }
        })
    }
}