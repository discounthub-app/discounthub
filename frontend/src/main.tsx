import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import LoginPage from './pages/Login';
import MePage from './pages/Me';
import DiscountsPage from './pages/DiscountsPage';
import DiscountDetailPage from './pages/DiscountDetailPage'; // 👈 добавлен импорт
import './index.css';

function Home() {
  return (
    <div className="p-6 space-y-3">
      <div className="text-xl font-semibold">Home — вы авторизованы? 🙂</div>
      <nav className="space-x-3 underline">
        <Link to="/login">/login</Link>
        <Link to="/me">/me</Link>
        <Link to="/discounts">/discounts</Link>
      </nav>
    </div>
  );
}

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/me', element: <MePage /> },
  { path: '/discounts', element: <DiscountsPage /> },
  { path: '/discounts/:id', element: <DiscountDetailPage /> }, // 👈 добавлен роут
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
