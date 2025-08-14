import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token") || "";
        const res = await fetch("http://62.84.102.222:8000/categories/", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        setErr(e?.message || String(e));
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) return <div style={{padding:16}}>Загрузка…</div>;
  if (err) return <div style={{padding:16, color:"#b00020"}}>Ошибка: {err}</div>;

  return (
    <div style={{maxWidth:900, margin:"0 auto", padding:16}}>
      <h1>Категории</h1>
      <div style={{margin:"8px 0", color:"#555"}}>Всего: {items.length}</div>
      <ul style={{listStyle:"none", padding:0}}>
        {items.map(x => (
          <li key={x.id} style={{background:"#fff", border:"1px solid #eee", borderRadius:12, padding:"12px 14px", margin:"8px 0", display:"flex", justifyContent:"space-between"}}>
            <div>
              <div style={{fontWeight:600}}>{x.name}</div>
              {x.description ? <div style={{color:"#666", marginTop:4}}>{x.description}</div> : null}
            </div>
            <div style={{color:"#777"}}>id: {x.id}</div>
          </li>
        ))}
        {items.length === 0 && <li style={{color:"#777"}}>Категорий нет</li>}
      </ul>
    </div>
  );
}
