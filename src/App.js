import { react, useState, useEffect, use } from "react";
import { Db, auth } from "./fireBaseConction";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import "./app.css";

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [buscaTitulo, setBuscaTitulo] = useState("");
  const [buscaAutor, setBuscaAutor] = useState("");
  const [buscaId, setBuscaId] = useState("");
  const [posts, setPosts] = useState([]);
  const [idPost, setIdPost] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [user, setUser] = useState(false);
  const [userDetail, setUserDetail] = useState({});
  const [login, setLogin] = useState("logado");

  // atualiza em tempo real qualquer alteracao feita
  useEffect(() => {
    async function losdPost() {
      const unsub = onSnapshot(collection(Db, "posts"), (snapshot) => {
        let listaPost = [];
        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            author: doc.data().author,
          });
        });
        setPosts(listaPost);
      });
    }
    losdPost();
  }, []);

  // funcao de esvaziar os campos
  function campoVazil() {
    setTitulo("");
    setAutor("");
    setIdPost("");
    setEmail("");
    setSenha("");
  }

  // Add post manualmente
  async function handleAdd() {
    await setDoc(doc(Db, "posts", idPost), {
      titulo: titulo,
      author: autor,
    })
      .then(() => {
        alert("Cadastrado com sucesso");
        campoVazil();
      })
      .catch((error) => {
        alert(error);
      });
    handleBuscaLista();
  }

  // Add Post Id Aleatorio
  async function handleAddAleatorio() {
    // criando banco de dados automaticamente

    await addDoc(collection(Db, "posts"), {
      titulo: titulo,
      author: autor,
    })
      .then(() => {
        alert("sucesso ao cadastrar");
        campoVazil();
      })
      .catch((error) => alert("ERRoR" + error));
    handleBuscaLista();
  }

  // busca poste individual pelo Id
  async function handleBuscar() {
    const postRef = doc(Db, "posts", buscaId);

    await getDoc(postRef)
      .then((snapshot) => {
        setBuscaTitulo(snapshot.data().titulo);
        setBuscaAutor(snapshot.data().autor);
      })
      .catch((error) => alert(error));
  }

  // Busca lista de Post inteira
  async function handleBuscaLista() {
    const postRef = collection(Db, "posts");

    await getDocs(postRef)
      .then((snapshot) => {
        let lista = [];
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            author: doc.data().author,
          });
        });
        setPosts(lista);
      })
      .catch((error) => alert(error));
  }

  // Editar post pelo Id
  async function handleAtualizarPost() {
    const docRef = doc(Db, "posts", idPost);

    await updateDoc(docRef, { titulo: titulo, author: autor })
      .then(() => {
        alert("Post Atualizado com sucesso");
      })
      .catch((error) => {
        alert(error);
      });
    campoVazil();
    handleBuscaLista();
  }

  // excluit Post pelo Id
  async function handleExcluirPost(idPost) {
    const docRef = doc(Db, "posts", idPost);

    await deleteDoc(docRef, idPost)
      .then(() => {
        alert("Post Deletado com sucesso");
      })
      .catch((error) => alert(error));
    campoVazil();
    handleBuscaLista();
  }

  // Cadastrar email e senha
  async function handleCadastrar() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        alert("Cadastro salvo com sucesso");
        campoVazil();
      })
      .catch((error) => {
        alert(error);
      });
  }

  // LOGIN
  async function handleLogin() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then((info) => {
        alert("logado com sucesso");
        setUserDetail({
          uid: info.user.uid,
          email: info.user.email,
        });
        setUser(true);
        campoVazil();
      })
      .catch((error) => alert(error));
  }

  // deslogar
  async function handleDeslogar() {
    await signOut(auth)
      .then(() => {
        alert("Voce foi deslogado");
        setUser(false);
        setUserDetail({});
      })
      .catch((error) => alert(error));
  }

  // sistema de permanecer Logado
  useEffect(() => {
    async function checkLogin() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(true);
          setUserDetail({
            uid: user.uid,
            email: user.email,
          });
        } else {
          setUser(false);
          setUserDetail({});
        }
      });
    }

    checkLogin();
  }, []);

  return (
    <>
      <header>
        {user && (
          <div>
            {" "}
            <strong>Seja bem vindo(a) </strong>{" "}
            <span>
              Voce esta <strong className="green">{login}</strong>
            </span>{" "}
            <br />
            <span>Email: {userDetail.email}</span>,{" "}
            <span>Uid: {userDetail.uid}</span> <br />
            <button onClick={handleDeslogar}>Deslogar</button>
          </div>
        )}
      </header>
      <h1>React-js + Fire Base :)</h1>
      <div className="container">
        <h3>Usuario</h3>
        <label>
          Email:{" "}
          <input
            type="text"
            placeholder="Digite seu email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>
        <label>
          Senha:{" "}
          <input
            type="password"
            placeholder="Digite sua senha"
            onChange={(e) => setSenha(e.target.value)}
            value={senha}
          />
        </label>

        <br />

        <button onClick={handleCadastrar}>Cadastrar</button>
        <button onClick={handleLogin}>Login</button>
      </div>

      <hr />

      <div className="container">
        <h3>Posts</h3>
        <label>Id do Post</label>
        <input
          type="text"
          placeholder="Digite id do Post"
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
        />
        <br />
        <label>Titulo:</label>
        <textarea
          type="text"
          cols="30"
          rows="10"
          placeholder="Digite o tituilo"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <label>Autor:</label>
        <input
          type="text"
          placeholder="Autor do post"
          value={autor}
          onChange={(e) => {
            setAutor(e.target.value);
          }}
        />
        <button onClick={handleAdd}>Cadastrar manuamente</button>
        <hr />
        <button onClick={handleAddAleatorio}>Cadastrar Aleatoriamente</button>
        <hr />
        <label>Busca Id</label>
        <input
          type="text"
          placeholder="digite a busca"
          value={buscaId}
          onChange={(e) => setBuscaId(e.target.value)}
        />
        <button onClick={handleBuscar}>Buscar Post</button>
        <span>Titulo: {buscaTitulo}</span>
        <span>Autor: {buscaAutor}</span>
        <hr />
        <label>Buscar Lista Post</label>
        <button onClick={handleBuscaLista}>Buscar Lista Post</button>
        <br />
        <button onClick={handleAtualizarPost}>Edit Post</button>

        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <strong>Id: {post.id}</strong>
                <br />
                <span>Titulo: {post.titulo}</span>
                <br />
                <span>Autor: {post.author}</span>
                <br />
                <button onClick={() => handleExcluirPost(post.id)}>
                  Excluir
                </button>
                <br />
                <hr />
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default App;
