interface DecisionContainerProps extends React.ComponentProps<'div'> {}

export function DecisionContainer({children, className, ...props}: DecisionContainerProps) {
    return (
        <div className={"max-w-2xl mx-auto px-4 py-8 flex flex-col gap-3"} {...props}>
            {children}
        </div>
    )
}