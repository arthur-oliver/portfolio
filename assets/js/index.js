/* ==========================================================================
   Portfólio - Arthur Óliver Rossi Alves
   Scripts globais

   Sumário
   1. Inicialização
   2. Navegação (menu mobile, navbar na rolagem, progresso e voltar ao topo)
   3. Animações de entrada (com efeito em sequência)
   4. Início: efeito de digitação
   5. Projetos: filtro por tecnologia
   6. Habilidades: estrelas e ícones de reserva
   7. Destaques: contadores
   8. Certificados: visualizador
   9. Utilitários
   ========================================================================== */

/* 1. INICIALIZAÇÃO
   ========================================================================== */

// Respeita a preferência do sistema por menos movimento
const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", () => {
  iniciarMenu();
  iniciarRolagem();
  iniciarEstrelas();
  iniciarIconesReserva();
  iniciarContadores();
  iniciarAnimacoes();
  iniciarDigitacao();
  iniciarFiltroProjetos();
  iniciarVisualizadorCertificados();
  atualizarAno();
});

/* 2. NAVEGAÇÃO
   ========================================================================== */

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

/* Navbar compacta, barra de progresso de leitura e botão "voltar ao topo" */
function iniciarRolagem() {
  const navbar = document.querySelector(".navbar");

  if (!navbar) {
    return;
  }

  // Barra de progresso (fica na borda inferior da navbar)
  const progresso = document.createElement("div");
  progresso.className = "progresso-leitura";
  progresso.setAttribute("aria-hidden", "true");
  navbar.append(progresso);

  // Botão voltar ao topo
  const botaoTopo = document.createElement("button");
  botaoTopo.type = "button";
  botaoTopo.className = "voltar-topo";
  botaoTopo.setAttribute("aria-label", "Voltar ao topo da página");
  botaoTopo.innerHTML =
    '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">' +
    '<path d="M12 5l-7 7 1.4 1.4L11 8.8V20h2V8.8l4.6 4.6L19 12z" fill="currentColor"/></svg>';
  botaoTopo.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduzirMovimento ? "auto" : "smooth" });
  });
  document.body.append(botaoTopo);

  let aguardandoQuadro = false;

  const atualizar = () => {
    const rolagem = window.scrollY;
    const alturaRolavel = document.documentElement.scrollHeight - window.innerHeight;
    const percentual = alturaRolavel > 0 ? rolagem / alturaRolavel : 0;

    navbar.classList.toggle("navbar--rolada", rolagem > 40);
    progresso.style.transform = `scaleX(${Math.min(percentual, 1)})`;
    botaoTopo.classList.toggle("visivel", rolagem > 600);
    aguardandoQuadro = false;
  };

  // requestAnimationFrame evita recalcular mais de uma vez por quadro
  window.addEventListener(
    "scroll",
    () => {
      if (!aguardandoQuadro) {
        aguardandoQuadro = true;
        window.requestAnimationFrame(atualizar);
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", atualizar);
  atualizar();
}

/* 3. ANIMAÇÕES DE ENTRADA
   ========================================================================== */

/* Anima os elementos com a classe .animar quando entram na tela */
function iniciarAnimacoes() {
  const elementos = document.querySelectorAll(".animar");

  // Efeito em sequência: elementos irmãos aparecem um após o outro
  elementos.forEach((elemento) => {
    const irmaos = [...elemento.parentElement.children].filter((filho) => filho.classList.contains("animar"));
    const posicao = irmaos.indexOf(elemento);
    elemento.style.setProperty("--atraso", `${Math.min(posicao, 5) * 0.12}s`);
  });

  if (!("IntersectionObserver" in window)) {
    elementos.forEach((elemento) => {
      elemento.classList.add("visivel");
      elemento.dispatchEvent(new CustomEvent("visivel"));
    });
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visivel");
          entrada.target.dispatchEvent(new CustomEvent("visivel"));
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  elementos.forEach((elemento) => observador.observe(elemento));
}

/* 4. INÍCIO: EFEITO DE DIGITAÇÃO
   ========================================================================== */

function iniciarDigitacao() {
  const alvo = document.querySelector(".digitacao");

  if (!alvo || reduzirMovimento) {
    return;
  }

  const frases = alvo.dataset.frases.split("|");
  let indiceFrase = 0;
  let indiceLetra = frases[0].length;
  let apagando = true;

  alvo.classList.add("digitacao--ativa");

  const passo = () => {
    const frase = frases[indiceFrase];
    let espera = apagando ? 35 : 70;

    indiceLetra += apagando ? -1 : 1;
    alvo.textContent = frase.slice(0, indiceLetra);

    if (!apagando && indiceLetra === frase.length) {
      // Frase completa: pausa antes de apagar
      apagando = true;
      espera = 2200;
    } else if (apagando && indiceLetra === 0) {
      // Frase apagada: passa para a próxima
      apagando = false;
      indiceFrase = (indiceFrase + 1) % frases.length;
      espera = 400;
    }

    window.setTimeout(passo, espera);
  };

  // A primeira frase já aparece completa; o ciclo começa depois de uma pausa
  window.setTimeout(passo, 3000);
}

/* 5. PROJETOS: FILTRO POR TECNOLOGIA
   ========================================================================== */

function iniciarFiltroProjetos() {
  const filtro = document.querySelector(".filtro");

  if (!filtro) {
    return;
  }

  const botoes = filtro.querySelectorAll(".filtro__botao");
  const resultado = document.querySelector(".filtro__resultado");
  const projetos = [...document.querySelectorAll("main .projeto")];
  const secoes = [...document.querySelectorAll("main .secao")];
  const linksSecoes = document.querySelectorAll(".navegacao-interna a");

  // Guarda as tecnologias de cada projeto a partir das tags
  const tecnologias = new Map(
    projetos.map((projeto) => [
      projeto,
      [...projeto.querySelectorAll(".tag")].map((tag) => tag.textContent.trim().toLowerCase()),
    ]),
  );

  const aplicar = (tecnologia) => {
    let exibidos = 0;

    projetos.forEach((projeto) => {
      const corresponde = tecnologia === "todos" || tecnologias.get(projeto).includes(tecnologia.toLowerCase());
      projeto.hidden = !corresponde;

      if (corresponde) {
        exibidos += 1;
        // Reinicia a animação de entrada para uma transição suave
        projeto.classList.remove("filtrado");
        void projeto.offsetWidth;
        projeto.classList.add("filtrado");
      }
    });

    // Oculta as seções que ficaram sem projetos (inclusive a de experiências profissionais)
    secoes.forEach((secao) => {
      const temProjetos = [...secao.querySelectorAll(".projeto")].some((projeto) => !projeto.hidden);
      secao.hidden = tecnologia !== "todos" && !temProjetos;
    });

    linksSecoes.forEach((link) => {
      const secao = document.querySelector(link.getAttribute("href"));
      link.parentElement.hidden = Boolean(secao && secao.hidden);
    });

    botoes.forEach((botao) => {
      botao.setAttribute("aria-pressed", String(botao.dataset.filtro === tecnologia));
    });

    resultado.textContent =
      tecnologia === "todos"
        ? ""
        : `${exibidos} ${exibidos === 1 ? "projeto utiliza" : "projetos utilizam"} ${tecnologia}.`;
  };

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => aplicar(botao.dataset.filtro));
  });

  filtro.hidden = false;
}

/* 6. HABILIDADES: ESTRELAS E ÍCONES DE RESERVA
   ========================================================================== */

/* Separa as estrelas em elementos para que se acendam uma a uma ao aparecer */
function iniciarEstrelas() {
  document.querySelectorAll(".habilidade .estrelas").forEach((estrelas) => {
    const cheias = [...estrelas.childNodes]
      .filter((no) => no.nodeType === Node.TEXT_NODE)
      .map((no) => no.textContent.trim())
      .join("").length;

    estrelas.innerHTML = "";

    for (let indice = 0; indice < 5; indice += 1) {
      const estrela = document.createElement("span");
      estrela.className = indice < cheias ? "estrela estrela--cheia" : "estrela";
      estrela.textContent = "★";
      estrela.style.setProperty("--indice", indice);
      estrelas.append(estrela);
    }
  });
}

/* Troca por um ícone padrão os ícones de ferramentas que não carregarem */
function iniciarIconesReserva() {
  const usarIconePadrao = (imagem) => {
    const icone = document.createElement("i");
    icone.className = "bx bx-code-alt";
    icone.setAttribute("aria-hidden", "true");
    imagem.replaceWith(icone);
  };

  document.querySelectorAll(".habilidade img").forEach((imagem) => {
    if (imagem.complete && imagem.naturalWidth === 0) {
      usarIconePadrao(imagem);
    } else {
      imagem.addEventListener("error", () => usarIconePadrao(imagem), { once: true });
    }
  });
}

/* 7. DESTAQUES: CONTADORES
   ========================================================================== */

/* Conta de zero até o valor final quando o cartão aparece na tela */
function iniciarContadores() {
  document.querySelectorAll("[data-contador]").forEach((contador) => {
    const final = Number(contador.dataset.contador);
    const sufixo = contador.dataset.sufixo || "";
    const cartao = contador.closest(".animar");

    if (reduzirMovimento || !cartao) {
      return;
    }

    contador.textContent = `0${sufixo}`;

    cartao.addEventListener(
      "visivel",
      () => {
        const duracao = 1200;
        const inicio = performance.now();

        const quadro = (agora) => {
          const progresso = Math.min((agora - inicio) / duracao, 1);
          const suavizado = 1 - Math.pow(1 - progresso, 3);
          contador.textContent = `${Math.round(final * suavizado)}${sufixo}`;

          if (progresso < 1) {
            window.requestAnimationFrame(quadro);
          }
        };

        window.requestAnimationFrame(quadro);
      },
      { once: true },
    );
  });
}

/* 8. CERTIFICADOS: VISUALIZADOR
   ========================================================================== */

function iniciarVisualizadorCertificados() {
  const links = [...document.querySelectorAll(".certificado__imagem")];

  if (!links.length || !("HTMLDialogElement" in window)) {
    return;
  }

  const itens = links.map((link) => ({
    imagem: link.getAttribute("href"),
    titulo: link.closest(".certificado").querySelector(".cartao__titulo").textContent.trim(),
    data: link.closest(".certificado").querySelector(".certificado__data").textContent.trim(),
  }));

  const dialogo = document.createElement("dialog");
  dialogo.className = "visualizador";
  dialogo.setAttribute("aria-label", "Visualizador de certificados");
  dialogo.innerHTML = `
    <button class="visualizador__fechar" type="button" aria-label="Fechar">&times;</button>
    <button class="visualizador__seta visualizador__seta--anterior" type="button" aria-label="Certificado anterior">&#8249;</button>
    <figure class="visualizador__figura">
      <img class="visualizador__imagem" alt="">
      <figcaption class="visualizador__legenda"></figcaption>
    </figure>
    <button class="visualizador__seta visualizador__seta--proxima" type="button" aria-label="Próximo certificado">&#8250;</button>
  `;
  document.body.append(dialogo);

  const imagem = dialogo.querySelector(".visualizador__imagem");
  const legenda = dialogo.querySelector(".visualizador__legenda");
  let atual = 0;

  const mostrar = (indice) => {
    atual = (indice + itens.length) % itens.length;
    const item = itens[atual];
    imagem.src = item.imagem;
    imagem.alt = `Certificado ${item.titulo}`;

    const titulo = document.createElement("strong");
    titulo.textContent = item.titulo;
    const detalhes = document.createElement("span");
    detalhes.textContent = `${item.data} · ${atual + 1} de ${itens.length}`;
    legenda.replaceChildren(titulo, detalhes);
  };

  links.forEach((link, indice) => {
    link.addEventListener("click", (evento) => {
      evento.preventDefault();
      mostrar(indice);
      dialogo.showModal();
    });
  });

  dialogo.querySelector(".visualizador__fechar").addEventListener("click", () => dialogo.close());
  dialogo.querySelector(".visualizador__seta--anterior").addEventListener("click", () => mostrar(atual - 1));
  dialogo.querySelector(".visualizador__seta--proxima").addEventListener("click", () => mostrar(atual + 1));

  // Fecha ao clicar no fundo escuro
  dialogo.addEventListener("click", (evento) => {
    if (evento.target === dialogo) {
      dialogo.close();
    }
  });

  // Setas do teclado (o Esc já é tratado pelo próprio <dialog>)
  dialogo.addEventListener("keydown", (evento) => {
    if (evento.key === "ArrowLeft") {
      mostrar(atual - 1);
    } else if (evento.key === "ArrowRight") {
      mostrar(atual + 1);
    }
  });

  // Gesto de deslizar no celular
  let inicioToque = null;
  dialogo.addEventListener("touchstart", (evento) => (inicioToque = evento.touches[0].clientX), { passive: true });
  dialogo.addEventListener("touchend", (evento) => {
    if (inicioToque === null) {
      return;
    }
    const distancia = evento.changedTouches[0].clientX - inicioToque;
    if (Math.abs(distancia) > 50) {
      mostrar(distancia > 0 ? atual - 1 : atual + 1);
    }
    inicioToque = null;
  });
}

/* 9. UTILITÁRIOS
   ========================================================================== */

/* Mantém o ano do copyright sempre atualizado */
function atualizarAno() {
  const ano = document.getElementById("ano-atual");

  if (ano) {
    ano.textContent = new Date().getFullYear();
  }
}
