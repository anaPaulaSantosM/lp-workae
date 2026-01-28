// URL base do backend para Vercel (API serverless)
const API_URL = '/api/users';

document.getElementById('loginForm').addEventListener('submit', async function (e) {
	e.preventDefault();
	const email = document.getElementById('username').value;
	const password = document.getElementById('password').value;
	try {
		const res = await fetch(`${API_URL}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});
		const data = await res.json();
		if (res.ok) {
			localStorage.setItem('token', data.token);
			localStorage.setItem('user_id', data.user.id);
			window.location.href = '/frontend/cadastrar-perfil-candidato.html';
		} else {
			alert(data.error || 'Erro ao fazer login.');
		}
	} catch (err) {
		alert('Erro de conexão com o servidor.');
	}
});
