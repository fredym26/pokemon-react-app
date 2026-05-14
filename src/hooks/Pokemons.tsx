import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface PokemonResult {
  name: string;
  url: string;
}

interface PokemonResponse {
  results: PokemonResult[];
}

// consume servicio
const fetchPokemons = async (): Promise<PokemonResponse> => {
  const { data } = await axios.get("https://pokeapi.co/api/v2/pokemon?offset=1&limit=1000");
  return data;
};

function Pokemons() {
 return useQuery<PokemonResponse>({
    queryKey: ["pokemons"],
    queryFn: fetchPokemons,
  });
}

export default Pokemons