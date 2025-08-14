(function(){
  try{
    var bar=document.createElement('div');
    bar.style.position='fixed';
    bar.style.top='8px';
    bar.style.right='8px';
    bar.style.zIndex='99999';
    bar.style.background='#fff';
    bar.style.border='1px solid #eee';
    bar.style.borderRadius='12px';
    bar.style.boxShadow='0 2px 10px rgba(0,0,0,.06)';
    bar.style.padding='8px';
    bar.style.fontFamily='system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif';

    var a=document.createElement('a');
    a.href='/categories.html';
    a.textContent='Категории';
    a.style.display='inline-block';
    a.style.padding='8px 12px';
    a.style.textDecoration='none';
    a.style.borderRadius='10px';
    a.style.border='1px solid #ddd';
    a.style.color='#111';
    a.style.background='#f9f9f9';

    a.addEventListener('click',function(e){
      // Сохраняем токен SPA (если он есть) в localStorage, чтоб categories.html его увидела
      try{
        var t=localStorage.getItem('token')||sessionStorage.getItem('token');
        if(t) localStorage.setItem('token',t);
      }catch(_){}
    });

    bar.appendChild(a);
    document.addEventListener('DOMContentLoaded', function(){ document.body.appendChild(bar); });
  }catch(e){}
})();
