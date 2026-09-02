const CHAVES = {
    posts: "escola_posts",
    eventos: "escola_eventos",
    equipe: "escola_equipe",
    jogos: "escola_jogos"
};

function obterDados(chave) {
    return JSON.parse(localStorage.getItem(chave)) || [];
}

function salvarDados(chave, dados) {
    localStorage.setItem(chave, JSON.stringify(dados));
}

function escaparHTML(texto) {
    return String(texto || "")
        .replaceAll("&", "&")
        .replaceAll("<", "<")
        .replaceAll(">", ">")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatarData(data) {
    if (!data) return "";

    const partes = data.split("-");

    if (partes.length !== 3) return data;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function gerarId() {
    return Date.now().toString();
}

const nomeAdministrador = sessionStorage.getItem("nomeAdministrador");
const campoNomeAdministrador = document.getElementById("nomeAdministrador");

if (campoNomeAdministrador) {
    campoNomeAdministrador.textContent = `Olá, ${nomeAdministrador || "Administrador"}`;
}

document.getElementById("btnSair").addEventListener("click", function () {
    sessionStorage.removeItem("adminAutorizado");
    sessionStorage.removeItem("nomeAdministrador");
    window.location.href = "login.html";
});

/* Navegação entre seções */

const botoesMenu = document.querySelectorAll(".menu-admin");
const secoes = document.querySelectorAll(".secao-admin");

botoesMenu.forEach(function (botao) {
    botao.addEventListener("click", function () {
        const secaoEscolhida = botao.dataset.secao;

        botoesMenu.forEach(item => item.classList.remove("ativo"));
        botao.classList.add("ativo");

        secoes.forEach(secao => {
            secao.classList.remove("ativa");
        });

        document.getElementById(secaoEscolhida).classList.add("ativa");

        atualizarResumo();
    });
});

/* Funções gerais dos formulários */

function alternarFormulario(idFormulario, exibir) {
    const formulario = document.getElementById(idFormulario);

    if (exibir) {
        formulario.classList.remove("oculto");
    } else {
        formulario.classList.add("oculto");
        formulario.reset();

        const campoId = formulario.querySelector("input[type='hidden']");

        if (campoId) {
            campoId.value = "";
        }
    }
}

/* POSTS */

const formPost = document.getElementById("formPost");

document.getElementById("btnNovoPost").addEventListener("click", function () {
    alternarFormulario("formPost", true);
    document.getElementById("postTitulo").focus();
});

document.getElementById("cancelarPost").addEventListener("click", function () {
    alternarFormulario("formPost", false);
});

formPost.addEventListener("submit", function (event) {
    event.preventDefault();

    const posts = obterDados(CHAVES.posts);
    const id = document.getElementById("postId").value;

    const post = {
        id: id || gerarId(),
        titulo: document.getElementById("postTitulo").value.trim(),
        resumo: document.getElementById("postResumo").value.trim(),
        conteudo: document.getElementById("postConteudo").value.trim(),
        imagem: document.getElementById("postImagem").value.trim(),
        data: document.getElementById("postData").value
    };

    if (id) {
        const indice = posts.findIndex(item => item.id === id);
        posts[indice] = post;
    } else {
        posts.push(post);
    }

    salvarDados(CHAVES.posts, posts);
    alternarFormulario("formPost", false);
    renderizarPosts();
    atualizarResumo();
});

function renderizarPosts() {
    const container = document.getElementById("listaPosts");
    const posts = obterDados(CHAVES.posts);

    if (posts.length === 0) {
        container.innerHTML = `<div class="vazio">Nenhum post cadastrado.</div>`;
        return;
    }

    container.innerHTML = posts.map(post => `
        <article class="item-admin">
            <div>
                <h3>${escaparHTML(post.titulo)}</h3>
                <p>${escaparHTML(post.resumo)}</p>
                <p><strong>Data:</strong> ${formatarData(post.data)}</p>
            </div>

            <div class="item-acoes">
                <button class="btn-editar" data-editar-post="${post.id}">
                    Editar
                </button>

                <button class="btn-excluir" data-excluir-post="${post.id}">
                    Excluir
                </button>
            </div>
        </article>
    `).join("");
}

document.getElementById("listaPosts").addEventListener("click", function (event) {
    const idEditar = event.target.dataset.editarPost;
    const idExcluir = event.target.dataset.excluirPost;

    if (idEditar) {
        const post = obterDados(CHAVES.posts).find(item => item.id === idEditar);

        document.getElementById("postId").value = post.id;
        document.getElementById("postTitulo").value = post.titulo;
        document.getElementById("postResumo").value = post.resumo;
        document.getElementById("postConteudo").value = post.conteudo;
        document.getElementById("postImagem").value = post.imagem;
        document.getElementById("postData").value = post.data;

        alternarFormulario("formPost", true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (idExcluir && confirm("Deseja excluir este post?")) {
        const posts = obterDados(CHAVES.posts)
            .filter(item => item.id !== idExcluir);

        salvarDados(CHAVES.posts, posts);
        renderizarPosts();
        atualizarResumo();
    }
});

/* EVENTOS */

const formEvento = document.getElementById("formEvento");

document.getElementById("btnNovoEvento").addEventListener("click", function () {
    alternarFormulario("formEvento", true);
    document.getElementById("eventoTitulo").focus();
});

document.getElementById("cancelarEvento").addEventListener("click", function () {
    alternarFormulario("formEvento", false);
});

formEvento.addEventListener("submit", function (event) {
    event.preventDefault();

    const eventos = obterDados(CHAVES.eventos);
    const id = document.getElementById("eventoId").value;

    const evento = {
        id: id || gerarId(),
        titulo: document.getElementById("eventoTitulo").value.trim(),
        descricao: document.getElementById("eventoDescricao").value.trim(),
        tipo: document.getElementById("eventoTipo").value,
        turma: document.getElementById("eventoTurma").value,
        data: document.getElementById("eventoData").value
    };

    if (id) {
        const indice = eventos.findIndex(item => item.id === id);
        eventos[indice] = evento;
    } else {
        eventos.push(evento);
    }

    salvarDados(CHAVES.eventos, eventos);
    alternarFormulario("formEvento", false);
    renderizarEventos();
    atualizarResumo();
});

function renderizarEventos() {
    const container = document.getElementById("listaEventos");
    const eventos = obterDados(CHAVES.eventos);

    if (eventos.length === 0) {
        container.innerHTML = `<div class="vazio">Nenhum evento cadastrado.</div>`;
        return;
    }

    container.innerHTML = eventos.map(evento => `
        <article class="item-admin">
            <div>
                <h3>${escaparHTML(evento.titulo)}</h3>
                <p>${escaparHTML(evento.descricao)}</p>
                <p>
                    <strong>${escaparHTML(evento.tipo)}</strong>
                    — ${escaparHTML(evento.turma)}
                    — ${formatarData(evento.data)}
                </p>
            </div>

            <div class="item-acoes">
                <button class="btn-editar" data-editar-evento="${evento.id}">
                    Editar
                </button>

                <button class="btn-excluir" data-excluir-evento="${evento.id}">
                    Excluir
                </button>
            </div>
        </article>
    `).join("");
}

document.getElementById("listaEventos").addEventListener("click", function (event) {
    const idEditar = event.target.dataset.editarEvento;
    const idExcluir = event.target.dataset.excluirEvento;

    if (idEditar) {
        const evento = obterDados(CHAVES.eventos)
            .find(item => item.id === idEditar);

        document.getElementById("eventoId").value = evento.id;
        document.getElementById("eventoTitulo").value = evento.titulo;
        document.getElementById("eventoDescricao").value = evento.descricao;
        document.getElementById("eventoTipo").value = evento.tipo;
        document.getElementById("eventoTurma").value = evento.turma;
        document.getElementById("eventoData").value = evento.data;

        alternarFormulario("formEvento", true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (idExcluir && confirm("Deseja excluir este evento?")) {
        const eventos = obterDados(CHAVES.eventos)
            .filter(item => item.id !== idExcluir);

        salvarDados(CHAVES.eventos, eventos);
        renderizarEventos();
        atualizarResumo();
    }
});

/* EQUIPE */

const formProfissional = document.getElementById("formProfissional");

document.getElementById("btnNovoProfissional").addEventListener("click", function () {
    alternarFormulario("formProfissional", true);
    document.getElementById("profissionalNome").focus();
});

document.getElementById("cancelarProfissional").addEventListener("click", function () {
    alternarFormulario("formProfissional", false);
});

formProfissional.addEventListener("submit", function (event) {
    event.preventDefault();

    const equipe = obterDados(CHAVES.equipe);
    const id = document.getElementById("profissionalId").value;

    const profissional = {
        id: id || gerarId(),
        nome: document.getElementById("profissionalNome").value.trim(),
        cargo: document.getElementById("profissionalCargo").value.trim(),
        descricao: document.getElementById("profissionalDescricao").value.trim(),
        imagem: document.getElementById("profissionalImagem").value.trim()
    };

    if (id) {
        const indice = equipe.findIndex(item => item.id === id);
        equipe[indice] = profissional;
    } else {
        equipe.push(profissional);
    }

    salvarDados(CHAVES.equipe, equipe);
    alternarFormulario("formProfissional", false);
    renderizarEquipe();
    atualizarResumo();
});

function renderizarEquipe() {
    const container = document.getElementById("listaEquipe");
    const equipe = obterDados(CHAVES.equipe);

    if (equipe.length === 0) {
        container.innerHTML = `<div class="vazio">Nenhum profissional cadastrado.</div>`;
        return;
    }

    container.innerHTML = equipe.map(profissional => `
        <article class="item-admin">
            <div>
                <h3>${escaparHTML(profissional.nome)}</h3>
                <p><strong>${escaparHTML(profissional.cargo)}</strong></p>
                <p>${escaparHTML(profissional.descricao)}</p>
            </div>

            <div class="item-acoes">
                <button class="btn-editar" data-editar-profissional="${profissional.id}">
                    Editar
                </button>

                <button class="btn-excluir" data-excluir-profissional="${profissional.id}">
                    Excluir
                </button>
            </div>
        </article>
    `).join("");
}

document.getElementById("listaEquipe").addEventListener("click", function (event) {
    const idEditar = event.target.dataset.editarProfissional;
    const idExcluir = event.target.dataset.excluirProfissional;

    if (idEditar) {
        const profissional = obterDados(CHAVES.equipe)
            .find(item => item.id === idEditar);

        document.getElementById("profissionalId").value = profissional.id;
        document.getElementById("profissionalNome").value = profissional.nome;
        document.getElementById("profissionalCargo").value = profissional.cargo;
        document.getElementById("profissionalDescricao").value = profissional.descricao;
        document.getElementById("profissionalImagem").value = profissional.imagem;

        alternarFormulario("formProfissional", true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (idExcluir && confirm("Deseja excluir este profissional?")) {
        const equipe = obterDados(CHAVES.equipe)
            .filter(item => item.id !== idExcluir);

        salvarDados(CHAVES.equipe, equipe);
        renderizarEquipe();
        atualizarResumo();
    }
});

/* JOGOS */

const formJogo = document.getElementById("formJogo");

document.getElementById("btnNovoJogo").addEventListener("click", function () {
    alternarFormulario("formJogo", true);
    document.getElementById("jogoModalidade").focus();
});

document.getElementById("cancelarJogo").addEventListener("click", function () {
    alternarFormulario("formJogo", false);
});

formJogo.addEventListener("submit", function (event) {
    event.preventDefault();

    const jogos = obterDados(CHAVES.jogos);
    const id = document.getElementById("jogoId").value;

    const jogo = {
        id: id || gerarId(),
        modalidade: document.getElementById("jogoModalidade").value.trim(),
        turmaA: document.getElementById("jogoTurmaA").value.trim(),
        turmaB: document.getElementById("jogoTurmaB").value.trim(),
        dia: document.getElementById("jogoDia").value,
        periodo: document.getElementById("jogoPeriodo").value
    };

    if (id) {
        const indice = jogos.findIndex(item => item.id === id);
        jogos[indice] = jogo;
    } else {
        jogos.push(jogo);
    }

    salvarDados(CHAVES.jogos, jogos);
    alternarFormulario("formJogo", false);
    renderizarJogos();
    atualizarResumo();
});

function renderizarJogos() {
    const container = document.getElementById("listaJogos");
    const jogos = obterDados(CHAVES.jogos);

    if (jogos.length === 0) {
        container.innerHTML = `<div class="vazio">Nenhum jogo cadastrado.</div>`;
        return;
    }

    container.innerHTML = jogos.map(jogo => `
        <article class="item-admin">
            <div>
                <h3>${escaparHTML(jogo.modalidade)}</h3>
                <p>
                    ${escaparHTML(jogo.turmaA)}
                    x
                    ${escaparHTML(jogo.turmaB)}
                </p>
                <p>
                    Dia: ${formatarData(jogo.dia)}
                    — ${escaparHTML(jogo.periodo)}º período
                </p>
            </div>

            <div class="item-acoes">
                <button class="btn-editar" data-editar-jogo="${jogo.id}">
                    Editar
                </button>

                <button class="btn-excluir" data-excluir-jogo="${jogo.id}">
                    Excluir
                </button>
            </div>
        </article>
    `).join("");
}

document.getElementById("listaJogos").addEventListener("click", function (event) {
    const idEditar = event.target.dataset.editarJogo;
    const idExcluir = event.target.dataset.excluirJogo;

    if (idEditar) {
        const jogo = obterDados(CHAVES.jogos)
            .find(item => item.id === idEditar);

        document.getElementById("jogoId").value = jogo.id;
        document.getElementById("jogoModalidade").value = jogo.modalidade;
        document.getElementById("jogoTurmaA").value = jogo.turmaA;
        document.getElementById("jogoTurmaB").value = jogo.turmaB;
        document.getElementById("jogoDia").value = jogo.dia;
        document.getElementById("jogoPeriodo").value = jogo.periodo;

        alternarFormulario("formJogo", true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (idExcluir && confirm("Deseja excluir este jogo?")) {
        const jogos = obterDados(CHAVES.jogos)
            .filter(item => item.id !== idExcluir);

        salvarDados(CHAVES.jogos, jogos);
        renderizarJogos();
        atualizarResumo();
    }
});

/* Resumo inicial */

function atualizarResumo() {
    document.getElementById("totalPosts").textContent =
        obterDados(CHAVES.posts).length;

    document.getElementById("totalEventos").textContent =
        obterDados(CHAVES.eventos).length;

    document.getElementById("totalEquipe").textContent =
        obterDados(CHAVES.equipe).length;

    document.getElementById("totalJogos").textContent =
        obterDados(CHAVES.jogos).length;
}

renderizarPosts();
renderizarEventos();
renderizarEquipe();
renderizarJogos();
atualizarResumo();