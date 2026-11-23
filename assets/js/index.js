/* ==========================================================================
   Portfólio - Arthur Óliver Rossi Alves
   Scripts globais: menu mobile, animações de entrada e ano do rodapé
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  iniciarMenu();
  iniciarAnimacoes();
  atualizarAno();
});

/* Abre e fecha o menu de navegação no mobile */
function iniciarMenu() {
  const botao = document.querySelector(".navbar__botao");
  const menu = document.getElementById("menu-principal");

  if (!botao || !menu) {
    return;
  }

  const fecharMenu = () => {
    menu.classList.remove("aberto");
    botao.setAttribute("aria-expanded", "false");
  };

  botao.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    botao.setAttribute("aria-expanded", String(aberto));
  });

  // Fecha o menu ao escolher um link ou ao pressionar Esc
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", fecharMenu));

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      fecharMenu();
    }
  });

  // Fecha o menu se a tela for ampliada para o layout desktop
  window.matchMedia("(min-width: 992px)").addEventListener("change", fecharMenu);
}

/* Anima os elementos com a classe .animar quando entram na tela */
function iniciarAnimacoes() {
  const elementos = document.querySelectorAll(".animar");

  if (!("IntersectionObserver" in window)) {
    elementos.forEach((elemento) => elemento.classList.add("visivel"));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visivel");
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  elementos.forEach((elemento) => observador.observe(elemento));
}

/* Mantém o ano do copyright sempre atualizado */
function atualizarAno() {
  const ano = document.getElementById("ano-atual");

  if (ano) {
    ano.textContent = new Date().getFullYear();
  }
}
