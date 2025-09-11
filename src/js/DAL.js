
//Conexão com o banco de dados
const firebaseConfig = {
    apiKey: "AIzaSyCXTFRdaXNE3q13ss3G6YVLvoFqPyeIqqY",
    authDomain: "conectafacil-44b3b.firebaseapp.com",
    projectId: "conectafacil-44b3b",
    storageBucket: "conectafacil-44b3b.firebasestorage.app",
    messagingSenderId: "915821605551",
    appId: "1:915821605551:web:3fbc053dbe7b5a16125a5a",
    measurementId: "G-6XVD39RZ37"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Serviços
const auth = firebase.auth();
const db = firebase.firestore();
console.log('chega');


//Verificando se o usuário está logado:
const loginButtonOffline = document.getElementById('login-button-offline');
const loginButtonOnline = document.getElementById('login-button-online');
const caminho = window.location.pathname;
// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // Usuário está logado
        console.log(user.uid);
        loginButtonOffline.style.display = 'none';
        loginButtonOnline.style.display = 'block';
        // Ex: mostrar conteúdo exclusivo ou redirecionar
    } else if (!caminho.includes('paginaLogin')) {
        // Usuário não está logado
        // Ex: redirecionar para tela de login
        if (caminho.includes('index') || caminho.includes('modulos')) {
            window.location.href = "areas-usuario/paginalogin.html";
        } else {
            window.location.href = "../areas-usuario/paginalogin.html";
        }
        // try {
        //     window.location.href = "../Areas-usuario/paginaLogin.html";
        // }
        // catch {
        //     console.log('Erro');
        // }
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
                // console.log(dados)
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

//Lista de módulos concluidos
firebase.auth().onAuthStateChanged(async function (user) {
    const uid = user.uid
    db.collection("usuarios").doc(uid).collection("progresso").get()
        .then((querySnapshot) => {

            querySnapshot.forEach((doc) => {
                if (doc.data().porcentagem > 99) {
                    let moduloConcluido = document.getElementById('modulos-concluidos');
                    moduloConcluido.innerHTML += `<li>${doc.id}</li>`;
                }
            });
        });
});

//Lista de módulos em andamento
firebase.auth().onAuthStateChanged(async function (User) {
    const uid = User.uid
    db.collection("usuarios").doc(uid).collection("progresso").get()
        .then((querySnapshot) => {

            querySnapshot.forEach((doc) => {
                if (doc.data().porcentagem < 99) {
                    let moduloNaoConcluido = document.getElementById('modulos-nao-concluidos');
                    moduloNaoConcluido.innerHTML += `<li>${doc.id}</li>`;
                    console.log(doc.id);
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

//Inserção de vídeos assistidos no banco de dados
firebase.initializeApp(firebaseConfig);
async function contadorProgresso(checkbox, porcentagemVideo, nomeModulo) {
    nomeModulo = nomeModulo.toLowerCase();
    if (checkbox.checked) {
        firebase.auth().onAuthStateChanged(async function (user) {
            if (user) {
                const uid = user.uid;
                const nomeVideo = checkbox.parentElement.textContent.trim();
                console.log(nomeVideo);
                const docRef = db.collection("usuarios").doc(uid).collection("progresso").doc(nomeModulo);
                try {
                    const docSnap = await docRef.get();
                    if (docSnap.exists) {
                        if (docSnap.data().porcentagem < 99.99) {
                            var porcentagemAtual = docSnap.data().porcentagem + porcentagemVideo;
                            var qtdAtualVideosassistidos = docSnap.data().qtd_Videos_assistidos + 1;
                            var nomeCampo = 'video ' + qtdAtualVideosassistidos;
                        }
                        db.collection("usuarios").doc(uid).collection("progresso").doc(nomeModulo).set({
                            porcentagem: porcentagemAtual,
                            qtd_Videos_assistidos: qtdAtualVideosassistidos,
                            [nomeCampo]: nomeVideo
                        }, { merge: true });
                    } else {
                        qtdAtualVideosassistidos = 1;
                        nomeCampo = 'video ' + qtdAtualVideosassistidos;
                        porcentagemAtual = porcentagemVideo;
                        db.collection("usuarios").doc(uid).collection("progresso").doc(nomeModulo).set({
                            porcentagem: porcentagemAtual,
                            qtd_Videos_assistidos: qtdAtualVideosassistidos,
                            [nomeCampo]: nomeVideo
                        }, { merge: true });
                    }
                } catch (error) {
                    console.error("Erro ao buscar documento:", error);
                }
            } else {
                console.log("Nenhum usuário logado");
            }
        });
    }
}

//Busca por vídeos já assistidos
const titleModulo = document.getElementById('titulo-modulo').innerText.toLocaleLowerCase();
console.log(titleModulo);
firebase.auth().onAuthStateChanged(async function (user) {
    const uid = user.uid

    db.collection("usuarios").doc(uid).collection("progresso").doc(titleModulo).get()
        .then((doc) => {
            if (doc.exists) {
                const dados = doc.data();

                // Transforma os valores dos campos em um array
                const valores = Object.values(dados);

                for (var i = 1; i <= 12; i++) {
                    const nomeInput = 'videoVisto' + i;
                    const Input = document.getElementById(nomeInput);
                    const textoInput = Input.parentElement.textContent.trim();
                    if (valores.includes(textoInput)) {
                        // console.log(`O valor "${textoProcurado}" foi encontrado.`);
                        document.getElementById('videoVisto' + i).checked = true;
                    } else {
                        console.log(`O valor NÃO foi encontrado.`);
                    }
                }
            } else {
                console.log("Documento não encontrado.");
            }
        })
        .catch((error) => {
            console.error("Erro ao buscar documento:", error);
        });

});


