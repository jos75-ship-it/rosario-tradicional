let bibliaData = null;

async function carregarBiblia() {
    try {
        const response = await fetch('biblia.json');
        if (!response.ok) throw new Error("biblia.json não encontrado");
        bibliaData = await response.json();
        popularLivros();
    } catch (error) {
        console.error("Erro ao carregar a Bíblia:", error);
        const textoBox = document.getElementById('biblia-texto');
        if (textoBox) {
            textoBox.innerHTML = "<p style='color: var(--burgundy-bright); text-align: center; padding: 20px; border: 1px solid var(--border-subtle); border-radius: 8px;'>Erro ao carregar a Bíblia. Certifique-se de que o arquivo <b>biblia.json</b> foi gerado pelo script Python e está na pasta raiz do projeto.</p>";
        }
    }
}

function popularLivros() {
    const selectLivro = document.getElementById('select-livro');
    selectLivro.innerHTML = '<option value="">Selecione o livro</option>';
    
    bibliaData.livros.forEach((livro, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `[${livro.testamento}] ${livro.nome}`; 
        selectLivro.appendChild(option);
    });
}

window.carregarCapitulos = function() {
    const selectLivro = document.getElementById('select-livro');
    const selectCapitulo = document.getElementById('select-capitulo');
    const indexLivro = selectLivro.value;

    if (indexLivro === "") {
        selectCapitulo.innerHTML = '<option value="">Capítulo</option>';
        selectCapitulo.disabled = true;
        document.getElementById('biblia-texto').innerHTML = "<p style='text-align: center; color: var(--text-muted); font-style: italic; margin-top: 40px;'>Selecione um livro e um capítulo acima para iniciar a leitura.</p>";
        return;
    }

    const livro = bibliaData.livros[indexLivro];
    selectCapitulo.innerHTML = '<option value="">Capítulo</option>';
    
    livro.capitulos.forEach((capitulo, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `Capítulo ${capitulo.numero}`;
        selectCapitulo.appendChild(option);
    });

    selectCapitulo.disabled = false;
    document.getElementById('biblia-texto').innerHTML = `<p style="text-align: center; color: var(--text-dim); margin-top: 40px; font-style: italic;">Livro de <b>${livro.nome}</b> selecionado.<br>Agora escolha o capítulo.</p>`;
};

window.exibirVersiculos = function() {
    const indexLivro = document.getElementById('select-livro').value;
    const indexCapitulo = document.getElementById('select-capitulo').value;
    const containerTexto = document.getElementById('biblia-texto');

    if (indexCapitulo === "") return;

    const livro = bibliaData.livros[indexLivro];
    const capitulo = livro.capitulos[indexCapitulo];
    
    let html = `<h3 style="font-family: var(--font-display); color: var(--gold); text-align: center; margin-bottom: 24px; font-size: 1.4rem; letter-spacing: 0.1em;">${livro.nome} — Cap. ${capitulo.numero}</h3>`;
    
    capitulo.versiculos.forEach(v => {
        html += `<p><span class="versiculo-num">${v.numero}</span> <span class="versiculo-texto">${v.texto}</span></p>`;
    });

    containerTexto.innerHTML = html;
    containerTexto.scrollTo({ top: 0, behavior: 'smooth' });
};

// Inicializa a Bíblia assim que o DOM carregar
document.addEventListener('DOMContentLoaded', carregarBiblia);
