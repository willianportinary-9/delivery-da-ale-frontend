import {
  useEffect,
  useState
} from "react";

import {
  Banknote,
  CheckCircle2,
  Clock3,
  CookingPot,
  Package,
  PackageCheck,
  ReceiptText,
  RefreshCw,
  ShoppingBag,
  Tags,
  Truck,
  UserRound,
  Users
} from "lucide-react";

import toast from "react-hot-toast";

import api from "../../services/api";

export default function Dashboard() {

  const [
    dados,
    setDados
  ] = useState(null);

  const [
    carregando,
    setCarregando
  ] = useState(true);

  const [
    atualizando,
    setAtualizando
  ] = useState(false);

  // ===================================================
  // CARREGAMENTO
  // ===================================================

  useEffect(() => {

    carregarDashboard();

    /*
      Atualiza automaticamente
      a cada 15 segundos.
    */

    const intervalo =
      setInterval(
        () =>
          carregarDashboard(
            false
          ),
        15000
      );

    return () =>
      clearInterval(
        intervalo
      );

  }, []);

  // ===================================================
  // BUSCAR DASHBOARD
  // ===================================================

  async function carregarDashboard(
    mostrarLoading = true
  ) {

    try {

      if (mostrarLoading) {

        setCarregando(true);

      } else {

        setAtualizando(true);

      }

      const response =
        await api.get(
          "/dashboard"
        );

      setDados(
        response.data
      );

    } catch (error) {

      console.error(
        "Erro no dashboard:",
        error
      );

      toast.error(
        error.response?.data
          ?.mensagem ||
        "Não foi possível carregar o dashboard."
      );

    } finally {

      setCarregando(false);

      setAtualizando(false);

    }

  }

  // ===================================================
  // FORMATADORES
  // ===================================================

  function dinheiro(valor) {

    return Number(
      valor || 0
    ).toLocaleString(
      "pt-BR",
      {
        style:
          "currency",

        currency:
          "BRL"
      }
    );

  }

  function dataHora(valor) {

    if (!valor) {
      return "";
    }

    return new Date(
      valor
    ).toLocaleString(
      "pt-BR",
      {
        day:
          "2-digit",

        month:
          "2-digit",

        hour:
          "2-digit",

        minute:
          "2-digit"
      }
    );

  }

  function idCurto(id) {

    return id
      ? id
          .slice(-6)
          .toUpperCase()
      : "";

  }

  // ===================================================
  // STATUS
  // ===================================================

  function classeStatus(status) {

    switch (status) {

      case "Recebido":

        return `
          bg-[#fff4d7]
          text-[#9a6812]
        `;

      case "Preparando":

        return `
          bg-[#fff0e6]
          text-[#b6501a]
        `;

      case "Saiu para entrega":

        return `
          bg-[#eaf2ff]
          text-[#386a9e]
        `;

      case "Entregue":

        return `
          bg-[#e7f6eb]
          text-[#39734a]
        `;

      default:

        return `
          bg-[#f2e8e0]
          text-[#654f43]
        `;

    }

  }

  // ===================================================
  // LOADING
  // ===================================================

  if (carregando) {

    return (

      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
        "
      >

        <div
          className="
            text-center
          "
        >

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
              text-sm
              font-bold
              text-[#806b5e]
            "
          >
            Carregando painel...
          </p>

        </div>

      </div>

    );

  }

  if (!dados) {

    return null;

  }

  // ===================================================
  // CARDS PRINCIPAIS
  // ===================================================

  const cardsPrincipais = [

    {
      titulo:
        "Pedidos hoje",

      valor:
        dados.pedidosHoje ||
        0,

      icone:
        ReceiptText,

      tipo:
        "numero"
    },

    {
      titulo:
        "Total de pedidos",

      valor:
        dados.totalPedidos ||
        0,

      icone:
        ShoppingBag,

      tipo:
        "numero"
    },

    {
      titulo:
        "Vendido hoje",

      valor:
        dados.totalVendidoHoje ||
        0,

      icone:
        Banknote,

      tipo:
        "dinheiro"
    },

    {
      titulo:
        "Faturamento total",

      valor:
        dados.totalVendido ||
        0,

      icone:
        Banknote,

      tipo:
        "dinheiro"
    },

    {
      titulo:
        "Ticket médio",

      valor:
        dados.ticketMedio ||
        0,

      icone:
        ReceiptText,

      tipo:
        "dinheiro"
    }

  ];

  // ===================================================
  // STATUS
  // ===================================================

  const cardsStatus = [

    {
      titulo:
        "Recebidos",

      valor:
        dados.status
          ?.recebidos || 0,

      icone:
        Clock3,

      classe:
        "bg-[#fff4d7] text-[#9a6812]"
    },

    {
      titulo:
        "Preparando",

      valor:
        dados.status
          ?.preparando || 0,

      icone:
        CookingPot,

      classe:
        "bg-[#fff0e6] text-[#b6501a]"
    },

    {
      titulo:
        "Em entrega",

      valor:
        dados.status
          ?.saiuParaEntrega ||
        0,

      icone:
        Truck,

      classe:
        "bg-[#eaf2ff] text-[#386a9e]"
    },

    {
      titulo:
        "Entregues",

      valor:
        dados.status
          ?.entregues || 0,

      icone:
        PackageCheck,

      classe:
        "bg-[#e7f6eb] text-[#39734a]"
    }

  ];

  // ===================================================
  // CADASTROS
  // ===================================================

  const cardsCadastros = [

    {
      titulo:
        "Clientes",

      valor:
        dados.clientes || 0,

      icone:
        Users
    },

    {
      titulo:
        "Produtos ativos",

      valor:
        dados.produtosAtivos ||
        0,

      icone:
        Package
    },

    {
      titulo:
        "Categorias",

      valor:
        dados.categoriasAtivas ||
        0,

      icone:
        Tags
    }

  ];

  // ===================================================
  // TELA
  // ===================================================

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

        {/* ======================================= */}
        {/* CABEÇALHO */}
        {/* ======================================= */}

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
              Visão geral
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
              Dashboard
            </h1>

            <p
              className="
                text-sm
                text-[#806b5e]
                mt-1
              "
            >
              Acompanhe o movimento
              do Delivery da Alê.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              carregarDashboard(
                false
              )
            }
            disabled={
              atualizando
            }
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
              hover:bg-[#fff2e8]
              disabled:opacity-60
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

            Atualizar

          </button>

        </div>

        {/* ======================================= */}
        {/* VISÃO FINANCEIRA */}
        {/* ======================================= */}

        <section
          className="
            mt-7
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              mb-3
            "
          >

            <div>

              <h2
                className="
                  text-lg
                  font-extrabold
                  text-[#35241b]
                "
              >
                Visão geral
              </h2>

              <p
                className="
                  text-xs
                  text-[#8b7568]
                  mt-0.5
                "
              >
                Principais números da loja.
              </p>

            </div>

          </div>

          <div
            className="
              grid
              grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-5
              gap-3
              sm:gap-4
            "
          >

            {cardsPrincipais.map(
              (card) => {

                const Icone =
                  card.icone;

                return (

                  <article
                    key={
                      card.titulo
                    }
                    className="
                      bg-[#fffaf5]
                      border
                      border-[#e5d5ca]
                      rounded-2xl
                      sm:rounded-3xl
                      p-4
                      sm:p-5
                      shadow-sm
                    "
                  >

                    <div
                      className="
                        w-10
                        h-10
                        bg-[#f3e2d4]
                        text-[#c45a1a]
                        rounded-xl
                        flex
                        items-center
                        justify-center
                      "
                    >

                      <Icone
                        size={19}
                      />

                    </div>

                    <p
                      className="
                        text-xs
                        sm:text-sm
                        text-[#806b5e]
                        mt-4
                      "
                    >
                      {card.titulo}
                    </p>

                    <strong
                      className="
                        block
                        text-xl
                        sm:text-2xl
                        text-[#35241b]
                        mt-1
                        break-words
                      "
                    >

                      {card.tipo ===
                      "dinheiro"

                        ? dinheiro(
                            card.valor
                          )

                        : card.valor}

                    </strong>

                  </article>

                );

              }
            )}

          </div>

        </section>

        {/* ======================================= */}
        {/* FATURAMENTO HOJE */}
        {/* ======================================= */}

        <section
          className="
            mt-4
            bg-gradient-to-r
            from-[#3b2416]
            via-[#4b2c1b]
            to-[#5a3520]
            text-white
            rounded-3xl
            p-5
            sm:p-6
            shadow-lg
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-4
          "
        >

          <div
            className="
              flex
              items-center
              gap-4
            "
          >

            <div
              className="
                w-12
                h-12
                bg-[#d86b24]
                rounded-2xl
                flex
                items-center
                justify-center
                shrink-0
              "
            >

              <Banknote
                size={24}
              />

            </div>

            <div>

              <p
                className="
                  text-sm
                  text-[#ddc9bc]
                "
              >
                Total vendido hoje
              </p>

              <strong
                className="
                  text-2xl
                  sm:text-3xl
                "
              >
                {dinheiro(
                  dados
                    .totalVendidoHoje
                )}
              </strong>

            </div>

          </div>

          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              text-[#ddc9bc]
            "
          >

            <CheckCircle2
              size={16}
            />

            Considerando pedidos
            entregues

          </div>

        </section>

        {/* ======================================= */}
        {/* STATUS DOS PEDIDOS */}
        {/* ======================================= */}

        <section
          className="
            mt-7
          "
        >

          <h2
            className="
              text-lg
              font-extrabold
              text-[#35241b]
            "
          >
            Pedidos em operação
          </h2>

          <p
            className="
              text-xs
              text-[#8b7568]
              mt-1
            "
          >
            Pedidos arquivados não aparecem
            nestes números.
          </p>

          <div
            className="
              grid
              grid-cols-2
              xl:grid-cols-4
              gap-3
              sm:gap-4
              mt-3
            "
          >

            {cardsStatus.map(
              (card) => {

                const Icone =
                  card.icone;

                return (

                  <article
                    key={
                      card.titulo
                    }
                    className="
                      bg-[#fffaf5]
                      border
                      border-[#e5d5ca]
                      rounded-2xl
                      p-4
                      shadow-sm
                      flex
                      items-center
                      gap-4
                    "
                  >

                    <div
                      className={`
                        w-11
                        h-11
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        shrink-0

                        ${card.classe}
                      `}
                    >

                      <Icone
                        size={20}
                      />

                    </div>

                    <div>

                      <p
                        className="
                          text-xs
                          text-[#806b5e]
                        "
                      >
                        {card.titulo}
                      </p>

                      <strong
                        className="
                          block
                          text-2xl
                          text-[#35241b]
                          mt-0.5
                        "
                      >
                        {card.valor}
                      </strong>

                    </div>

                  </article>

                );

              }
            )}

          </div>

        </section>

        {/* ======================================= */}
        {/* CADASTROS */}
        {/* ======================================= */}

        <section
          className="
            mt-7
          "
        >

          <h2
            className="
              text-lg
              font-extrabold
              text-[#35241b]
            "
          >
            Cadastros
          </h2>

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-3
              gap-3
              sm:gap-4
              mt-3
            "
          >

            {cardsCadastros.map(
              (card) => {

                const Icone =
                  card.icone;

                return (

                  <article
                    key={
                      card.titulo
                    }
                    className="
                      bg-[#fffaf5]
                      border
                      border-[#e5d5ca]
                      rounded-2xl
                      p-4
                      shadow-sm
                      flex
                      items-center
                      gap-4
                    "
                  >

                    <div
                      className="
                        w-11
                        h-11
                        rounded-xl
                        bg-[#f3e2d4]
                        text-[#c45a1a]
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >

                      <Icone
                        size={20}
                      />

                    </div>

                    <div>

                      <p
                        className="
                          text-xs
                          text-[#806b5e]
                        "
                      >
                        {card.titulo}
                      </p>

                      <strong
                        className="
                          block
                          text-2xl
                          text-[#35241b]
                          mt-0.5
                        "
                      >
                        {card.valor}
                      </strong>

                    </div>

                  </article>

                );

              }
            )}

          </div>

        </section>

        {/* ======================================= */}
        {/* PEDIDOS RECENTES */}
        {/* ======================================= */}

        <section
          className="
            bg-[#fffaf5]
            border
            border-[#e5d5ca]
            rounded-3xl
            shadow-sm
            mt-7
            overflow-hidden
          "
        >

          <div
            className="
              p-5
              sm:p-6
              border-b
              border-[#eadbd0]
            "
          >

            <h2
              className="
                text-xl
                font-extrabold
                text-[#35241b]
              "
            >
              Pedidos recentes
            </h2>

            <p
              className="
                text-sm
                text-[#806b5e]
                mt-1
              "
            >
              Últimos pedidos ativos
              realizados.
            </p>

          </div>

          {!dados.pedidosRecentes ||
          dados.pedidosRecentes
            .length === 0 ? (

            <div
              className="
                p-10
                text-center
                text-[#806b5e]
              "
            >

              <ShoppingBag
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
                "
              >
                Nenhum pedido encontrado.
              </p>

            </div>

          ) : (

            <>

              {/* ============================= */}
              {/* DESKTOP */}
              {/* ============================= */}

              <div
                className="
                  hidden
                  md:block
                  overflow-x-auto
                "
              >

                <table
                  className="
                    w-full
                  "
                >

                  <thead
                    className="
                      bg-[#f6ebe3]
                      text-[#654f43]
                      text-xs
                      uppercase
                    "
                  >

                    <tr>

                      <th
                        className="
                          p-4
                          text-left
                        "
                      >
                        Pedido
                      </th>

                      <th
                        className="
                          p-4
                          text-left
                        "
                      >
                        Cliente
                      </th>

                      <th
                        className="
                          p-4
                          text-left
                        "
                      >
                        Data
                      </th>

                      <th
                        className="
                          p-4
                          text-left
                        "
                      >
                        Total
                      </th>

                      <th
                        className="
                          p-4
                          text-left
                        "
                      >
                        Status
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {dados
                      .pedidosRecentes
                      .map(
                        (pedido) => (

                        <tr
                          key={
                            pedido._id
                          }
                          className="
                            border-t
                            border-[#f0e3da]
                            hover:bg-[#fff7f0]
                          "
                        >

                          <td
                            className="
                              p-4
                              font-extrabold
                              text-[#453126]
                            "
                          >
                            #
                            {idCurto(
                              pedido._id
                            )}
                          </td>

                          <td
                            className="
                              p-4
                            "
                          >

                            <div
                              className="
                                flex
                                items-center
                                gap-2
                              "
                            >

                              <UserRound
                                size={17}
                                className="
                                  text-[#c45a1a]
                                "
                              />

                              <span
                                className="
                                  font-semibold
                                  text-[#59453a]
                                "
                              >
                                {pedido
                                  .usuario
                                  ?.nome ||
                                  "Cliente"}
                              </span>

                            </div>

                          </td>

                          <td
                            className="
                              p-4
                              text-sm
                              text-[#806b5e]
                            "
                          >
                            {dataHora(
                              pedido
                                .createdAt
                            )}
                          </td>

                          <td
                            className="
                              p-4
                              font-extrabold
                              text-[#a74417]
                            "
                          >
                            {dinheiro(
                              pedido.total
                            )}
                          </td>

                          <td
                            className="
                              p-4
                            "
                          >

                            <span
                              className={`
                                inline-block
                                px-3
                                py-1.5
                                rounded-full
                                text-xs
                                font-extrabold

                                ${classeStatus(
                                  pedido
                                    .status
                                )}
                              `}
                            >
                              {pedido.status}
                            </span>

                          </td>

                        </tr>

                      ))
                    }

                  </tbody>

                </table>

              </div>

              {/* ============================= */}
              {/* MOBILE */}
              {/* ============================= */}

              <div
                className="
                  md:hidden
                  divide-y
                  divide-[#eadbd0]
                "
              >

                {dados
                  .pedidosRecentes
                  .map(
                    (pedido) => (

                    <article
                      key={
                        pedido._id
                      }
                      className="
                        p-4
                      "
                    >

                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-3
                        "
                      >

                        <div>

                          <strong
                            className="
                              text-[#35241b]
                            "
                          >
                            #
                            {idCurto(
                              pedido._id
                            )}
                          </strong>

                          <p
                            className="
                              text-sm
                              text-[#806b5e]
                              mt-1
                            "
                          >
                            {pedido
                              .usuario
                              ?.nome ||
                              "Cliente"}
                          </p>

                        </div>

                        <span
                          className={`
                            px-2.5
                            py-1
                            rounded-full
                            text-[10px]
                            font-extrabold

                            ${classeStatus(
                              pedido.status
                            )}
                          `}
                        >
                          {pedido.status}
                        </span>

                      </div>

                      <div
                        className="
                          flex
                          justify-between
                          items-end
                          gap-3
                          mt-3
                          text-sm
                        "
                      >

                        <span
                          className="
                            text-[#927d70]
                            text-xs
                          "
                        >
                          {dataHora(
                            pedido
                              .createdAt
                          )}
                        </span>

                        <strong
                          className="
                            text-[#a74417]
                          "
                        >
                          {dinheiro(
                            pedido.total
                          )}
                        </strong>

                      </div>

                    </article>

                  ))
                }

              </div>

            </>

          )}

        </section>

      </div>

    </div>

  );

}