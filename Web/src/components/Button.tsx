
interface ButtonProps extends React.ComponentProps<'button'>{
    variant: "new" | "input" | "cancel" | "save" | "back"
}

export function Button({children, variant, className, disabled, ...props}: ButtonProps) {

    const buttonBackground = {
        new: "bg-purple-600 ",
        input: "bg-sky-600",
        cancel: "bg-red-600",
        save: "bg-green-600",
        back: "bg-gray-600"
    }

    const buttonHover = {
        new: "hover:bg-purple-700",
        input: "hover:bg-sky-700",
        cancel: "hover:bg-red-700",
        save: "hover:bg-green-700",
        back: "hover:bg-gray-700"
    }

    return (
            <button 
                className={`
                    flex items-center justify-center
                    px-2 py-2 rounded-md text-white
                    font-bold transition-colors
                    ${buttonBackground[variant]}
                    ${className ?? ""}
                    ${disabled 
                        ? "opacity-60" 
                        : `${buttonHover[variant]} cursor-pointer`
                    }
                `}
                disabled={disabled} 
                {...props}
            >
                {children}
            </button>
    )
}