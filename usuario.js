
//Verificando se o usuário está logado:
const loginButtonOffline = document.getElementById('login-button-offline');
const loginButtonOnline = document.getElementById('login-button-online');
// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // Usuário está logado
        loginButtonOffline.style.display = 'none';
        loginButtonOnline.style.display = 'block';
        // Ex: mostrar conteúdo exclusivo ou redirecionar
    } else {
        // Usuário não está logado
        // Ex: redirecionar para tela de login
        window.location.href = "login.html";
    }
});

//Sistema de prorgesso do usuário:
firebase.auth().onAuthStateChanged(async function (user) {
    const uid = user.uid
    db.collection("usuarios").doc(uid).collection("progresso").get()
        .then((querySnapshot) => {
            let somaTotal = 0;

            querySnapshot.forEach((doc) => {
                const dados = doc.data();
                const progresso = dados.porcentagem || 0; // Garante que não vai dar erro se estiver indefinido
                somaTotal += progresso;
            });
            var progresso = somaTotal / 4
            const barraProgresso = document.getElementById("meuProgresso");

            if (barraProgresso.value < 100) {
                barraProgresso.value = progresso;
            }
        })
        .catch((error) => {
            console.error("Erro ao buscar documentos:", error);
        });
});

firebase.auth().onAuthStateChanged(async function (user) {
    const uid = user.uid
    db.collection("usuarios").doc(uid).collection("progresso").get()
        .then((querySnapshot) => {

            querySnapshot.forEach((doc) => {
                if (doc.data().porcentagem > 99) {
                    const moduloConcluido = document.getElementById('modulos-concluidos');
                    moduloConcluido.innerHTML += `<li>${doc.id}</li>`;
                }
            });
        });
});

firebase.auth().onAuthStateChanged(async function (user) {
    const uid = user.uid
    db.collection("usuarios").doc(uid).collection("progresso").get()
        .then((querySnapshot) => {

            querySnapshot.forEach((doc) => {
                if (doc.data().porcentagem < 99) {
                    const moduloConcluido = document.getElementById('modulos-nao-concluidos');
                    moduloConcluido.innerHTML += `<li>${doc.id}</li>`;
                }
            });
        });
});

firebase.auth().onAuthStateChanged(async function (user) {
    const uid = user.uid
    db.collection("usuarios").doc(uid).collection("progresso").get()
        .then((querySnapshot) => {

            querySnapshot.forEach((doc) => {
                if (doc.data().porcentagem < 99) {
                    const moduloConcluido = document.getElementById('modulos-nao-concluidos');
                    moduloConcluido.innerHTML += `<li>${doc.id}</li>`;
                }
            });
        });
});

//Inserindo dados do usuário no HTML:
firebase.auth().onAuthStateChanged((user) => {

    const uid = user.uid;

    firebase.firestore().collection("usuarios").doc(uid).get()
        .then((doc) => {
            const nomeUsuario = document.getElementById('nome-usuario');
            const nome = doc.data().nome;
            nomeUsuario.innerHTML = `Olá ${nome} !`;
        })
        .catch((error) => {
            console.error("Erro ao buscar o nome:", error);
        });

    const emailUsuario = document.getElementById('email-usuario');
    emailUsuario.innerHTML = user.email;
});