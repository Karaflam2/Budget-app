interface InputProps {
    label: string;
    type?: string;
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled: boolean
}

function Input({ 
    label,
    type = 'text',
    value, 
    onChange,
    placeholder = '',
    error = '',
    required = false, 
    disabled = false,
    }: InputProps) {
        const inputClasses = `
        w-full px-3 py-2 border rounded 
        ${error ? 'border-danger' : 'border-gray-300'}
        ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        focus:outline-none focus:ring-2 
        ${error ? 'focus:ring-danger' : 'focus:ring-primary'}
        `;

        return (
        <div className="w-full mb-4">
            <label className ="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-danger">*</span>}
            </label>
            <input 
                type={type}
                value={value}
                onChange= {(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={inputClasses}
                disabled={disabled}
            />
            {error && <p className="text-danger text-sm mt-1">{error}</p>}
            
        </div>
        )
};

export default Input;