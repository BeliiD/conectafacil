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

//Navegção entre os vídeos
const carouselEl = document.querySelector('#carouselExampleIndicators');
const carouselInstance = bootstrap.Carousel.getInstance(carouselEl) || new bootstrap.Carousel(carouselEl);

document.querySelectorAll('.video-item').forEach(div => {
    div.addEventListener('click', (e) => {
        // evita que o clique no checkbox desmarque radio
        if (e.target.type === 'checkbox') return;

        const radio = div.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;

        // navegar no carousel
        const slideIndex = parseInt(div.dataset.bsSlideTo);
        if (!isNaN(slideIndex)) carouselInstance.to(slideIndex);
    });
});



