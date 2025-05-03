import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { ai } from "../lib/ai";
import { AiOutlineLoading } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { setChats } from "../redux/chat.slice";
import MarkdownWithHighlight from "../components/MarkDownHighlight";
import { SideBar } from "../components/SideBar";
import { Header } from "../components/Header";
import { getRandomPrompts } from "../constants/prompts";
import { Thinking } from "../components/Thinking";

let mounted = false;

export const HomePage = memo(() => {

    const { chat_id } = useParams()
    const { chats } = useSelector(state => state.chat)
    const [prompt, setPrompt] = useState("");
    const scrollRef = useRef(null)
    const [isOpen, setOpen] = useState(false)
    const [messages, setMessages] = useState(chats.filter(chat => chat.chat_id == chat_id) || [])
    const [isThinking, setThinking] = useState(false)
    const { model } = useSelector(state => state.model)
    const dispatch = useDispatch()

    useEffect(() => {
        setMessages(chats.filter(chat => chat.chat_id == chat_id))
    }, [chat_id])

    useEffect(() => {
        if (scrollRef.current) {
            let scrollOptions = {
                top: scrollRef.current.scrollHeight
            }
            if (mounted) {
                scrollOptions.behavior = "auto"
            } else {
                mounted = true
                scrollOptions.behavior = "auto"
            }
            scrollRef.current.scrollTo({ ...scrollOptions })
        }
    }, [messages])

    const getPrompts = useMemo(() => {
        return getRandomPrompts()
    }, [chat_id])   

    useEffect(() => {
        const initChat = async () => {
            try {
                await puter.ai.chat("Hello", {model, stream: true});
            } catch (error) {}
        };
        initChat();
    }, []);

    const generateResponseToPrompt = async (e) => {
        e.preventDefault()
        if (!prompt) return;
        const value = prompt;
        setPrompt("")
        setThinking(true)
        let response_text = ""
        setMessages(messages => [...messages, { id: crypto.randomUUID(), is_user: true, content: value, time: new Date().getTime() }])
        await ai.ask([...messages, value], model, (stream, id) => {
            response_text += stream
            setMessages(messages => {
                const newMessages = [...messages]
                const index = newMessages.findIndex(message => message.id == id)
                if (index == -1) {
                    newMessages.push({ id, is_user: false, chat_id, content: stream, time: new Date().getTime() })
                } else {
                    newMessages[index].content += stream
                    newMessages[index].time = new Date().getTime()
                }
                return newMessages
            })
            setThinking(false)
        }, (id) => {
            dispatch(setChats([
                { id: crypto.randomUUID(), is_user: true, chat_id, content: value, time: new Date().getTime() },
                { id, is_user: false, content: response_text, chat_id, time: new Date().getTime() }
            ]))
            setThinking(false)
        })
    }

    return <div className="h-screen w-screen flex justify-center">
        <Header isOpen={isOpen} setOpen={setOpen}/>
        <SideBar setMessages={setMessages} chat_id={chat_id} setOpen={setOpen} isOpen={isOpen}/>
        <div className="w-full flex items-center flex-col">
            <div className="max-w-[800px] w-full">
                <div className="h-[calc(100vh-96px)] pt-10 md:px-3 px-2 w-full overflow-y-scroll scroll" ref={scrollRef}>
                    {
                        messages.map(message => {
                            return <div key={message.id} className={`w-full my-2 flex ${message.is_user ? "justify-end" : "justify-start"}`}>
                                <div className={` whitespace-pre-wrap ${message.is_user && "bg-secondary p-1 px-2 rounded"}`}>
                                    <MarkdownWithHighlight content={message.content} />
                                </div>
                            </div>
                        })
                    }
                    {
                        isThinking && <div className={`w-full my-2 flex justify-start`}>
                            <div className={` whitespace-pre-wrap`}>
                                <Thinking />
                            </div>
                        </div>
                    }
                    {
                        messages.length == 0 && <div className="w-full flex-col h-full flex items-center justify-center">
                            <div className="text-white text-2xl">
                                How can I help you?
                            </div>
                            <div className="flex gap-2 mt-5 justify-center">
                                {
                                    getPrompts.map(prompt => {
                                        return <div key={prompt} onClick={() => setPrompt(prompt)} className="p-1 px-2 rounded max-w-[200px] cursor-pointer hover:bg-white/10 bg-black/10">{prompt}</div>
                                    })
                                }
                            </div>
                        </div>
                    }
                </div>
                <form onSubmit={(e) => !isThinking && generateResponseToPrompt(e)} className="h-[80px] mt-1 md:mx-3 mx-2 flex items-center rounded bg-secondary">
                    <textarea rows={2} type="text" placeholder="Enter your prompt" value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => {
                        if (e.key == "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            !isThinking && generateResponseToPrompt({ preventDefault: () => { } })   
                        }
                    }} className="p-2 outline-none scroll w-full resize-none" />
                    <button className="p-2" type="submit">
                        {isThinking ? <AiOutlineLoading size={25} className="text-white cursor-pointer animate-spin" /> : <IoPaperPlaneOutline size={25} className="text-white cursor-pointer" />}
                    </button>
                </form>
            </div>
        </div>
    </div>
})