
/* ── Marca link ativo na nav ── */
function marcarNavAtiva() {
  const links = document.querySelectorAll('.menu-navegacao a');
  const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    link.classList.toggle('ativo', href === paginaAtual);
  });
}

/* ── Animação de contadores numéricos ── */
function animarContadores() {
  const contadores = document.querySelectorAll('[data-contador]');
  contadores.forEach(el => {
    const alvo = parseFloat(el.dataset.contador);
    const sufixo = el.dataset.sufixo || '';
    const prefixo = el.dataset.prefixo || '';
    const decimais = el.dataset.decimais ? parseInt(el.dataset.decimais) : 0;
    const duracao = 2000;
    const inicio = performance.now();

    function atualizar(agora) {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      const easing = 1 - Math.pow(1 - progresso, 3);
      const valor = alvo * easing;
      el.textContent = prefixo + valor.toFixed(decimais) + sufixo;
      if (progresso < 1) requestAnimationFrame(atualizar);
    }
    requestAnimationFrame(atualizar);
  });
}

/* ── Intersection Observer para acionar contadores e barras ── */
function observarElementos() {
  const observer = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (!entrada.isIntersecting) return;

      // Contadores
      if (entrada.target.classList.contains('painel-metricas')) {
        animarContadores();
      }

      // Barras de progresso
      if (entrada.target.classList.contains('barra-fill')) {
        const largura = entrada.target.dataset.largura;
        if (largura) entrada.target.style.width = largura;
      }

      observer.unobserve(entrada.target);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.painel-metricas, .barra-fill').forEach(el => {
    observer.observe(el);
  });
}

/* ── Scroll suave para âncoras internas ── */
function configurarAncorasInternas() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const alvo = document.querySelector(link.getAttribute('href'));
      if (!alvo) return;
      e.preventDefault();
      const offsetNav = 64;
      const topo = alvo.getBoundingClientRect().top + window.scrollY - offsetNav;
      window.scrollTo({ top: topo, behavior: 'smooth' });
    });
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  marcarNavAtiva();
  observarElementos();
  configurarAncorasInternas();

  // Barras iniciam em 0 e animam ao entrar na tela
  document.querySelectorAll('.barra-fill').forEach(el => {
    const largura = el.dataset.largura;
    el.style.width = '0%';
    el.dataset.largura = largura; // preserva o valor alvo
  });
});