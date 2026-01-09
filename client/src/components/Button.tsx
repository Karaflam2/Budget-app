interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'danger' | 'success' | 'warning';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false,
  type = 'button'
}: ButtonProps) {
  const baseStyles = "px-4 py-2 rounded font-medium transition-colors";
  
  const variantStyles = {
    primary: "bg-primary text-white hover:bg-blue-600 disabled:bg-blue-300",
    danger: "bg-danger text-white hover:bg-red-600 disabled:bg-red-300",
    success: "bg-success text-white hover:bg-green-600 disabled:bg-green-300",
    warning: "bg-warning text-white hover:bg-orange-600 disabled:bg-orange-300"
  };
  
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "";
  
  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${disabledStyles}`;
  
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={buttonClasses}>
      {children}
    </button>
  );
}

export default Button;