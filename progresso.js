firebase.initializeApp(firebaseConfig);
async function contadorProgresso(checkbox, porcentagemVideo, nomeModulo) {
    if (checkbox.checked) {

        var nomeVideo = checkbox.parentElement.innerText;
        console.log(nomeVideo);

        firebase.auth().onAuthStateChanged(async function (user) {
            if (user) {
                const uid = user.uid;
                const docRef = db.collection("usuarios").doc(uid).collection("progresso").doc(nomeModulo).collection("videos");
                try {
                    const docSnap = await docRef.get();
                    if (docSnap.exists) {
                        if (docSnap.data().porcentagem < 100) { var porcentagemAtual = docSnap.data().porcentagem + porcentagemVideo; }
                        db.collection("usuarios").doc(uid).collection("progresso").doc(nomeModulo).set({
                            porcentagem: porcentagemAtual
                        }, { merge: true });
                    } else {
                        porcentagemAtual = porcentagemVideo;
                        db.collection("usuarios").doc(uid).collection("progresso").doc(nomeModulo).set({
                            porcentagem: porcentagemAtual
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