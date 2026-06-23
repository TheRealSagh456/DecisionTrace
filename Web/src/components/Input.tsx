import type { UseFormRegisterReturn } from "react-hook-form"

interface FormFieldProps {
    label: string
    type: "text" | "select" | "textarea" | "date"
    options?: {value: string, label: string}[]
    rows?: number
    disabled?: boolean
    placeholder?: string
    register?: UseFormRegisterReturn
    className?: string
    containerClassName?: string
}

export function Input({
    label,
    type,
    options,
    rows,
    disabled,
    placeholder,
    register,
    className,
    containerClassName
} : FormFieldProps) {
    return (
        <div className={`flex-1 ${containerClassName ?? ''}`}>
            <label className="font-bold text-lg">
                {label}
            </label>
            <div>
                {type === "textarea" && (
                    <textarea rows={rows ?? 3} 
                        {...register} 
                        placeholder={placeholder} 
                        disabled={disabled} 
                        className={`w-full border bg-gray-100 py-1 pl-2`}
                    />
                )}
                {type === "text" && (
                    <input type="text" {...register} placeholder={placeholder} disabled={disabled} className={className}/>
                )}
                {type === "select" && (
                    <select {...register} disabled={disabled} className={className}>
                        {options?.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )}

                {type === "date" && (
                    <input type="date" {...register} className="w-full border bg-gray-100 py-1 pl-2 h-10"/>
                )}
            </div>
        </div>
    )
}