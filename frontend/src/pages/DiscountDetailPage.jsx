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

  // Формируем ссылку на Яндекс.Карты (координаты — приоритетно, иначе адрес)
  const mapUrl = discount.latitude && discount.longitude
    ? `https://yandex.ru/maps/?pt=${discount.longitude},${discount.latitude}&z=16&l=map`
    : discount.address
    ? `https://yandex.ru/maps/?text=${encodeURIComponent(discount.address)}`
    : null;

  return (
    <div style={{ padding: 16 }}>
      <Link to="/discounts" style={{ display: "block", marginBottom: 10 }}>&larr; К списку</Link>
      <h2 style={{ fontSize: 22 }}>{discount.title}</h2>
      <div style={{ marginBottom: 8 }}>{discount.description}</div>
      <div style={{ marginBottom: 8 }}>
        <b>Цена:</b> {discount.price} {discount.old_price && `(было ${discount.old_price})`}
      </div>
      <div style={{ marginBottom: 8 }}>
        <b>Категория:</b> {discount.category_id}
      </div>
      <div style={{ marginBottom: 8 }}>
        <b>Магазин:</b> {discount.store_id}
      </div>
      {discount.address && (
        <div style={{ marginBottom: 8 }}>
          <b>Адрес:</b> {discount.address}
        </div>
      )}
      {/* Кнопка "Показать на карте" только если есть mapUrl */}
      {mapUrl && (
        <a href={mapUrl} target="_blank" rel="noopener noreferrer">
          <button style={{ padding: 10, background: '#ffdb4d', fontWeight: 600 }}>
            Показать на карте
          </button>
        </a>
      )}
    </div>
  );
}
