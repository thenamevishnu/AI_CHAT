import { useCallback, useState } from "react"
import { BiPlus } from "react-icons/bi"
import { RiExpandLeftFill } from "react-icons/ri"
import { useDispatch, useSelector } from "react-redux"
import { models } from "../constants/models"
import { setModel } from "../redux/model.slice"
import { useNavigate } from "react-router"
import { HiBars3BottomLeft } from "react-icons/hi2"
import { IoMdTrash } from "react-icons/io"
import { removeChats } from "../redux/chat.slice"

export const SideBar = ({ isOpen, setMessages, setOpen, chat_id }) => {
    const { chats } = useSelector(state => state.chat)
    const { model } = useSelector(state => state.model)
    const [isModelOpen, setModelOpen] = useState(false)
    const dispatch = useDispatch()
    const redirect = useNavigate()

    const handleNewChatOpen = () => {
        const chat_id = crypto.randomUUID()
        redirect(`/c/${chat_id}`)
    }

    const getChats = useCallback(() => {
        const chatList = []
        for (const chat of chats) {
            if (!chatList.some(item => item.chat_id == chat.chat_id)) {
                chatList.push(chat)
            }
        }
        return chatList
    }, [chats, chat_id])

    const handleModelOpen = () => {
        setModelOpen(prev => !prev)
    }

    const handleDeleteHistory = chatId => {
        if (confirm("Are you sure ?")) {
            if (chatId == chat_id) setMessages([])
            dispatch(removeChats(chatId))
        }
    }

    return <div className={`h-screen bg-white/5 overflow-x-hidden z-1 fixed md:relative left-0 transition-all w-full ${isOpen ? "max-w-[260px]" : "max-w-0"}`}>
        <div className="h-10 flex items-center px-2"><RiExpandLeftFill className={`cursor-pointer me-2 duration-200 ${isOpen ? "rotate-0" : "rotate-180"}`} onClick={() => { setOpen(prev => !prev); setModelOpen(false) }} /> GPT</div>
        <div className="p-1 relative">
            <div onClick={handleModelOpen} className="truncate cursor-pointer p-1 rounded">Model: {model}</div>
            <div className={`fixed top-10 rounded shadow-sm max-w-[200px] shadow-black left-1 w-[calc(100%-4px)] duration-200 ${isModelOpen ? "max-h-48" : "max-h-0"} overflow-y-scroll scroll left-1`}>
                <div className="bg-[#333] shadow-xl shadow-black w-full">
                    {
                        models.map(mdl => {
                            return <div key={mdl} onClick={() => { dispatch(setModel(mdl)); handleModelOpen() }} className="p-1 truncate cursor-pointer">{mdl}</div>
                        })
                    }
                </div>
            </div>
        </div>
        <div className="p-2">
            <button onClick={handleNewChatOpen} className="bg-white/15 cursor-pointer mt-5 flex items-center gap-1 p-1 px-2 rounded-full"><BiPlus /> New Chat</button>
        </div>
        <div className="mt-5 px-2">
            <h4>Recent</h4>
            <div className="max-h-52 mt-2 overflow-y-auto scroll">
                {
                    getChats().reverse().map(chat => {
                        return <div key={chat.id} className="p-2 hover:bg-white/10 items-center rounded-full cursor-pointer flex justify-between">
                            <div onClick={() => redirect(`/c/${chat.chat_id}`)} className="flex items-center gap-1 text-nowrap"><HiBars3BottomLeft /> {chat.content.slice(0,10)}...</div>
                            <div onClick={() => handleDeleteHistory(chat.chat_id)}><IoMdTrash /></div>
                        </div>
                    })
                }
            </div>
        </div>
    </div>
}