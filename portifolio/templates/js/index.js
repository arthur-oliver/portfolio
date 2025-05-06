document.addEventListener("DOMContentLoaded", function () {

  const introducaoArtigo = document.querySelector(".section_intro article, .section_intro img");
  // const Nome_Variável = document.querySelector(".Local_Variável"); caso queira add + item

  // Cria um observador (verifica visibilidade do elemento na tela - se aparece ou não)
  const observadorDeEntrada = new IntersectionObserver((entradas) => {
    // Permite a repetição da animação
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("slide-in-top");
      } else {
        entrada.target.classList.remove("slide-in-top");
      }
    });
  }, {
    threshold: 0.5 // Ativa animação se 50% estiver visível
  });

  // Observador criado fica contínuamente analisando o elemento
  if (introducaoArtigo) {
    observadorDeEntrada.observe(introducaoArtigo);
  }
  // if (Nome_Variável) { caso queira add + item
  //   observadorDeEntrada.observe(Nome_Variável); caso queira add + item
  // }
});

  