import { api } from "./api";
import type { Transaction } from "../types";

export const getTransaction = async () : Promise<Transaction[]> =>{
    const response = await api.get('/transactions');

    return response.data;
}

export const createTransaction = async (data: Partial<Transaction>) => {
    const response = await api.post('/transaction/create', data);
    return response.data;
}