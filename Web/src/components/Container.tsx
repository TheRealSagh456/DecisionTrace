// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface DecisionContainerProps extends React.ComponentProps<'div'> {
    centralized?: boolean
}

export function DecisionContainer({children, className, centralized, ...props}: DecisionContainerProps) {
    return (
        <div className={`
            ${centralized 
            ? `flex-1 flex flex-col justify-center items-center h-auto my-10 ${className}`
            : `max-w-2xl mx-auto px-4 pt-4 flex flex-col ${className}`}`} {...props}>
            {children}
        </div>
    )
}