import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";

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
    
    const handleEmailError = (value: string) => {
        setEmail(value);
        if (value.includes('@')) {
            setError('');
        } else {
            setError('Veuillez entrer une adresse email valide');
        }
    };

        try{
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError('Email ou mot de passe incorrect');
        } finally {
            setLoading(false);
        }
    };

   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
const [formData, setFormData] = useState({ name: '', amount: '' });

return (
  <>
    <button onClick={() => setIsFormModalOpen(true)}>
      Ajouter une transaction
    </button>

    <Modal
      isOpen={isFormModalOpen}
      onClose={() => setIsFormModalOpen(false)}
      title="Nouvelle transaction"
    >
      <form onSubmit={handleSubmit}>
        <Input
          label="Nom"
          value={formData.name}
          onChange={(name) => setFormData({ ...formData, name })}
          disabled={false}
        />
        <Input
          label="Montant"
          type="number"
          value={formData.amount}
          onChange={(amount) => setFormData({ ...formData, amount })}
          disabled={false}
        />
        <div className="flex gap-2 mt-4">
          <button 
            type="button"
            onClick={() => setIsFormModalOpen(false)}
            className="flex-1 bg-gray-300 px-4 py-2 rounded"
          >
            Annuler
          </button>
          <button 
            type="submit"
            className="flex-1 bg-primary text-white px-4 py-2 rounded"
          >
            Créer
          </button>
        </div>
      </form>
    </Modal>
  </>
);
}

export default Login;