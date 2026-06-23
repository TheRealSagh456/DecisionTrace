
interface ButtonProps extends React.ComponentProps<'button'>{
    variant: "new" | "input" | "cancel" | "save"
}

export function Button({children, variant, className, ...props}: ButtonProps) {

    const buttonStyle = {
        new: "bg-purple-600 hover:bg-purple-700",
        input: "bg-sky-600 hover:bg-sky-700",
        cancel: "bg-red-600 hover:bg-red-700",
        save: "bg-green-600 hover:bg-green-700",
    }

    return (
            <button className={`
                flex items-center justify-center
                px-4 py-2 rounded-md text-white
                font-medium transition-colors
                ${buttonStyle[variant]}
                ${className ?? ""}
            `}{...props}>
                {children}
            </button>
    )
}