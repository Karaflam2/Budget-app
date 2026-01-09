import { api } from './api'
import type { User } from '../types'

export const login = async(email:string, password:string)=>{
    const response = await api.post('/auth/login',{email, password});

    localStorage.setItem('token',(await response).data.token);

    return response.data
}

export const register = async(name:string, email:string, password: string) =>{
    const response = await api.post('/auth/register',{name,email,password});

    localStorage.setItem('token', response.data.token);

    return response.data;
}

export const logout = () =>{
    localStorage.removeItem('token');
}

export const getCurrentUser = async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
}