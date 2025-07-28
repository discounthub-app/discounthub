import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function DiscountDetailPage() {
  const { id } = useParams();
  const [discount, setDiscount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://62.84.102.222:8000/discounts/${id}`)
      .then(res => res.json())
      .then(data => setDiscount(data))
      .catch(() => setDiscount(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Загрузка...</div>;
  if (!discount) return <div>Скидка не найдена</div>;

  return (
    <div>
      <Link to="/discounts">&larr; К списку</Link>
      <h2>{discount.title}</h2>
      <p>{discount.description}</p>
      <p><b>Цена:</b> {discount.price} (было {discount.old_price})</p>
      <p><b>Категория:</b> {discount.category_id}</p>
      <p><b>Магазин:</b> {discount.store_id}</p>
      {/* Можно добавить ещё детали, если есть */}
    </div>
  );
}
