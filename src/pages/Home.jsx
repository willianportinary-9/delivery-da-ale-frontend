import {
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Clock3,
  CreditCard,
  MapPin,
  ShoppingBag,
  Truck,
  UtensilsCrossed
} from "lucide-react";

import toast from "react-hot-toast";

import api from "../services/api";
import { CartContext } from "../context/CartContext";

function Home() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [configuracoes, setConfiguracoes] =
  useState(null);

  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState("Todos");

  const { adicionarProduto } =
    useContext(CartContext);

 useEffect(() => {
  buscarProdutos();
  buscarConfiguracoes();

  const intervalo =
    setInterval(() => {
      buscarConfiguracoes();
    }, 30000);

  return () =>
    clearInterval(intervalo);
}, []);

  async function buscarProdutos() {
    try {
      setCarregando(true);

      const response =
        await api.get("/produtos");

      /*
        Funciona tanto se o backend retornar:

        [produto, produto...]

        quanto:

        {
          produtos: [...]
        }
      */

      const lista =
        Array.isArray(response.data)
          ? response.data
          : response.data.produtos || [];

      setProdutos(lista);
    } catch (error) {
      console.error(
        "Erro ao buscar produtos:",
        error
      );

      toast.error(
        "Não foi possível carregar o cardápio."
      );
    } finally {
      setCarregando(false);
    }
  }


async function buscarConfiguracoes() {

  try {

    const response =
      await api.get(
        "/configuracoes"
      );

    setConfiguracoes(
      response.data
    );

  } catch (error) {

    console.error(
      "Erro ao buscar configurações:",
      error
    );

  }

}


  function obterCategoria(produto) {
    if (!produto.categoria) {
      return "Outros";
    }

    if (
      typeof produto.categoria === "object"
    ) {
      return (
        produto.categoria.nome ||
        "Outros"
      );
    }

    return produto.categoria;
  }

  const categorias = useMemo(() => {
    return [
      "Todos",
      ...new Set(
        produtos.map((produto) =>
          obterCategoria(produto)
        )
      )
    ];
  }, [produtos]);

  const produtosFiltrados =
    categoriaSelecionada === "Todos"
      ? produtos
      : produtos.filter(
          (produto) =>
            obterCategoria(produto) ===
            categoriaSelecionada
        );

  function adicionar(produto) {

  if (
    configuracoes &&
    !configuracoes.lojaAberta
  ) {

    toast.error(
      "A loja está fechada no momento."
    );

    return;
  }

  adicionarProduto(produto);

  toast.success(
    `${produto.nome} adicionado ao carrinho`
  );
}

  return (
    <div className="min-h-screen bg-[#f7f2ec]">

      {/* CABEÇALHO */}

      <header
        className="
          relative
          overflow-hidden
          bg-gradient-to-br
          from-[#3b2416]
          via-[#5a3520]
          to-[#2a1810]
          text-white
        "
      >
        {/* textura simples de madeira */}

        <div
          className="
            absolute
            inset-0
            opacity-20
            pointer-events-none
          "
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                2deg,
                transparent 0px,
                transparent 18px,
                rgba(255,255,255,0.08) 19px,
                transparent 20px
              )
            `
          }}
        />

        <div
          className="
            relative
            max-w-7xl
            mx-auto
            px-5
            pt-7
            pb-8
          "
        >
          {/* topo */}

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  w-11
                  h-11
                  rounded-2xl
                  bg-[#d86b24]
                  flex
                  items-center
                  justify-center
                  shadow-lg
                "
              >
                <UtensilsCrossed
                  size={23}
                />
              </div>

              <div>
                <p
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.2em]
                    text-[#edc5a5]
                  "
                >
                  Comida caseira
                </p>

                <h1
                  className="
                    text-xl
                    sm:text-2xl
                    font-bold
                  "
                >
                  Delivery da Alê
                </h1>

{configuracoes && (

  <div
    className="
      flex
      items-center
      gap-2
      mt-2
    "
  >

    <span
      className={`
        w-2
        h-2
        rounded-full
        ${
          configuracoes.lojaAberta
            ? "bg-green-400"
            : "bg-red-400"
        }
      `}
    />

    <span
      className={`
        text-xs
        font-extrabold
        ${
          configuracoes.lojaAberta
            ? "text-green-300"
            : "text-red-300"
        }
      `}
    >
      {configuracoes.lojaAberta
        ? "Aberto agora"
        : "Fechado"}
    </span>

  </div>

)}


              </div>
            </div>

            <div
              className="
                w-10
                h-10
                rounded-full
                bg-white/10
                border
                border-white/10
                flex
                items-center
                justify-center
              "
            >
              <ShoppingBag
                size={20}
              />
            </div>
          </div>

          {/* chamada */}

          <div className="mt-8 max-w-xl">

            <span
              className="
                inline-block
                bg-[#d86b24]
                text-white
                text-xs
                font-bold
                px-3
                py-1.5
                rounded-full
              "
            >
              Sabor de comida feita em casa
            </span>

            <h2
              className="
                mt-4
                text-3xl
                sm:text-4xl
                font-extrabold
                leading-tight
              "
            >
              Seu almoço com sabor de casa.
            </h2>

            <p
              className="
                mt-3
                text-sm
                sm:text-base
                text-[#ead8ca]
                max-w-md
              "
            >
              Escolha seu prato, faça o
              pedido e acompanhe tudo pelo
              celular.
            </p>
          </div>
        </div>
      </header>

      {/* INFORMAÇÕES */}

      <section
        className="
          px-4
          -mt-4
          relative
          z-10
        "
      >
        <div
          className="
            max-w-6xl
            mx-auto
            bg-[#fffaf5]
            rounded-2xl
            border
            border-[#ead9cc]
            shadow-lg
            px-4
            py-4
          "
        >
          <div
            className="
              grid
              grid-cols-3
              gap-3
              text-center
            "
          >
            <div
              className="
                flex
                flex-col
                items-center
                gap-1
              "
            >
              <div
  className="
    flex
    flex-col
    items-center
    gap-1
  "
>

  <Clock3
    size={19}
    className="text-[#c45a1a]"
  />

  <span
    className="
      text-[11px]
      sm:text-sm
      font-semibold
      text-[#544238]
    "
  >
    {configuracoes
      ? `${configuracoes.horarioAbertura} às ${configuracoes.horarioFechamento}`
      : "--:--"}
  </span>

</div>
            </div>

            <div
              className="
                flex
                flex-col
                items-center
                gap-1
              "
            >
              <CreditCard
                size={19}
                className="text-[#c45a1a]"
              />

              <span
                className="
                  text-[11px]
                  sm:text-sm
                  font-semibold
                  text-[#544238]
                "
              >
                Pix ou dinheiro
              </span>
            </div>

            <div
              className="
                flex
                flex-col
                items-center
                gap-1
              "
            >
              <Truck
                size={19}
                className="text-[#c45a1a]"
              />

              <span
  className="
    text-[11px]
    sm:text-sm
    font-semibold
    text-[#544238]
  "
>
  {configuracoes
    ? `Entrega ${Number(
        configuracoes.taxaEntrega || 0
      ).toLocaleString(
        "pt-BR",
        {
          style: "currency",
          currency: "BRL"
        }
      )}`
    : "Entrega"}
</span>
            </div>
          </div>
        </div>
      </section>

      {configuracoes?.aviso && (

  <section
    className="
      max-w-6xl
      mx-auto
      px-4
      mt-5
    "
  >

    <div
      className="
        bg-[#fff3d6]
        border
        border-[#efd28f]
        rounded-2xl
        px-4
        py-3
        text-center
      "
    >

      <p
        className="
          text-sm
          font-bold
          text-[#805b18]
        "
      >
        {configuracoes.aviso}
      </p>

    </div>

  </section>

)} 

      {/* TÍTULO */}

      <section
        className="
          max-w-7xl
          mx-auto
          pt-7
          px-4
        "
      >
        <div
          className="
            flex
            items-end
            justify-between
            gap-4
          "
        >
          <div>
            <p
              className="
                text-[#c45a1a]
                uppercase
                tracking-wider
                text-xs
                font-bold
              "
            >
              Nosso cardápio
            </p>

            {configuracoes &&
  !configuracoes.lojaAberta && (

  <section
    className="
      max-w-6xl
      mx-auto
      px-4
      mt-5
    "
  >

    <div
      className="
        bg-[#fbe9e6]
        border
        border-[#e5b6ad]
        rounded-2xl
        p-4
        text-center
      "
    >

      <p
        className="
          font-extrabold
          text-[#a34332]
        "
      >
        A loja está fechada
      </p>

      <p
        className="
          text-xs
          text-[#875b51]
          mt-1
        "
      >
        Funcionamento:
        {" "}
        {configuracoes.horarioAbertura}
        {" às "}
        {configuracoes.horarioFechamento}
      </p>

    </div>

  </section>

)}

            <h2
              className="
                text-2xl
                font-extrabold
                text-[#38251b]
                mt-1
              "
            >
              O que vai querer hoje?
            </h2>
          </div>

          <MapPin
            className="
              text-[#845c45]
              hidden
              sm:block
            "
          />
        </div>
      </section>

      {/* CATEGORIAS */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          mt-5
        "
      >
        <div
          className="
            flex
            gap-2
            overflow-x-auto
            pb-2
            scrollbar-hide
          "
        >
          {categorias.map(
            (categoria) => {

              const ativa =
                categoriaSelecionada ===
                categoria;

              return (
                <button
                  key={categoria}
                  onClick={() =>
                    setCategoriaSelecionada(
                      categoria
                    )
                  }
                  className={`
                    whitespace-nowrap
                    px-5
                    py-2.5
                    rounded-full
                    text-sm
                    font-bold
                    transition-all
                    ${
                      ativa
                        ? `
                          bg-[#c45a1a]
                          text-white
                          shadow-md
                        `
                        : `
                          bg-[#fffaf5]
                          text-[#685247]
                          border
                          border-[#e2d2c6]
                        `
                    }
                  `}
                >
                  {categoria}
                </button>
              );
            }
          )}
        </div>
      </section>

      {/* PRODUTOS */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          pt-4
          pb-6
        "
      >
        {carregando ? (

          <div
            className="
              py-20
              text-center
              text-[#725d51]
            "
          >
            Carregando cardápio...
          </div>

        ) : produtosFiltrados.length === 0 ? (

          <div
            className="
              bg-white
              rounded-2xl
              p-8
              text-center
              border
              border-[#e8d9ce]
            "
          >
            <UtensilsCrossed
              size={30}
              className="
                mx-auto
                text-[#c45a1a]
              "
            />

            <p
              className="
                mt-3
                font-bold
                text-[#453126]
              "
            >
              Nenhum produto encontrado.
            </p>
          </div>

        ) : (

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
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
                    border-[#eadbd0]
                    rounded-3xl
                    overflow-hidden
                    shadow-sm
                    hover:shadow-lg
                    transition-all
                    duration-200
                  "
                >
                  <div
                    className="
                      flex
                      min-h-[150px]
                    "
                  >
                    {/* imagem */}

                    <div
                      className="
                        w-[130px]
                        sm:w-[160px]
                        shrink-0
                        bg-[#e8d7ca]
                      "
                    >
                      {produto.imagem ? (
                        <img
                          src={
                            produto.imagem
                          }
                          alt={
                            produto.nome
                          }
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
                            min-h-[150px]
                            flex
                            flex-col
                            items-center
                            justify-center
                            text-[#9b7861]
                          "
                        >
                          <UtensilsCrossed
                            size={30}
                          />

                          <span
                            className="
                              mt-2
                              text-[10px]
                              font-semibold
                            "
                          >
                            Delivery da Alê
                          </span>
                        </div>
                      )}
                    </div>

                    {/* conteúdo */}

                    <div
                      className="
                        flex-1
                        p-4
                        flex
                        flex-col
                      "
                    >
                      <span
                        className="
                          text-[10px]
                          uppercase
                          tracking-wider
                          font-bold
                          text-[#c45a1a]
                        "
                      >
                        {obterCategoria(
                          produto
                        )}
                      </span>

                      <h3
                        className="
                          font-extrabold
                          text-[#35241b]
                          text-base
                          sm:text-lg
                          mt-1
                        "
                      >
                        {produto.nome}
                      </h3>

                      <p
                        className="
                          text-xs
                          sm:text-sm
                          text-[#78665c]
                          mt-1
                          line-clamp-2
                        "
                      >
                        {produto.descricao ||
                          "Comida caseira preparada com carinho."}
                      </p>

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                          mt-auto
                          pt-4
                        "
                      >
                        <strong
                          className="
                            text-[#a74417]
                            text-base
                            sm:text-lg
                          "
                        >
                          {Number(
                            produto.preco
                          ).toLocaleString(
                            "pt-BR",
                            {
                              style:
                                "currency",
                              currency:
                                "BRL"
                            }
                          )}
                        </strong>

                        <button
                          onClick={() =>
                            adicionar(
                              produto
                            )
                          }
                          className="
                            w-10
                            h-10
                            rounded-full
                            bg-[#d86b24]
                            hover:bg-[#be5418]
                            active:scale-90
                            text-white
                            text-2xl
                            font-bold
                            flex
                            items-center
                            justify-center
                            transition
                            shadow-md
                          "
                          aria-label={`Adicionar ${produto.nome}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </article>

              )
            )}
          </div>
        )}
      </section>

    </div>
  );
}

export default Home;