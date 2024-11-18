function loginUser() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('userId', data.user.id); // Salvar ID do usuário localmente
                window.location.href = 'dashboard.html'; // Redirecionar ao dashboard
            } else {
                document.getElementById('loginError').textContent = data.message;
            }
        })
        .catch(err => console.error('Error:', err));
}

function registerUser() {
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const type = document.getElementById('registerType').value;

    fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, type }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('userId', data.userId); // Armazena o ID do usuário localmente
                alert('Registration successful! Redirecting...');
                window.location.href = 'dashboard.html'; // Redireciona para o dashboard
            } else {
                document.getElementById('registerError').textContent = data.message;
            }
        })
        .catch(err => console.error('Error:', err));
}
