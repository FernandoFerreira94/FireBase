import { react, useState } from "react";
import { Db } from "./fireBaseConction";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";

import "./app.css";

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [buscaTitulo, setBuscaTitulo] = useState("");
  const [buscaAutor, setBuscaAutor] = useState("");
  const [buscaId, setBuscaId] = useState("");
  const [posts, setPosts] = useState([]);

  async function handleAdd() {
    // criando banco de dados manuamente
    await setDoc(doc(Db, "posts", "12345"), {
      titulo: titulo,
      author: autor,
    })
      .then(() => {
        alert("Cadastrado com sucesso");
      })
      .catch((error) => {
        alert(error);
      });

    setAutor("");
    setTitulo("");
  }
  async function handleAddAleatorio() {
    // criando banco de dados automaticamente

    await addDoc(collection(Db, "posts"), {
      titulo: titulo,
      author: autor,
    })
      .then(() => {
        alert("sucesso ao cadastrar");
        setAutor("");
        setTitulo("");
      })
      .catch((error) => alert("ERRoR" + error));
  }

  async function handleBuscar() {
    // busca poste individual
    const postRef = doc(Db, "posts", buscaId);

    await getDoc(postRef)
      .then((snapshot) => {
        setBuscaTitulo(snapshot.data().titulo);
        setBuscaAutor(snapshot.data().autor);
      })
      .catch((error) => alert(error));
  }

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

  return (
    <>
      <h1>React-js + Fire Base :)</h1>

      <div className="container">
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
        <ul>
          {posts.map((post) => {
            return (
              <li key={post.id}>
                <span>Titulo: {post.titulo}</span>
                <br />
                <span>Autor: {post.author}</span>
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
