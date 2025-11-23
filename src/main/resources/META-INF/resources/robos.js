document.addEventListener('DOMContentLoaded', () => {
    loadRobots();
});

function loadRobots() {
    fetch('/api/robots')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('robotsTableBody');
            tbody.innerHTML = '';
            
            for (const [name, info] of Object.entries(data)) {
                const row = document.createElement('tr');
                
                const isRunning = info.status === 'RUNNING';
                const statusClass = isRunning ? 'text-success' : 'text-danger';
                const statusIcon = isRunning ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-stop-circle"></i>';
                
                row.innerHTML = `
                    <td>${name}</td>
                    <td class="${statusClass}">${statusIcon} ${info.status}</td>
                    <td>
                        <div class="input-group" style="max-width: 150px;">
                            <input type="number" class="form-control" value="${info.frequency}" min="1" id="freq-${name}">
                            <button class="btn btn-sm btn-outline-primary" onclick="updateFrequency('${name}')">
                                <i class="fas fa-save"></i>
                            </button>
                        </div>
                    </td>
                    <td>
                        ${isRunning ? 
                            `<button class="btn btn-danger btn-sm" onclick="stopRobot('${name}')"><i class="fas fa-stop"></i> Parar</button>` : 
                            `<button class="btn btn-success btn-sm" onclick="startRobot('${name}')"><i class="fas fa-play"></i> Iniciar</button>`
                        }
                    </td>
                `;
                tbody.appendChild(row);
            }
        })
        .catch(error => {
            console.error('Error loading robots:', error);
            Swal.fire('Erro', 'Falha ao carregar robôs', 'error');
        });
}

function startRobot(name) {
    fetch(`/api/robots/${name}/start`, { method: 'POST' })
        .then(response => {
            if (response.ok) {
                loadRobots();
                Swal.fire({
                    title: 'Iniciado!',
                    text: `Robô ${name} iniciado com sucesso.`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                Swal.fire('Erro', 'Falha ao iniciar robô', 'error');
            }
        });
}

function stopRobot(name) {
    fetch(`/api/robots/${name}/stop`, { method: 'POST' })
        .then(response => {
            if (response.ok) {
                loadRobots();
                Swal.fire({
                    title: 'Parado!',
                    text: `Robô ${name} parado com sucesso.`,
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                Swal.fire('Erro', 'Falha ao parar robô', 'error');
            }
        });
}

function updateFrequency(name) {
    const frequency = document.getElementById(`freq-${name}`).value;
    fetch(`/api/robots/${name}/frequency`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ frequency: parseInt(frequency) })
    })
    .then(response => {
        if (response.ok) {
            loadRobots();
            Swal.fire({
                title: 'Atualizado!',
                text: `Frequência do robô ${name} atualizada.`,
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
        } else {
            Swal.fire('Erro', 'Falha ao atualizar frequência', 'error');
        }
    });
}
