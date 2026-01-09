interface InputProps {
    label: string;
    type?: string;
    value: string | number;
    onChange: (value: string) => void;
    placeholder?: string;
    erro?: string;
    required?: boolean;
    disablled: boolean
}