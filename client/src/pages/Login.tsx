import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import Button from "../components/Button";

function Login(){
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
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Email ou mot de passe incorrect');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-yellow-100 flex items-center justify-center">
            <p className="text-4xl font-bold text-primary">
                TailwindCSS fonctionne ! 🎉
            </p>
            <Button variant="warning" onClick={() => alert('Bouton cliqué !')}>
                Cliquer Moi
            </Button>
        </div>
    );
}

export default Login;