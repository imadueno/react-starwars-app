import "./styles.css";
import { useState, useEffect, useRef } from "react";
import {
  getPeople,
  getPeopleDetails,
  searchCharacter,
  getPeopleByPage
} from "./api/people";
import Loader from "./Loader";

export default function App() {
  // constantes
  const ITEMS_PER_PAGE = 10;
  // referencias
  const inputSearchRef = useRef(null);
  // estado
  const [people, setPeople] = useState(null);
  const [currentCharacter, setCurrentCharacter] = useState(1);
  const [detail, setDetail] = useState({});
  const [inputBusqueda, setInputBusqueda] = useState("");
  // paginación
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  // loading
  const [isLoading, setIsLoading] = useState(false);

  // efecto - TODAS las personas
  useEffect(() => {
    setIsLoading(true);
    getPeople()
      .then((data) => {
        setIsLoading(false);
        setPeople(data);
        setTotalRegistros(data.count);
      })
      .catch((error) => console.log(error));
  }, []);

  // efecto - DETALLE una persona
  useEffect(() => {
    setIsLoading(true);
    getPeopleDetails(currentCharacter)
      .then((data) => {
        setIsLoading(false);
        setDetail(data);
        setTotalRegistros(data.count);
      })
      .catch((error) => console.log(error));
  }, [currentCharacter]);

  // efecto - PAGINACION
  useEffect(() => {
    setIsLoading(true);
    getPeopleByPage(currentPage)
      .then((data) => {
        setIsLoading(false);
        setPeople(data);
        setTotalRegistros(data.count);
      })
      .catch();
  }, [currentPage]);

  // click item listado
  const handleClick = (url) => {
    const id = Number(url.split("/").slice(-2)[0]);
    setCurrentCharacter(id);
  };

  // enter input busqueda
  const handleKeyDown = (event) => {
    if (event.key !== "Enter") return;

    // vaciar input y vaciar detalles
    // inputSearchRef.current.value = "";
    setDetail({});

    if (inputBusqueda === "") {
      setCurrentPage(1);
      return;
    }

    // realizamos la busqueda con el servicio
    setIsLoading(true);
    searchCharacter(inputBusqueda)
      .then((data) => {
        setPeople(data);
        setTotalRegistros(data.count);
        if (data.count === 1) {
          setDetail(data.results[0]);
        }
      })
      .catch((error) => console.log(error));
    setIsLoading(false);
  };

  // observamos en contenido del input busqueda
  const handleChangeBusqueda = (event) => {
    event.preventDefault();

    // current accede al elemento directamente del dom
    const text = inputSearchRef.current.value;
    setInputBusqueda(text);
  };

  // páginado
  const handlePage = (step) => {
    const nextPage = currentPage + step;
    if (nextPage <= 0 || nextPage > Math.floor(totalRegistros / ITEMS_PER_PAGE))
      return;
    setCurrentPage(nextPage);
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="persona__container-container">
        <div className="persona__container">
          <h1>StarWars Character List</h1>
          <p>React App - Starwars characters, details and search</p>
          <p></p>
          <input
            type="text"
            className="persona__busqueda"
            placeholder="Buscar un personaje"
            ref={inputSearchRef}
            onChange={(event) => handleChangeBusqueda(event)}
            onKeyDown={(event) => handleKeyDown(event)}
          />

          <ul className="persona__listado">
            {people &&
              people.results.map(({ name, url }) => {
                return (
                  <li key={name} onClick={() => handleClick(url)}>
                    {name}
                  </li>
                );
              })}
          </ul>

          <section className="persona__detalle">
            {detail && (
              <div>
                <h1>{detail.name}</h1>
                <hr style={{ margin: "10px 0" }} />
                <p>
                  <strong>Height:</strong> {detail.height} cm.
                </p>
                <p>
                  <strong>Mass:</strong> {detail.mass} kg.
                </p>
                <p>
                  <strong>Eye color:</strong> {detail.eye_color}
                </p>
                <p>
                  <strong>Gender:</strong> {detail.gender}
                </p>
                <p>
                  <strong>Birthday:</strong> {detail.birth_year}
                </p>
              </div>
            )}
          </section>

          <section className="navegacion">
            <button onClick={() => handlePage(-1)}>Previous</button>
            {currentPage}
            <button onClick={() => handlePage(1)}>Next</button>
          </section>
        </div>
      </div>

      <footer>
        <h3>Star Wars App by Isaí Madueño</h3>
        <p>
          React app using{" "}
          <a href="https://swapi.dev/" target="_blank" rel="noreferrer">
            SWAPI API
          </a>{" "}
          the star wars api
        </p>
      </footer>
    </>
  );
}
