document.addEventListener('DOMContentLoaded', function() {
    carregarConfiguracao();
    
    const formConfiguracao = document.getElementById('formConfiguracao');
    formConfiguracao.addEventListener('submit', function(event) {
        event.preventDefault();
        salvarConfiguracao();
    });
});

function carregarConfiguracao() {
    fetch('/api/configuracao')
        .then(response => response.json())
        .then(data => {
            document.getElementById('idChatTelegram').value = data.idChatTelegram || '';
            document.getElementById('tokenChatTelegram').value = data.tokenChatTelegram || '';
            document.getElementById('senhaAdministrador').value = data.senhaAdministrador || '';
        })
        .catch(error => {
            exibirMensagem('Erro ao carregar configuração: ' + error.message, 'erro');
        });
}

function salvarConfiguracao() {
    const configuracao = {
        id: 1, // Sempre será o ID 1, pois só existe um registro
        idChatTelegram: document.getElementById('idChatTelegram').value,
        tokenChatTelegram: document.getElementById('tokenChatTelegram').value,
        senhaAdministrador: document.getElementById('senhaAdministrador').value
    };
    
    fetch('/api/configuracao', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(configuracao)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao salvar configuração');
        }
        return response.json();
    })
    .then(data => {
        exibirMensagem('Configuração salva com sucesso!', 'sucesso');
    })
    .catch(error => {
        exibirMensagem('Erro ao salvar configuração: ' + error.message, 'erro');
    });
}

function exibirMensagem(texto, tipo) {
    const mensagemDiv = document.getElementById('mensagem');
    mensagemDiv.textContent = texto;
    mensagemDiv.className = 'mensagem ' + tipo;
    
    // Limpar a mensagem após 5 segundos
    setTimeout(() => {
        mensagemDiv.textContent = '';
        mensagemDiv.className = 'mensagem';
    }, 5000);
}