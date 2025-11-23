document.addEventListener('DOMContentLoaded', () => {
    const inputMintSelect = document.getElementById('inputMint');
    const outputMintSelect = document.getElementById('outputMint');
    const amountInput = document.getElementById('amount');
    const btnConsultar = document.getElementById('btnConsultar');
    const resultCard = document.getElementById('resultCard');

    const btnSwap = document.getElementById('btnSwap');

    // Load cryptocurrencies
    let cryptoMap = {}; // Map to store crypto details by contract

    fetch('/api/criptomoedas')
        .then(response => response.json())
        .then(data => {
            inputMintSelect.innerHTML = '<option value="">Selecione uma criptomoeda...</option>';
            outputMintSelect.innerHTML = '<option value="">Selecione uma criptomoeda...</option>';

            data.forEach(crypto => {
                if (crypto.contrato) {
                    cryptoMap[crypto.contrato] = crypto; // Store for lookup

                    const option = document.createElement('option');
                    option.value = crypto.contrato;
                    option.textContent = `${crypto.nome} (${crypto.sigla})`;

                    // Clone for both selects
                    inputMintSelect.appendChild(option.cloneNode(true));
                    outputMintSelect.appendChild(option);
                }
            });
        })
        .catch(error => {
            console.error('Erro ao carregar criptomoedas:', error);
            Swal.fire('Erro', 'Não foi possível carregar as criptomoedas.', 'error');
        });

    // Swap button handler
    btnSwap.addEventListener('click', () => {
        const temp = inputMintSelect.value;
        inputMintSelect.value = outputMintSelect.value;
        outputMintSelect.value = temp;

        // Add a small animation effect
        const icon = btnSwap.querySelector('i');
        icon.style.transform = 'rotate(270deg)';
        setTimeout(() => {
            icon.style.transform = 'rotate(90deg)';
        }, 200);
    });

    btnConsultar.addEventListener('click', () => {
        const inputMint = inputMintSelect.value;
        const outputMint = outputMintSelect.value;
        const amount = amountInput.value;

        console.log(`Consulting: Input=${inputMint}, Output=${outputMint}, Amount=${amount}`);

        if (!inputMint || !outputMint || !amount) {
            Swal.fire('Atenção', 'Preencha todos os campos.', 'warning');
            return;
        }

        btnConsultar.disabled = true;
        btnConsultar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Consultando...';
        resultCard.style.display = 'none';

        fetch(`/api/jupiter/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}`)
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
                return response.json();
            })
            .then(data => {
                displayResult(data, outputMint);
            })
            .catch(error => {
                console.error('Erro na cotação:', error);
                let errorMsg = 'Erro ao consultar a API Jupiter.';
                try {
                    const errorObj = JSON.parse(error.message);
                    if (errorObj.error) errorMsg = errorObj.error;
                } catch (e) {
                    // ignore
                }
                Swal.fire('Erro', errorMsg, 'error');
            })
            .finally(() => {
                btnConsultar.disabled = false;
                btnConsultar.innerHTML = '<i class="fas fa-search"></i> Consultar Melhor Preço';
            });
    });

    function displayResult(data, outputMintAddress) {
        resultCard.style.display = 'block';

        // Basic fields from Jupiter Quote Response
        const inAmount = data.inAmount;
        const outAmount = data.outAmount;
        const priceImpact = data.priceImpactPct;

        // Get symbol for output
        const outCrypto = cryptoMap[outputMintAddress];
        const outSymbol = outCrypto ? outCrypto.sigla : '';

        document.getElementById('resultInAmount').textContent = inAmount;
        document.getElementById('resultOutAmount').textContent = `${outAmount} ${outSymbol}`;
        document.getElementById('resultPriceImpact').textContent = priceImpact ? `${parseFloat(priceImpact).toFixed(4)}%` : 'N/A';

        // Calculate simple price if possible
        if (inAmount && outAmount) {
            const price = parseFloat(outAmount) / parseFloat(inAmount);
            document.getElementById('resultPrice').textContent = `1 ≈ ${price.toFixed(6)} ${outSymbol}`;
        }
    }
});
