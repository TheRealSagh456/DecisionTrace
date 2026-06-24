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
    defaultValue?: string
    value?: string
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
    defaultValue,
    value,
    containerClassName
} : FormFieldProps) {

    return (
        <div className={`flex-1 ${containerClassName ?? ''} ${disabled && "text-gray-800"}`}>
            <label className="font-bold text-base">
                {label}
            </label>
            <div>
                {type === "textarea" && (
                    <textarea rows={rows ?? 3} 
                        {...register} 
                        placeholder={placeholder} 
                        disabled={disabled} 
                        className={`w-full border py-1 px-3 ${disabled ? "bg-gray-300" : "bg-white"}`}
                        defaultValue={defaultValue}
                        value={value}
                    />
                )}
                {type === "text" && (
                    <input 
                        type="text" 
                        {...register} 
                        placeholder={placeholder} 
                        disabled={disabled} 
                        className={`px-3 ${disabled ? "bg-gray-300" : "bg-white"} ${className}`} 
                        defaultValue={defaultValue}
                        value={value}
                    />
                )}
                {type === "select" && (
                    <select 
                        {...register} 
                        disabled={disabled} 
                        className={`px-3 ${disabled ? "bg-gray-300" : "bg-white"} ${className}`} 
                        defaultValue={defaultValue}
                        value={value}
                    >
                        {options?.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )}

                {type === "date" && (
                    <input 
                        type="date" 
                        {...register} 
                        className={`w-full border py-1 pl-2 h-10 ${disabled ? "bg-gray-300" : "bg-white"}`} 
                        defaultValue={defaultValue}
                        value={value}
                    />
                )}
            </div>
        </div>
    )
}