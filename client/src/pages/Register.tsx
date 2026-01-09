import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/auth";

function Register(){
    const [name,setName] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState('');
    const [loading,setLoading] =useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try{
            await register(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Email ou mot de passe incorrect');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Inscription</h1>
        </div>
    );
}

export default Register;