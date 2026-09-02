import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  FolderOpen,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  X
} from "lucide-react";

import toast from "react-hot-toast";
import Swal from "sweetalert2";

import api from "../../services/api";

export default function CategoriasAdmin() {

  const [categorias, setCategorias] =
    useState([]);

  const [carregando, setCarregando] =
    useState(true);

  const [atualizando, setAtualizando] =
    useState(false);

  const [salvando, setSalvando] =
    useState(false);

  const [busca, setBusca] =
    useState("");

  const [modalAberto, setModalAberto] =
    useState(false);

  const [categoriaEditando, setCategoriaEditando] =
    useState(null);

  const [nome, setNome] =
    useState("");

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function carregarCategorias(
    mostrarLoading = true
  ) {

    try {

      if (mostrarLoading) {
        setCarregando(true);
      } else {
        setAtualizando(true);
      }

      const response =
        await api.get("/categorias");

      const lista =
        Array.isArray(response.data)
          ? response.data
          : response.data.categorias || [];

      setCategorias(lista);

    } catch (error) {

      console.error(
        "Erro ao carregar categorias:",
        error
      );

      toast.error(
        error.response?.data?.erro ||
        error.response?.data?.mensagem ||
        "Não foi possível carregar as categorias."
      );

    } finally {

      setCarregando(false);
      setAtualizando(false);

    }

  }

  function abrirNovaCategoria() {

    setCategoriaEditando(null);
    setNome("");
    setModalAberto(true);

  }

  function abrirEdicao(categoria) {

    setCategoriaEditando(categoria);

    setNome(
      categoria.nome || ""
    );

    setModalAberto(true);

  }

  function fecharModal() {

    if (salvando) {
      return;
    }

    setModalAberto(false);
    setCategoriaEditando(null);
    setNome("");

  }

  async function salvarCategoria(event) {

    event.preventDefault();

    if (!nome.trim()) {

      toast.error(
        "Informe o nome da categoria."
      );

      return;
    }

    try {

      setSalvando(true);

      if (categoriaEditando) {

        await api.put(
          `/categorias/${categoriaEditando._id}`,
          {
            nome: nome.trim()
          }
        );

        toast.success(
          "Categoria atualizada com sucesso."
        );

      } else {

        await api.post(
          "/categorias",
          {
            nome: nome.trim()
          }
        );

        toast.success(
          "Categoria criada com sucesso."
        );

      }

      setModalAberto(false);
      setCategoriaEditando(null);
      setNome("");

      await carregarCategorias(false);

    } catch (error) {

      console.error(
        "Erro ao salvar categoria:",
        error
      );

      toast.error(
        error.response?.data?.erro ||
        error.response?.data?.mensagem ||
        "Não foi possível salvar a categoria."
      );

    } finally {

      setSalvando(false);

    }

  }

  async function desativarCategoria(categoria) {

    const resultado =
      await Swal.fire({

        title: "Desativar categoria?",

        html: `
          A categoria
          <strong>${categoria.nome}</strong>
          será removida das opções disponíveis.
          <br><br>
          Ela não será apagada definitivamente.
        `,

        icon: "warning",

        showCancelButton: true,

        confirmButtonText:
          "Desativar",

        cancelButtonText:
          "Cancelar",

        confirmButtonColor:
          "#b84c32"

      });

    if (!resultado.isConfirmed) {
      return;
    }

    try {

      await api.delete(
        `/categorias/${categoria._id}`
      );

      toast.success(
        "Categoria desativada."
      );

      await carregarCategorias(false);

    } catch (error) {

      console.error(
        "Erro ao desativar categoria:",
        error
      );

      toast.error(
        error.response?.data?.erro ||
        error.response?.data?.mensagem ||
        "Não foi possível desativar a categoria."
      );

    }

  }

  const categoriasFiltradas =
    useMemo(() => {

      const termo =
        busca
          .trim()
          .toLowerCase();

      if (!termo) {
        return categorias;
      }

      return categorias.filter(
        (categoria) =>
          categoria.nome
            ?.toLowerCase()
            .includes(termo)
      );

    }, [
      categorias,
      busca
    ]);

  if (carregando) {

    return (

      <div
        className="
          min-h-[70vh]
          flex
          items-center
          justify-center
        "
      >

        <div className="text-center">

          <RefreshCw
            size={28}
            className="
              mx-auto
              text-[#d86b24]
              animate-spin
            "
          />

          <p
            className="
              mt-3
              font-bold
              text-sm
              text-[#806b5e]
            "
          >
            Carregando categorias...
          </p>

        </div>

      </div>

    );

  }

  return (

    <div
      className="
        p-4
        sm:p-6
        xl:p-8
      "
    >

      <div
        className="
          max-w-[1300px]
          mx-auto
        "
      >

        {/* CABEÇALHO */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-4
          "
        >

          <div>

            <p
              className="
                text-[#c45a1a]
                text-xs
                font-extrabold
                uppercase
                tracking-wider
              "
            >
              Administração
            </p>

            <h1
              className="
                text-2xl
                sm:text-3xl
                font-extrabold
                text-[#35241b]
                mt-1
              "
            >
              Categorias
            </h1>

            <p
              className="
                text-sm
                text-[#806b5e]
                mt-1
              "
            >
              Organize os produtos do cardápio.
            </p>

          </div>

          <div className="flex gap-2">

            <button
              type="button"
              onClick={() =>
                carregarCategorias(false)
              }
              disabled={atualizando}
              className="
                min-h-[44px]
                px-4
                bg-[#fffaf5]
                border
                border-[#dfcabc]
                rounded-xl
                text-[#59453a]
                font-bold
                flex
                items-center
                justify-center
                gap-2
              "
            >

              <RefreshCw
                size={17}
                className={
                  atualizando
                    ? "animate-spin"
                    : ""
                }
              />

            </button>

            <button
              type="button"
              onClick={
                abrirNovaCategoria
              }
              className="
                min-h-[44px]
                px-4
                bg-[#d86b24]
                hover:bg-[#be5418]
                text-white
                rounded-xl
                font-extrabold
                text-sm
                flex
                items-center
                justify-center
                gap-2
              "
            >

              <Plus size={18} />

              Nova categoria

            </button>

          </div>

        </div>

        {/* BUSCA */}

        <section
          className="
            bg-[#fffaf5]
            border
            border-[#e5d5ca]
            rounded-2xl
            p-4
            mt-6
          "
        >

          <div className="relative">

            <Search
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-[#9a8375]
              "
            />

            <input
              value={busca}
              onChange={(event) =>
                setBusca(
                  event.target.value
                )
              }
              placeholder="Buscar categoria..."
              className="
                w-full
                h-[46px]
                bg-white
                border
                border-[#dfcabc]
                rounded-xl
                pl-11
                pr-4
                outline-none
                focus:border-[#d86b24]
              "
            />

          </div>

        </section>

        <p
          className="
            mt-5
            mb-3
            text-sm
            text-[#806b5e]
          "
        >
          {categoriasFiltradas.length}
          {" "}
          {categoriasFiltradas.length === 1
            ? "categoria"
            : "categorias"}
        </p>

        {/* LISTA */}

        {categoriasFiltradas.length === 0 ? (

          <section
            className="
              bg-[#fffaf5]
              rounded-3xl
              border
              border-[#e5d5ca]
              p-10
              text-center
            "
          >

            <FolderOpen
              size={38}
              className="
                mx-auto
                text-[#c45a1a]
              "
            />

            <h2
              className="
                mt-3
                text-lg
                font-extrabold
                text-[#35241b]
              "
            >
              Nenhuma categoria encontrada
            </h2>

          </section>

        ) : (

          <div
            className="
              grid
              sm:grid-cols-2
              xl:grid-cols-3
              gap-4
            "
          >

            {categoriasFiltradas.map(
              (categoria) => (

                <article
                  key={categoria._id}
                  className="
                    bg-[#fffaf5]
                    border
                    border-[#e5d5ca]
                    rounded-3xl
                    p-5
                    shadow-sm
                  "
                >

                  <div
                    className="
                      w-12
                      h-12
                      rounded-2xl
                      bg-[#f1e2d5]
                      text-[#c45a1a]
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <FolderOpen
                      size={23}
                    />

                  </div>

                  <h2
                    className="
                      text-lg
                      font-extrabold
                      text-[#35241b]
                      mt-4
                    "
                  >
                    {categoria.nome}
                  </h2>

                  <p
                    className="
                      text-xs
                      text-[#806b5e]
                      mt-1
                    "
                  >
                    Categoria ativa
                  </p>

                  <div
                    className="
                      grid
                      grid-cols-2
                      gap-2
                      mt-5
                    "
                  >

                    <button
                      type="button"
                      onClick={() =>
                        abrirEdicao(
                          categoria
                        )
                      }
                      className="
                        min-h-[44px]
                        rounded-xl
                        bg-[#f1e2d5]
                        text-[#70442d]
                        font-bold
                        flex
                        items-center
                        justify-center
                        gap-2
                      "
                    >

                      <Pencil size={16} />

                      Editar

                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        desativarCategoria(
                          categoria
                        )
                      }
                      className="
                        min-h-[44px]
                        rounded-xl
                        bg-[#f8e7e3]
                        text-[#a64732]
                        font-bold
                        flex
                        items-center
                        justify-center
                        gap-2
                      "
                    >

                      <Trash2 size={16} />

                      Desativar

                    </button>

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </div>

      {/* MODAL */}

      {modalAberto && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-black/60
            p-4
            flex
            items-center
            justify-center
          "
        >

          <div
            className="
              w-full
              max-w-[500px]
              bg-[#fffaf5]
              rounded-3xl
              shadow-2xl
              overflow-hidden
            "
          >

            <div
              className="
                p-5
                border-b
                border-[#e5d5ca]
                flex
                items-center
                justify-between
              "
            >

              <div>

                <p
                  className="
                    text-[10px]
                    uppercase
                    font-extrabold
                    tracking-wider
                    text-[#c45a1a]
                  "
                >
                  Categoria
                </p>

                <h2
                  className="
                    text-xl
                    font-extrabold
                    text-[#35241b]
                  "
                >
                  {categoriaEditando
                    ? "Editar categoria"
                    : "Nova categoria"}
                </h2>

              </div>

              <button
                type="button"
                onClick={fecharModal}
                className="
                  w-10
                  h-10
                  bg-[#f1e2d5]
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  text-[#70442d]
                "
              >

                <X size={20} />

              </button>

            </div>

            <form
              onSubmit={
                salvarCategoria
              }
              className="p-5"
            >

              <label
                className="
                  text-xs
                  font-bold
                  text-[#654f43]
                "
              >
                Nome da categoria
              </label>

              <input
                autoFocus
                value={nome}
                onChange={(event) =>
                  setNome(
                    event.target.value
                  )
                }
                placeholder="Ex: Marmitas"
                className="
                  w-full
                  h-[50px]
                  mt-2
                  px-4
                  bg-white
                  border
                  border-[#dfcabc]
                  rounded-xl
                  outline-none
                  focus:border-[#d86b24]
                "
              />

              <button
                type="submit"
                disabled={salvando}
                className="
                  w-full
                  min-h-[50px]
                  mt-5
                  bg-[#d86b24]
                  hover:bg-[#be5418]
                  disabled:opacity-60
                  text-white
                  rounded-xl
                  font-extrabold
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >

                {salvando ? (

                  <RefreshCw
                    size={18}
                    className="
                      animate-spin
                    "
                  />

                ) : (

                  <Save size={18} />

                )}

                {categoriaEditando
                  ? "Salvar alterações"
                  : "Criar categoria"}

              </button>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}