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

document.getElementById('formLogin').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  console.log(email);
  try {
    await auth.signInWithEmailAndPassword(email, senha);
    window.location.href = "index.html";
  } catch (error) {
    alert("Erro: " + error.message);
  }
});

