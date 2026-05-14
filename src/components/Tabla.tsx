import { DataTable, type DataTableFilterMeta } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import Pokemons from "../hooks/Pokemons";
import { Dialog } from "primereact/dialog";

function Tabla() {
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    name: { value: null, matchMode: "contains" },
  });

  const { data, isLoading, error } = Pokemons();
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const [abilityEffect, setAbilityEffect] = useState<string | null>(null);

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los datos</p>;

  const imageBodyTemplate = (rowData: { url: string }) => {
    const id = rowData.url.split("/").filter(Boolean).pop(); // último número de la URL
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    return (
      <img
        src={imageUrl}
        alt={rowData.url}
        style={{ width: "100px" }}
        onDoubleClick={() => handleDoubleClick(rowData.url)}
        className="w-12 h-12 mx-auto rounded-full border border-gray-300 shadow-sm cursor-pointer"
      />
    );
  };

  const handleDoubleClick = async (url: string) => {
    const res = await fetch(url);
    const details = await res.json();
    setSelectedPokemon(details);
    setVisible(true);
    setAbilityEffect(null);   
  };

   const handleAbilityClick = async (url: string) => {
    const res = await fetch(url);
    const abilityDetails = await res.json();
   
    const effect = abilityDetails.effect_entries.find(
      (entry: any) => entry.language.name === "en",
    )?.effect;
    setAbilityEffect(effect || "No hay descripción disponible");
  };

  return (
    <div className="bg-blue shadow-lg rounded-lg p-2">
      <DataTable
        value={data?.results}        
        paginator
        rows={10}      
        filters={filters}
        onFilter={(e) => setFilters(e.filters)}
        filterDisplay="row"
        className="border border-black-700 "
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
        currentPageReportTemplate="{first} de {last} de {totalRecords} Pokemones"
      >
        <Column
          field="name"
          header="Nombre"
          className="text-black-800 font-semibold"
          headerClassName="bg-black text-white text-center pl-[10px]"
          bodyClassName="pl-[10px]"
          filter
          style={{ width: "50%", height: "50px", marginLeft: "10px" }}
          filterElement={
            <InputText
              className="pl-[10px]"
              style={{ width: "100%" }}
              value={filters["name"]?.value || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  name: { value: e.target.value, matchMode: "contains" },
                })
              }
              placeholder="Buscar por nombre"
            />
          }
        />
        <Column
          header="Imagen"
          style={{ width: "50%" }}
          body={imageBodyTemplate}
          headerClassName="bg-black text-white pl-[180px]"
        />
      </DataTable>

      <Dialog
        header={selectedPokemon?.name}
        visible={visible}
        headerClassName="bg-black text-white text-xl font-bold text-center"
        style={{ width: "30vw" }}
        onHide={() => setVisible(false)}
      >
        {selectedPokemon && (
          <div className="space-y-2 pl-[10px]">
            <p>
              <strong className="text-red-600">Tipo:</strong>{" "}
              {selectedPokemon.types.map((t: any) => t.type.name).join(", ")}
            </p>
            <p>
              <strong className="text-red-600">Peso:</strong> {selectedPokemon.weight}
            </p>
            <p>
              <strong className="text-red-600">Habilidades</strong>{" "}
              {selectedPokemon.abilities.map((a: any) => (
                <div className="flex space-x-2 mt-2">
                <button
                  key={a.ability.name}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  onClick={() => handleAbilityClick(a.ability.url)}
                >
                  {a.ability.name}
                </button>
                </div>
              ))}
            </p>
            <div>
              {abilityEffect && (
                <div className="mt-4 p-2 border-t">
                  <strong className="text-black">Efecto:</strong>
                  <p>{abilityEffect}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default Tabla;
