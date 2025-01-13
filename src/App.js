import { react, useState } from "react";
import { Db } from "./fireBaseConction";
import { doc, setDoc, collection, addDoc, getDoc } from "firebase/firestore";

import "./app.css";

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");

  async function handleAdd() {
    /*
    // criando banco de dados manuamente
    await setDoc(doc(Db, "posts", "12345"), {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        alert("Cadastrado com sucesso");
      })
      .catch((error) => {
        alert(error);
      });

    setAutor("");
    setTitulo("");
    */
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
    const postRef = doc(Db, "posts", "12345");

    await getDoc(postRef)
      .then((snapshot) => {
        setTitulo(snapshot.data().titulos);
        setAutor(snapshot.data().autors);
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
        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={handleBuscar}>Buscar Post</button>
      </div>
    </>
  );
}

export default App;
