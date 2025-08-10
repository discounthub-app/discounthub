import api from './api';

export type Discount = {
  id: number;
  title: string;
  description: string;
  price: number;
  store_id: number;
};

export async function getDiscounts(): Promise<Discount[]> {
  const response = await api.get('/discounts');
  return response.data;
}

export async function getDiscountById(id: number): Promise<Discount> {
  const response = await api.get(`/discounts/${id}`);
  return response.data;
}