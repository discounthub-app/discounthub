(function(){
  const API = `${location.protocol}//${location.hostname}:8000`;
  const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token') || '';

  function findSubmitButton(){
    // ищем кнопку с текстом "Сохранить"
    const btns = Array.from(document.querySelectorAll('button, [type="submit"]'));
    return btns.find(b => (b.innerText || '').trim().toLowerCase().includes('сохранить')) || null;
  }

  function findForm(){
    // настоящая <form> или ближайший контейнер вокруг кнопки "Сохранить"
    const btn = findSubmitButton();
    if (!btn) return null;
    return btn.closest('form') || btn.parentElement || document.body;
  }

  async function fetchCategories(){
    const res = await fetch(`${API}/categories/`, {
      headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {}
    });
    if (!res.ok) throw new Error('categories failed');
    return res.json();
  }

  function ensureSelect(form){
    let sel = form.querySelector('#category_id');
    if (sel) return sel;

    const wrap = document.createElement('div');
    wrap.style.margin = '10px 0 0 0';

    const label = document.createElement('div');
    label.textContent = 'Категория';
    label.style.margin = '0 0 6px 4px';
    label.style.fontWeight = '600';

    sel = document.createElement('select');
    sel.id = 'category_id';
    sel.name = 'category_id';
    Object.assign(sel.style, { width:'100%', padding:'10px 12px', border:'1px solid #ddd', borderRadius:'10px' });
    sel.required = true;

    wrap.appendChild(label);
    wrap.appendChild(sel);

    const submit = findSubmitButton();
    if (submit && submit.parentElement) submit.parentElement.insertBefore(wrap, submit);
    else form.appendChild(wrap);

    return sel;
  }

  function hookFetch(){
    if (window.__discountCreateHooked) return;
    window.__discountCreateHooked = true;

    const origFetch = window.fetch;
    window.fetch = async function(input, init){
      try{
        const url = typeof input === 'string' ? input : (input && input.url) || '';
        const method = ((init && init.method) || 'GET').toUpperCase();
        const path = new URL(url, location.origin).pathname;
        // Создание скидки: POST на /discounts или /discounts/
        const isCreateDiscount = /\/discounts\/?$/i.test(path) && method === 'POST';
        if (isCreateDiscount) {
          const cid = (document.getElementById('category_id')||{}).value;
          if (cid) {
            const headers = new Headers((init && init.headers) || {});
            const ct = (headers.get('Content-Type')||'').toLowerCase();

            if (ct.includes('application/json')) {
              const obj = init && init.body ? JSON.parse(init.body) : {};
              obj.category_id = Number(cid);
              init = Object.assign({}, init, { body: JSON.stringify(obj), headers });
            } else if (ct.includes('application/x-www-form-urlencoded')) {
              const params = new URLSearchParams((init && init.body) || '');
              params.set('category_id', String(cid));
              init = Object.assign({}, init, { body: params.toString(), headers });
            } else if ((init && init.body) instanceof FormData) {
              (init.body).set('category_id', String(cid));
            } else {
              const obj = init && init.body ? JSON.parse(init.body) : {};
              obj.category_id = Number(cid);
              headers.set('Content-Type','application/json');
              init = Object.assign({}, init, { body: JSON.stringify(obj), headers });
            }
          }
        }
      }catch(_){}
      return origFetch.apply(this, arguments);
    };
  }

  async function mount(){
    const form = findForm();
    if (!form) return;

    const select = ensureSelect(form);
    select.innerHTML = '<option value="">Загрузка…</option>';

    try{
      const cats = await fetchCategories();
      select.innerHTML = '<option value="">— выберите категорию —</option>' +
        cats.map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
    }catch(e){
      select.innerHTML = '<option value="">Не удалось загрузить</option>';
    }

    hookFetch();
  }

  function ready(cb){
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', cb);
    else cb();
  }

  // запускаем и при динамическом рендере (SPA) наблюдаем появление кнопки
  ready(() => {
    let tries = 0;
    const tick = () => {
      tries++;
      if (findSubmitButton()) { mount(); return; }
      if (tries < 50) setTimeout(tick, 200); // ждать до ~10 секунд
    };
    tick();
  });
})();
