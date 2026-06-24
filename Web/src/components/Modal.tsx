import { LucideX } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  title?: string
  onClose: () => void
  children: React.ReactNode
  deleting?: boolean
}

export function Modal({ isOpen, onClose, title, children, deleting}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className={`
            bg-white rounded-lg p-6 w-full max-w-lg flex flex-col 
            ${deleting ? "items-center justify-center" : ""}
        `}>
            <div className={`flex justify-between`}>
                {title && (
                    <label className={`text-xl font-bold`}>
                        {title}
                    </label>
                )}
                
                {!deleting && (
                    <div className="bg-red-300 hover:bg-red-400 cursor-pointer rounded-lg">
                        <LucideX 
                        size={30} 
                        color="black" 
                        onClick={onClose} className="p-1"
                        />
                    </div>
                )}
            </div>
            <div>
                {children}
            </div>
        </div>
    </div>
  )
}