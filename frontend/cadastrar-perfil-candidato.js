const API_URL = '/api/users';

document.getElementById('cadastroForm').addEventListener('submit', async function (e) {
	e.preventDefault();
	const user_id = localStorage.getItem('user_id');
	if (!user_id) {
		alert('Usuário não autenticado. Faça login novamente.');
		window.location.href = '/frontend/login.html';
		return;
	}
	const form = e.target;
	const formData = new FormData(form);
	// Foto: converte para base64 (simples, não recomendado para produção grande)
	let fotoBase64 = '';
	const fotoFile = form.foto.files[0];
	if (fotoFile) {
		fotoBase64 = await toBase64(fotoFile);
	}
	const body = {
		user_id,
		foto: fotoBase64,
		nome: form.nome.value,
		idade: form.idade.value,
		cidade: form.cidade.value,
		estado: form.estado.value,
		formacao: form['formacao'].value,
		idiomas: form.idiomas.value,
		telefone: form.telefone.value,
		cursos: form['cursos-extras'].value,
		projetos: form.projetos.value,
		hobbies: form.hobbies.value,
		erro: form['erro-aprendizado'].value,
		nao_sabe: form['nao-sabe'].value,
		superacao: form.superacao.value,
		inspiracao: form.inspiracao.value,
		motivacao: form.motivacao.value,
		musica: form.musica.value,
		lugar: form.lugar.value,
		porque_contratar: form['porque-contratar'].value,
		data_contratacao: form['data-contratacao'].value || null
	};
	try {
		const res = await fetch(`${API_URL}/cadastrar-perfil-candidato`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			},
			body: JSON.stringify(body)
		});
		const data = await res.json();
		if (res.ok) {
			alert('Perfil salvo com sucesso!');
		} else {
			alert(data.error || 'Erro ao salvar perfil.');
		}
	} catch (err) {
		alert('Erro de conexão com o servidor.');
	}
});

function toBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
	});
}
