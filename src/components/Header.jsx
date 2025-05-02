import { RiExpandRightFill } from "react-icons/ri"

export const Header = ({ setOpen, isOpen}) => {
    return <div className="fixed top-0 h-10 left-0 flex items-center px-2 bg-[#222]/5 z-1 backdrop-blur-sm w-screen">
        <div className="flex h-full items-center"><RiExpandRightFill className={`cursor-pointer me-2 duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`} onClick={() => setOpen(prev => !prev)} /> GPT</div>
    </div>
}