import {
  useContext,
  useEffect,
  useState
} from "react";

import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  CookingPot,
  MapPin,
  PackageCheck,
  ReceiptText,
  ShoppingBag,
  Truck,
  UtensilsCrossed
} from "lucide-react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../services/api";

import {
  AuthContext
} from "../context/AuthContext";

export default function Pedidos() {

  const navigate = useNavigate();

  const {
    usuario,
    token
  } = useContext(AuthContext);

  const [pedidos, setPedidos] =
    useState([]);

  const [carregando, setCarregando] =
    useState(true);

  const [pedidoAberto,
    setPedidoAberto] =
    useState(null);

  useEffect(() => {

    if (!usuario || !token) {

      navigate("/login", {
        replace: true
      });

      return;
    }

    carregarPedidos();

    /*
      Atualiza os pedidos
      automaticamente a cada 10 segundos.

      Assim, quando o administrador
      mudar o status, o cliente verá
      a atualização sem precisar
      recarregar a página.
    */

    const intervalo =
      setInterval(
        carregarPedidos,
        10000
      );

    return () =>
      clearInterval(intervalo);

  }, [usuario, token]);

  async function carregarPedidos() {

    try {

      const response =
        await api.get(
          "/pedidos/meus"
        );

      const lista =
        Array.isArray(response.data)
          ? response.data
          : response.data.pedidos || [];

      /*
        Mais recentes primeiro
      */

      lista.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );

      setPedidos(lista);

    } catch (error) {

      console.error(
        "Erro ao carregar pedidos:",
        error
      );

      if (
        error.response?.status !== 401
      ) {

        toast.error(
          "Não foi possível carregar seus pedidos."
        );

      }

    } finally {

      setCarregando(false);

    }
  }

  function formatarPreco(valor) {

    return Number(valor || 0)
      .toLocaleString(
        "pt-BR",
        {
          style: "currency",
          currency: "BRL"
        }
      );

  }

  function formatarData(data) {

    if (!data) {
      return "";
    }

    return new Date(data)
      .toLocaleString(
        "pt-BR",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }
      );

  }

  function idCurto(id) {

    if (!id) {
      return "";
    }

    return id
      .slice(-6)
      .toUpperCase();

  }

  const etapas = [
    {
      nome: "Recebido",
      curto: "Recebido",
      icone: ReceiptText
    },
    {
      nome: "Preparando",
      curto: "Preparo",
      icone: CookingPot
    },
    {
      nome: "Saiu para entrega",
      curto: "Entrega",
      icone: Truck
    },
    {
      nome: "Entregue",
      curto: "Entregue",
      icone: PackageCheck
    }
  ];

  function indiceStatus(status) {

    const indice =
      etapas.findIndex(
        (etapa) =>
          etapa.nome === status
      );

    return indice >= 0
      ? indice
      : 0;

  }

  function estiloStatus(status) {

    switch (status) {

      case "Recebido":
        return `
          bg-[#fff4d7]
          text-[#9a6812]
          border-[#efd28f]
        `;

      case "Preparando":
        return `
          bg-[#fff0e6]
          text-[#b6501a]
          border-[#efc09f]
        `;

      case "Saiu para entrega":
        return `
          bg-[#eaf2ff]
          text-[#386a9e]
          border-[#b9d1ea]
        `;

      case "Entregue":
        return `
          bg-[#e7f6eb]
          text-[#39734a]
          border-[#b6dbbf]
        `;

      default:
        return `
          bg-[#f3e7dd]
          text-[#654f43]
          border-[#dfcabc]
        `;
    }

  }

  if (carregando) {

    return (

      <div
        className="
          min-h-screen
          bg-[#f7f2ec]
          flex
          items-center
          justify-center
        "
      >

        <div className="text-center">

          <div
            className="
              w-14
              h-14
              bg-[#d86b24]
              text-white
              rounded-2xl
              flex
              items-center
              justify-center
              mx-auto
              animate-pulse
            "
          >
            <UtensilsCrossed
              size={26}
            />
          </div>

          <p
            className="
              mt-4
              text-sm
              font-bold
              text-[#806b5e]
            "
          >
            Carregando pedidos...
          </p>

        </div>

      </div>

    );

  }

  return (

    <div
      className="
        min-h-screen
        bg-[#f7f2ec]
      "
    >

      {/* HEADER */}

      <header
        className="
          relative
          overflow-hidden
          bg-gradient-to-br
          from-[#3b2416]
          via-[#5a3520]
          to-[#2a1810]
          text-white
          px-5
          pt-7
          pb-10
        "
      >

        <div
          className="
            absolute
            inset-0
            opacity-20
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
            max-w-4xl
            mx-auto
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
              <ShoppingBag size={22} />
            </div>

            <div>

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.2em]
                  text-[#edc5a5]
                "
              >
                Delivery da Alê
              </p>

              <h1
                className="
                  text-2xl
                  font-extrabold
                "
              >
                Meus Pedidos
              </h1>

            </div>

          </div>

          <p
            className="
              mt-4
              text-sm
              text-[#ead8ca]
            "
          >
            Acompanhe seus pedidos
            em tempo real.
          </p>

        </div>

      </header>

      {/* CONTEÚDO */}

      <main
        className="
          max-w-4xl
          mx-auto
          px-4
          py-5
        "
      >

        {pedidos.length === 0 ? (

          /* SEM PEDIDOS */

          <section
            className="
              bg-[#fffaf5]
              border
              border-[#eadbd0]
              rounded-3xl
              shadow-sm
              p-8
              text-center
            "
          >

            <div
              className="
                w-16
                h-16
                mx-auto
                bg-[#f3e2d4]
                text-[#c45a1a]
                rounded-full
                flex
                items-center
                justify-center
              "
            >
              <UtensilsCrossed
                size={29}
              />
            </div>

            <h2
              className="
                text-xl
                font-extrabold
                text-[#35241b]
                mt-4
              "
            >
              Nenhum pedido ainda
            </h2>

            <p
              className="
                text-sm
                text-[#806b5e]
                mt-2
              "
            >
              Quando você fizer um
              pedido, poderá acompanhar
              tudo por aqui.
            </p>

            <Link
              to="/"
              className="
                inline-flex
                mt-6
                bg-[#d86b24]
                text-white
                font-extrabold
                px-6
                py-3
                rounded-2xl
                shadow-md
              "
            >
              Ver cardápio
            </Link>

          </section>

        ) : (

          <div className="space-y-4">

            {pedidos.map((pedido) => {

              const etapaAtual =
                indiceStatus(
                  pedido.status
                );

              const aberto =
                pedidoAberto ===
                pedido._id;

              return (

                <article
                  key={pedido._id}
                  className="
                    bg-[#fffaf5]
                    border
                    border-[#eadbd0]
                    rounded-3xl
                    shadow-sm
                    overflow-hidden
                  "
                >

                  {/* CABEÇALHO PEDIDO */}

                  <div className="p-5">

                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                    >

                      <div>

                        <p
                          className="
                            text-[10px]
                            uppercase
                            tracking-wider
                            font-bold
                            text-[#c45a1a]
                          "
                        >
                          Pedido
                        </p>

                        <h2
                          className="
                            text-lg
                            font-extrabold
                            text-[#35241b]
                          "
                        >
                          #{idCurto(
                            pedido._id
                          )}
                        </h2>

                        <div
                          className="
                            flex
                            items-center
                            gap-1
                            mt-1
                            text-xs
                            text-[#8b7568]
                          "
                        >
                          <Clock3
                            size={13}
                          />

                          {formatarData(
                            pedido.createdAt
                          )}
                        </div>

                      </div>

                      <span
                        className={`
                          border
                          px-3
                          py-1.5
                          rounded-full
                          text-xs
                          font-extrabold
                          text-center
                          ${estiloStatus(
                            pedido.status
                          )}
                        `}
                      >
                        {pedido.status}
                      </span>

                    </div>

                    {/* TOTAL */}

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        mt-5
                        pt-4
                        border-t
                        border-[#eadbd0]
                      "
                    >

                      <span
                        className="
                          text-sm
                          text-[#806b5e]
                        "
                      >
                        Total
                      </span>

                      <strong
                        className="
                          text-xl
                          text-[#a74417]
                        "
                      >
                        {formatarPreco(
                          pedido.total
                        )}
                      </strong>

                    </div>

                  </div>

                  {/* ACOMPANHAMENTO */}

                  <div
                    className="
                      bg-[#fff7f0]
                      border-y
                      border-[#eadbd0]
                      px-4
                      py-5
                    "
                  >

                    <div
                      className="
                        flex
                        items-start
                      "
                    >

                      {etapas.map(
                        (
                          etapa,
                          indice
                        ) => {

                          const Icone =
                            etapa.icone;

                          const concluida =
                            indice <
                            etapaAtual;

                          const atual =
                            indice ===
                            etapaAtual;

                          const ativa =
                            indice <=
                            etapaAtual;

                          return (

                            <div
                              key={
                                etapa.nome
                              }
                              className="
                                flex
                                items-start
                                flex-1
                                last:flex-none
                              "
                            >

                              <div
                                className="
                                  flex
                                  flex-col
                                  items-center
                                  relative
                                "
                              >

                                <div
                                  className={`
                                    w-10
                                    h-10
                                    rounded-full
                                    flex
                                    items-center
                                    justify-center
                                    border-2
                                    transition-all
                                    duration-500
                                    ${
                                      concluida
                                        ? `
                                          bg-[#4f8a5b]
                                          border-[#4f8a5b]
                                          text-white
                                        `
                                        : atual
                                        ? `
                                          bg-[#d86b24]
                                          border-[#d86b24]
                                          text-white
                                          shadow-lg
                                          animate-pulse
                                        `
                                        : `
                                          bg-white
                                          border-[#ddc9bb]
                                          text-[#a48c7c]
                                        `
                                    }
                                  `}
                                >

                                  {concluida ? (
                                    <Check
                                      size={18}
                                      strokeWidth={3}
                                    />
                                  ) : (
                                    <Icone
                                      size={18}
                                    />
                                  )}

                                </div>

                                <span
                                  className={`
                                    text-[9px]
                                    sm:text-[11px]
                                    text-center
                                    font-bold
                                    mt-2
                                    max-w-[60px]
                                    ${
                                      ativa
                                        ? "text-[#65402c]"
                                        : "text-[#aa9588]"
                                    }
                                  `}
                                >
                                  {
                                    etapa.curto
                                  }
                                </span>

                              </div>

                              {indice <
                                etapas.length -
                                  1 && (

                                <div
                                  className="
                                    flex-1
                                    h-[3px]
                                    mt-[19px]
                                    mx-1
                                    bg-[#ddc9bb]
                                    overflow-hidden
                                    rounded-full
                                  "
                                >

                                  <div
                                    className={`
                                      h-full
                                      rounded-full
                                      transition-all
                                      duration-700
                                      ${
                                        indice <
                                        etapaAtual
                                          ? `
                                            w-full
                                            bg-[#4f8a5b]
                                          `
                                          : `
                                            w-0
                                            bg-[#4f8a5b]
                                          `
                                      }
                                    `}
                                  />

                                </div>

                              )}

                            </div>

                          );

                        }
                      )}

                    </div>

                    {pedido.status !==
                      "Entregue" && (

                      <p
                        className="
                          mt-4
                          text-center
                          text-[11px]
                          text-[#806b5e]
                        "
                      >
                        O status é atualizado
                        automaticamente.
                      </p>

                    )}

                  </div>

                  {/* DETALHES */}

                  <button
                    type="button"
                    onClick={() =>
                      setPedidoAberto(
                        aberto
                          ? null
                          : pedido._id
                      )
                    }
                    className="
                      w-full
                      p-4
                      flex
                      items-center
                      justify-center
                      gap-2
                      font-bold
                      text-sm
                      text-[#70442d]
                    "
                  >

                    {aberto
                      ? "Ocultar detalhes"
                      : "Ver detalhes"}

                    {aberto ? (
                      <ChevronUp
                        size={17}
                      />
                    ) : (
                      <ChevronDown
                        size={17}
                      />
                    )}

                  </button>

                  {aberto && (

                    <div
                      className="
                        px-5
                        pb-5
                      "
                    >

                      <div
                        className="
                          border-t
                          border-[#eadbd0]
                          pt-5
                        "
                      >

                        {/* ITENS */}

                        <h3
                          className="
                            font-extrabold
                            text-[#35241b]
                            mb-3
                          "
                        >
                          Itens
                        </h3>

                        <div className="space-y-2">

                          {pedido.itens?.map(
                            (item) => (

                              <div
                                key={
                                  item._id
                                }
                                className="
                                  flex
                                  justify-between
                                  gap-4
                                  text-sm
                                "
                              >

                                <span
                                  className="
                                    text-[#654f43]
                                  "
                                >
                                  {
                                    item.quantidade
                                  }
                                  {"x "}
                                  {item.nome}
                                </span>

                                <span
                                  className="
                                    font-bold
                                    text-[#453126]
                                  "
                                >
                                  {formatarPreco(
                                    item.subtotal
                                  )}
                                </span>

                              </div>

                            )
                          )}

                        </div>

                        {/* INFO */}

                        <div
                          className="
                            grid
                            sm:grid-cols-2
                            gap-3
                            mt-5
                          "
                        >

                          <div
                            className="
                              bg-[#f6ebe3]
                              rounded-2xl
                              p-4
                            "
                          >

                            <p
                              className="
                                text-[10px]
                                uppercase
                                font-bold
                                tracking-wider
                                text-[#9b7761]
                              "
                            >
                              Recebimento
                            </p>

                            <p
                              className="
                                font-bold
                                text-sm
                                text-[#453126]
                                mt-1
                                capitalize
                              "
                            >
                              {
                                pedido.tipoEntrega
                              }
                            </p>

                          </div>

                          <div
                            className="
                              bg-[#f6ebe3]
                              rounded-2xl
                              p-4
                            "
                          >

                            <p
                              className="
                                text-[10px]
                                uppercase
                                font-bold
                                tracking-wider
                                text-[#9b7761]
                              "
                            >
                              Pagamento
                            </p>

                            <p
                              className="
                                font-bold
                                text-sm
                                text-[#453126]
                                mt-1
                                capitalize
                              "
                            >
                              {
                                pedido.pagamento
                              }
                            </p>

                          </div>

                        </div>

                        {/* ENDEREÇO */}

                        {pedido.tipoEntrega ===
                          "entrega" &&
                          pedido.endereco && (

                          <div
                            className="
                              mt-4
                              bg-[#f6ebe3]
                              rounded-2xl
                              p-4
                            "
                          >

                            <div
                              className="
                                flex
                                items-start
                                gap-3
                              "
                            >

                              <MapPin
                                size={18}
                                className="
                                  text-[#c45a1a]
                                  mt-0.5
                                  shrink-0
                                "
                              />

                              <div>

                                <p
                                  className="
                                    font-extrabold
                                    text-[#453126]
                                    text-sm
                                  "
                                >
                                  {
                                    pedido.endereco
                                      .rua
                                  }
                                  ,{" "}
                                  {
                                    pedido.endereco
                                      .numero
                                  }
                                </p>

                                <p
                                  className="
                                    text-xs
                                    text-[#806b5e]
                                    mt-1
                                  "
                                >
                                  {
                                    pedido.endereco
                                      .bairro
                                  }
                                  {" • "}
                                  {
                                    pedido.endereco
                                      .cidade
                                  }
                                </p>

                                {pedido.endereco
                                  .referencia && (

                                  <p
                                    className="
                                      text-xs
                                      text-[#806b5e]
                                      mt-1
                                    "
                                  >
                                    Referência:{" "}
                                    {
                                      pedido.endereco
                                        .referencia
                                    }
                                  </p>

                                )}

                                {pedido.endereco
                                  .linkMaps && (

                                  <a
                                    href={
                                      pedido.endereco
                                        .linkMaps
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                      inline-flex
                                      mt-2
                                      text-xs
                                      font-extrabold
                                      text-[#c45a1a]
                                    "
                                  >
                                    Ver localização
                                  </a>

                                )}

                              </div>

                            </div>

                          </div>

                        )}

                        {/* OBSERVAÇÃO */}

                        {pedido.observacoes && (

                          <div
                            className="
                              mt-4
                              text-sm
                            "
                          >

                            <strong
                              className="
                                text-[#453126]
                              "
                            >
                              Observações:
                            </strong>

                            <p
                              className="
                                text-[#806b5e]
                                mt-1
                              "
                            >
                              {
                                pedido.observacoes
                              }
                            </p>

                          </div>

                        )}

                        {/* HISTÓRICO */}

                        {pedido
                          .historicoStatus
                          ?.length > 0 && (

                          <div className="mt-5">

                            <h3
                              className="
                                font-extrabold
                                text-[#35241b]
                                text-sm
                              "
                            >
                              Histórico
                            </h3>

                            <div
                              className="
                                mt-3
                                space-y-3
                              "
                            >

                              {pedido
                                .historicoStatus
                                .map(
                                  (
                                    historico
                                  ) => (

                                    <div
                                      key={
                                        historico._id
                                      }
                                      className="
                                        flex
                                        gap-3
                                        text-xs
                                      "
                                    >

                                      <div
                                        className="
                                          w-2
                                          h-2
                                          rounded-full
                                          bg-[#d86b24]
                                          mt-1.5
                                          shrink-0
                                        "
                                      />

                                      <div>

                                        <p
                                          className="
                                            font-bold
                                            text-[#59453a]
                                          "
                                        >
                                          {
                                            historico.status
                                          }
                                        </p>

                                        <p
                                          className="
                                            text-[#927d70]
                                          "
                                        >
                                          {formatarData(
                                            historico.data
                                          )}
                                        </p>

                                      </div>

                                    </div>

                                  )
                                )}

                            </div>

                          </div>

                        )}

                      </div>

                    </div>

                  )}

                </article>

              );

            })}

          </div>

        )}

      </main>

    </div>

  );
}