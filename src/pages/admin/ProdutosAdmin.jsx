import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  ImagePlus,
  PackageOpen,
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

export default function ProdutosAdmin() {

  const [produtos, setProdutos] =
    useState([]);

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

  const [produtoEditando, setProdutoEditando] =
    useState(null);

  const [nome, setNome] =
    useState("");

  const [descricao, setDescricao] =
    useState("");

  const [preco, setPreco] =
    useState("");

  const [categoria, setCategoria] =
    useState("");

  const [imagem, setImagem] =
    useState(null);

  const [previewImagem, setPreviewImagem] =
    useState("");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados(
    mostrarLoading = true
  ) {

    try {

      if (mostrarLoading) {
        setCarregando(true);
      } else {
        setAtualizando(true);
      }

      const [
        responseProdutos,
        responseCategorias
      ] = await Promise.all([
        api.get("/produtos"),
        api.get("/categorias")
      ]);

      const listaProdutos =
        Array.isArray(responseProdutos.data)
          ? responseProdutos.data
          : responseProdutos.data.produtos || [];

      const listaCategorias =
        Array.isArray(responseCategorias.data)
          ? responseCategorias.data
          : responseCategorias.data.categorias || [];

      setProdutos(listaProdutos);
      setCategorias(listaCategorias);

    } catch (error) {

      console.error(
        "Erro ao carregar dados:",
        error
      );

      toast.error(
        error.response?.data?.mensagem ||
        "Não foi possível carregar os dados."
      );

    } finally {

      setCarregando(false);
      setAtualizando(false);

    }

  }

  function dinheiro(valor) {

    return Number(valor || 0)
      .toLocaleString(
        "pt-BR",
        {
          style: "currency",
          currency: "BRL"
        }
      );

  }

  function limparFormulario() {

    setNome("");
    setDescricao("");
    setPreco("");
    setCategoria("");
    setImagem(null);
    setPreviewImagem("");
    setProdutoEditando(null);

  }

  function abrirNovoProduto() {

    limparFormulario();

    setModalAberto(true);

  }

  function abrirEdicao(produto) {

    setProdutoEditando(produto);

    setNome(
      produto.nome || ""
    );

    setDescricao(
      produto.descricao || ""
    );

    setPreco(
      produto.preco != null
        ? String(produto.preco)
        : ""
    );

    setCategoria(
      produto.categoria?._id ||
      produto.categoria ||
      ""
    );

    setImagem(null);

    setPreviewImagem(
      produto.imagem || ""
    );

    setModalAberto(true);

  }

  function fecharModal() {

    if (salvando) {
      return;
    }

    setModalAberto(false);

    limparFormulario();

  }

  function selecionarImagem(event) {

    const arquivo =
      event.target.files?.[0];

    if (!arquivo) {
      return;
    }

    setImagem(arquivo);

    const preview =
      URL.createObjectURL(arquivo);

    setPreviewImagem(preview);

  }

  async function salvarProduto(event) {

    event.preventDefault();

    if (!nome.trim()) {

      toast.error(
        "Informe o nome do produto."
      );

      return;

    }

    if (!preco) {

      toast.error(
        "Informe o preço."
      );

      return;

    }

    if (!categoria) {

      toast.error(
        "Selecione uma categoria."
      );

      return;

    }

    try {

      setSalvando(true);

      const formData =
        new FormData();

      formData.append(
        "nome",
        nome.trim()
      );

      formData.append(
        "descricao",
        descricao.trim()
      );

      formData.append(
        "preco",
        String(preco)
          .replace(",", ".")
      );

      formData.append(
        "categoria",
        categoria
      );

      if (imagem) {

        formData.append(
          "imagem",
          imagem
        );

      }

      if (produtoEditando) {

        await api.put(
          `/produtos/${produtoEditando._id}`,
          formData
        );

        toast.success(
          "Produto atualizado com sucesso."
        );

      } else {

        await api.post(
          "/produtos",
          formData
        );

        toast.success(
          "Produto cadastrado com sucesso."
        );

      }

      fecharModal();

      await carregarDados(false);

    } catch (error) {

      console.error(
        "Erro ao salvar produto:",
        error
      );

      toast.error(
        error.response?.data?.mensagem ||
        "Não foi possível salvar o produto."
      );

    } finally {

      setSalvando(false);

    }

  }

  async function desativarProduto(produto) {

    const resultado =
      await Swal.fire({

        title: "Desativar produto?",

        html: `
          O produto
          <strong>${produto.nome}</strong>
          será removido do cardápio.
          <br><br>
          Ele não será apagado definitivamente
          do banco de dados.
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
        `/produtos/${produto._id}`
      );

      toast.success(
        "Produto desativado."
      );

      await carregarDados(false);

    } catch (error) {

      console.error(
        "Erro ao desativar produto:",
        error
      );

      toast.error(
        error.response?.data?.mensagem ||
        "Não foi possível desativar o produto."
      );

    }

  }

  const produtosFiltrados =
    useMemo(() => {

      const termo =
        busca
          .trim()
          .toLowerCase();

      if (!termo) {
        return produtos;
      }

      return produtos.filter(
        (produto) => {

          const nomeProduto =
            produto.nome
              ?.toLowerCase() || "";

          const descricaoProduto =
            produto.descricao
              ?.toLowerCase() || "";

          const categoriaProduto =
            produto.categoria?.nome
              ?.toLowerCase() || "";

          return (
            nomeProduto.includes(termo) ||
            descricaoProduto.includes(termo) ||
            categoriaProduto.includes(termo)
          );

        }
      );

    }, [
      produtos,
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
            Carregando produtos...
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
          max-w-[1500px]
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
              Produtos
            </h1>

            <p
              className="
                text-sm
                text-[#806b5e]
                mt-1
              "
            >
              Gerencie o cardápio do
              Delivery da Alê.
            </p>

          </div>

          <div
            className="
              flex
              gap-2
            "
          >

            <button
              type="button"
              onClick={() =>
                carregarDados(false)
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
                text-sm
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

              <span
                className="
                  hidden
                  sm:inline
                "
              >
                Atualizar
              </span>

            </button>

            <button
              type="button"
              onClick={abrirNovoProduto}
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
                transition
              "
            >

              <Plus size={18} />

              Novo produto

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
            shadow-sm
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
              placeholder="Buscar produto ou categoria..."
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
          {produtosFiltrados.length}
          {" "}
          {produtosFiltrados.length === 1
            ? "produto encontrado"
            : "produtos encontrados"}
        </p>

        {/* PRODUTOS */}

        {produtosFiltrados.length === 0 ? (

          <section
            className="
              bg-[#fffaf5]
              border
              border-[#e5d5ca]
              rounded-3xl
              p-10
              text-center
            "
          >

            <PackageOpen
              size={34}
              className="
                mx-auto
                text-[#c45a1a]
              "
            />

            <h2
              className="
                text-lg
                font-extrabold
                text-[#35241b]
                mt-3
              "
            >
              Nenhum produto encontrado
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

            {produtosFiltrados.map(
              (produto) => (

                <article
                  key={produto._id}
                  className="
                    bg-[#fffaf5]
                    border
                    border-[#e5d5ca]
                    rounded-3xl
                    overflow-hidden
                    shadow-sm
                  "
                >

                  <div
                    className="
                      h-[180px]
                      bg-[#f1e2d5]
                      overflow-hidden
                    "
                  >

                    {produto.imagem ? (

                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        className="
                          w-full
                          h-full
                          object-cover
                        "
                      />

                    ) : (

                      <div
                        className="
                          w-full
                          h-full
                          flex
                          items-center
                          justify-center
                          text-[#b68b70]
                        "
                      >

                        <PackageOpen
                          size={42}
                        />

                      </div>

                    )}

                  </div>

                  <div className="p-5">

                    <p
                      className="
                        text-[10px]
                        uppercase
                        tracking-wider
                        font-bold
                        text-[#c45a1a]
                      "
                    >
                      {produto.categoria?.nome ||
                        "Sem categoria"}
                    </p>

                    <h2
                      className="
                        text-lg
                        font-extrabold
                        text-[#35241b]
                        mt-1
                      "
                    >
                      {produto.nome}
                    </h2>

                    {produto.descricao && (

                      <p
                        className="
                          text-sm
                          text-[#806b5e]
                          mt-2
                          line-clamp-2
                        "
                      >
                        {produto.descricao}
                      </p>

                    )}

                    <p
                      className="
                        text-xl
                        font-extrabold
                        text-[#a74417]
                        mt-4
                      "
                    >
                      {dinheiro(
                        produto.preco
                      )}
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
                          abrirEdicao(produto)
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
                          desativarProduto(
                            produto
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
            overflow-y-auto
          "
        >

          <div
            className="
              w-full
              max-w-[620px]
              bg-[#fffaf5]
              rounded-3xl
              shadow-2xl
              max-h-[94vh]
              overflow-y-auto
            "
          >

            {/* TOPO MODAL */}

            <div
              className="
                sticky
                top-0
                z-10
                bg-[#fffaf5]
                border-b
                border-[#e5d5ca]
                p-5
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
                    tracking-wider
                    font-extrabold
                    text-[#c45a1a]
                  "
                >
                  Produto
                </p>

                <h2
                  className="
                    text-xl
                    font-extrabold
                    text-[#35241b]
                  "
                >
                  {produtoEditando
                    ? "Editar produto"
                    : "Novo produto"}
                </h2>

              </div>

              <button
                type="button"
                onClick={fecharModal}
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-[#f1e2d5]
                  text-[#70442d]
                  flex
                  items-center
                  justify-center
                "
              >

                <X size={20} />

              </button>

            </div>

            <form
              onSubmit={salvarProduto}
              className="p-5"
            >

              {/* IMAGEM */}

              <label
                className="
                  block
                  cursor-pointer
                "
              >

                <div
                  className="
                    h-[220px]
                    rounded-2xl
                    overflow-hidden
                    bg-[#f1e2d5]
                    border
                    border-dashed
                    border-[#d3b7a4]
                    flex
                    items-center
                    justify-center
                  "
                >

                  {previewImagem ? (

                    <img
                      src={previewImagem}
                      alt="Prévia"
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />

                  ) : (

                    <div
                      className="
                        text-center
                        text-[#9a755e]
                      "
                    >

                      <ImagePlus
                        size={34}
                        className="mx-auto"
                      />

                      <p
                        className="
                          mt-2
                          text-sm
                          font-bold
                        "
                      >
                        Selecionar imagem
                      </p>

                      <p
                        className="
                          text-xs
                          mt-1
                        "
                      >
                        JPG, PNG ou WEBP
                      </p>

                    </div>

                  )}

                </div>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={
                    selecionarImagem
                  }
                  className="hidden"
                />

              </label>

              {/* NOME */}

              <div className="mt-5">

                <label
                  className="
                    text-xs
                    font-bold
                    text-[#654f43]
                  "
                >
                  Nome do produto
                </label>

                <input
                  value={nome}
                  onChange={(event) =>
                    setNome(
                      event.target.value
                    )
                  }
                  placeholder="Ex: Marmita Grande"
                  className="
                    w-full
                    h-[48px]
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

              </div>

              {/* DESCRIÇÃO */}

              <div className="mt-4">

                <label
                  className="
                    text-xs
                    font-bold
                    text-[#654f43]
                  "
                >
                  Descrição
                </label>

                <textarea
                  value={descricao}
                  onChange={(event) =>
                    setDescricao(
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Descrição do produto..."
                  className="
                    w-full
                    mt-2
                    p-4
                    bg-white
                    border
                    border-[#dfcabc]
                    rounded-xl
                    outline-none
                    resize-none
                    focus:border-[#d86b24]
                  "
                />

              </div>

              <div
                className="
                  grid
                  sm:grid-cols-2
                  gap-4
                  mt-4
                "
              >

                {/* PREÇO */}

                <div>

                  <label
                    className="
                      text-xs
                      font-bold
                      text-[#654f43]
                    "
                  >
                    Preço
                  </label>

                  <input
                    value={preco}
                    onChange={(event) =>
                      setPreco(
                        event.target.value
                      )
                    }
                    inputMode="decimal"
                    placeholder="25,00"
                    className="
                      w-full
                      h-[48px]
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

                </div>

                {/* CATEGORIA */}

                <div>

                  <label
                    className="
                      text-xs
                      font-bold
                      text-[#654f43]
                    "
                  >
                    Categoria
                  </label>

                  <select
                    value={categoria}
                    onChange={(event) =>
                      setCategoria(
                        event.target.value
                      )
                    }
                    className="
                      w-full
                      h-[48px]
                      mt-2
                      px-4
                      bg-white
                      border
                      border-[#dfcabc]
                      rounded-xl
                      outline-none
                      focus:border-[#d86b24]
                    "
                  >

                    <option value="">
                      Selecione
                    </option>

                    {categorias.map(
                      (item) => (

                        <option
                          key={item._id}
                          value={item._id}
                        >
                          {item.nome}
                        </option>

                      )
                    )}

                  </select>

                </div>

              </div>

              {/* SALVAR */}

              <button
                type="submit"
                disabled={salvando}
                className="
                  w-full
                  min-h-[50px]
                  mt-6
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
                  transition
                "
              >

                {salvando ? (

                  <RefreshCw
                    size={18}
                    className="animate-spin"
                  />

                ) : (

                  <Save size={18} />

                )}

                {salvando
                  ? "Salvando..."
                  : produtoEditando
                    ? "Salvar alterações"
                    : "Cadastrar produto"}

              </button>

            </form>

          </div>

        </div>

      )}

    </div>

  );

}