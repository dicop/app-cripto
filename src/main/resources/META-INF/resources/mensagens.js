document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('messageForm');
    const messageText = document.getElementById('messageText');
    const sendBtn = document.getElementById('sendBtn');
    const clearBtn = document.getElementById('clearBtn');
    const charCount = document.getElementById('charCount');

    // Contador de caracteres
    messageText.addEventListener('input', function() {
        const count = this.value.length;
        charCount.textContent = count;
        
        // Mudança de cor quando próximo do limite
        if (count > 3500) {
            charCount.style.color = '#e74c3c';
        } else if (count > 3000) {
            charCount.style.color = '#f39c12';
        } else {
            charCount.style.color = '#7f8c8d';
        }
    });

    // Botão limpar
    clearBtn.addEventListener('click', function() {
        Swal.fire({
            title: 'Limpar mensagem?',
            text: 'Tem certeza que deseja limpar o texto da mensagem?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#95a5a6',
            confirmButtonText: 'Sim, limpar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                messageText.value = '';
                charCount.textContent = '0';
                charCount.style.color = '#7f8c8d';
                messageText.focus();
            }
        });
    });

    // Envio do formulário
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const mensagem = messageText.value.trim();
        
        if (!mensagem) {
            Swal.fire({
                title: 'Erro!',
                text: 'Por favor, digite uma mensagem antes de enviar.',
                icon: 'error',
                confirmButtonColor: '#e74c3c'
            });
            return;
        }

        if (mensagem.length > 4096) {
            Swal.fire({
                title: 'Erro!',
                text: 'A mensagem não pode ter mais de 4096 caracteres.',
                icon: 'error',
                confirmButtonColor: '#e74c3c'
            });
            return;
        }

        // Desabilitar botão durante o envio
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

        // Enviar mensagem
        fetch('/api/telegram/enviar-mensagem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mensagem: mensagem
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.sucesso) {
                Swal.fire({
                    title: 'Sucesso!',
                    text: data.mensagem || 'Mensagem enviada com sucesso!',
                    icon: 'success',
                    confirmButtonColor: '#27ae60'
                }).then(() => {
                    // Limpar formulário após sucesso
                    messageText.value = '';
                    charCount.textContent = '0';
                    charCount.style.color = '#7f8c8d';
                });
            } else {
                throw new Error(data.erro || 'Erro desconhecido');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            
            let errorMessage = 'Erro ao enviar mensagem. Verifique as configurações do Telegram.';
            
            if (error.message) {
                errorMessage = error.message;
            }
            
            Swal.fire({
                title: 'Erro!',
                text: errorMessage,
                icon: 'error',
                confirmButtonColor: '#e74c3c'
            });
        })
        .finally(() => {
            // Reabilitar botão
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensagem';
        });
    });

    // Atalho de teclado Ctrl+Enter para enviar
    messageText.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            messageForm.dispatchEvent(new Event('submit'));
        }
    });

    // Foco inicial no textarea
    messageText.focus();
});