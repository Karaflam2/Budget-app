export interface User{
    id:string;
    name:string;
    email:string;
    password: string;
}

export interface Transaction{
    id: string;
    amount: number;
    type: 'income'| 'expense';
    category: string;
    date: string;
}

export interface category{
    id: string;
    name: string;
    color: string;
    icon: string;
}

export interface Budget{
    id: string;
    categoryId: string;
    amount: number;
    month: number;
    year: number;
}