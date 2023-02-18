import axios from "axios";
import { useEffect, useState } from "react";
import { Base_URL } from "../constantes/base_url";
import { GlobalContext } from "./GlobalContext";
import { useDisclosure } from "@chakra-ui/react";

function GlobalState(props) {
  const [pokemons, setPokemons] = useState([]);
  const [pokedex, setPokedex] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    async function getPokemons(url, method) {
      try {
        const response = await axios({
          method: method,
          url: url
        });

        const pokemonDetails = await Promise.all(
          response.data.results.map((pokemon) => {
            return axios.get(pokemon.url);
          })
        );

        setPokemons(pokemonDetails.map((pokemonDetail) => pokemonDetail.data));
        console.log(pokemonDetails);
      } catch (error) {
        console.error(error);
      }
    }

    getPokemons(Base_URL, "GET");
  }, []);

  const addToPokedex = (pokemonToAdd) => {
    const isAlreadyOnPokedex = pokedex.find(
      (pokemonInPokedex) => pokemonInPokedex.name === pokemonToAdd.name
    );

    if (!isAlreadyOnPokedex) {
      const newPokedex = [...pokedex, pokemonToAdd];
      setPokedex(newPokedex);
    }
    onOpen();
  };

  const removeFromPokedex = (pokemonToRemove) => {
    const newPokedex = pokedex.filter(
      (pokemonInPokedex) => pokemonInPokedex.name !== pokemonToRemove.name
    );
    setPokedex(newPokedex);
    onOpen();
  };

  const data = {
    pokemons,
    setPokemons,
    pokedex,
    setPokedex,
    addToPokedex,
    removeFromPokedex,
    isOpen,
    onOpen,
    onClose
  };

  return (
    <GlobalContext.Provider value={data}>
      {props.children}
    </GlobalContext.Provider>
  );
}

export default GlobalState;
