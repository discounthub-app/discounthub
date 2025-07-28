import React, { useEffect, useState } from 'react';

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://62.84.102.222:8000/discounts/')
      .then(res => res.json())
      .then(data => setDiscounts(data))
      .catch(() => setDiscounts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Скидки</h2>
      <ul>
        {discounts.map(discount => (
          <li key={discount.id}>
            <strong>{discount.title}</strong>
            <span> — {discount.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
