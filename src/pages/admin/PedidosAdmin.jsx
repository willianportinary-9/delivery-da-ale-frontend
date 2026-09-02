import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  Archive,
  Banknote,
  ChevronDown,
  ChevronUp,
  Clock3,
  MapPin,
  MessageCircle,
  PackageOpen,
  Phone,
  RefreshCw,
  RotateCcw,
  Search,
  Trash2,
  Truck,
  UserRound,
  UtensilsCrossed
} from "lucide-react";

import toast from "react-hot-toast";
import Swal from "sweetalert2";

import api from "../../services/api";

export default function PedidosAdmin() {

  const [pedidos, setPedidos] =
    useState([]);

  const [
    carregando,
    setCarregando
  ] = useState(true);

  const [
    atualizando,
    setAtualizando
  ] = useState(false);

  const [
    pedidoAberto,
    setPedidoAberto
  ] = useState(null);

  const [
    filtroStatus,
    setFiltroStatus
  ] = useState("Todos");

  const [
    busca,
    setBusca
  ] = useState("");

  const [
    visualizacao,
    setVisualizacao
  ] = useState("ativos");

  // ============================================
  // CARREGAR PEDIDOS
  // ============================================

  useEffect(() => {

    setPedidoAberto(null);

    carregarPedidos();

    const intervalo =
      setInterval(
        () =>
          carregarPedidos(false),
        15000
      );

    return () =>
      clearInterval(intervalo);

  }, [visualizacao]);

  async function carregarPedidos(
    mostrarLoading = true
  ) {

    try {

      if (mostrarLoading) {

        setCarregando(true);

      } else {

        setAtualizando(true);

      }

      const arquivados =
        visualizacao ===
        "arquivados";

      const response =
        await api.get(
          `/pedidos?arquivados=${arquivados}`
        );

      const lista =
        Array.isArray(
          response.data
        )
          ? response.data
          : response.data
              .pedidos || [];

      lista.sort(
        (a, b) =>
          new Date(
            b.createdAt
          ) -
          new Date(
            a.createdAt
          )
      );

      setPedidos(lista);

    } catch (error) {

      console.error(
        "Erro ao carregar pedidos:",
        error
      );

      toast.error(
        error.response?.data
          ?.mensagem ||
        "Não foi possível carregar os pedidos."
      );

    } finally {

      setCarregando(false);
      setAtualizando(false);

    }

  }

  // ============================================
  // ALTERAR STATUS
  // ============================================

  async function alterarStatus(
    pedido,
    novoStatus
  ) {

    if (
      pedido.status ===
      novoStatus
    ) {
      return;
    }

    const resultado =
      await Swal.fire({

        title:
          "Alterar status?",

        html: `
          Pedido
          <strong>
            #${idCurto(
              pedido._id
            )}
          </strong>

          <br><br>

          ${pedido.status}

          <br>
          ↓
          <br>

          <strong>
            ${novoStatus}
          </strong>
        `,

        icon:
          "question",

        showCancelButton:
          true,

        confirmButtonText:
          "Alterar status",

        cancelButtonText:
          "Cancelar",

        confirmButtonColor:
          "#d86b24"

      });

    if (
      !resultado.isConfirmed
    ) {
      return;
    }

    try {

      await api.patch(
        `/pedidos/${pedido._id}/status`,
        {
          status:
            novoStatus
        }
      );

      toast.success(
        `Pedido atualizado para ${novoStatus}.`
      );

      await carregarPedidos(
        false
      );

    } catch (error) {

      console.error(
        "Erro ao alterar status:",
        error
      );

      toast.error(
        error.response?.data
          ?.mensagem ||
        "Não foi possível alterar o status."
      );

    }

  }

  // ============================================
  // ARQUIVAR
  // ============================================

  async function arquivarPedido(
    pedido
  ) {

    if (
      pedido.status !==
      "Entregue"
    ) {

      toast.error(
        "Somente pedidos entregues podem ser arquivados."
      );

      return;

    }

    const resultado =
      await Swal.fire({

        title:
          "Arquivar pedido?",

        html: `
          O pedido
          <strong>
            #${idCurto(
              pedido._id
            )}
          </strong>
          será removido da lista principal.

          <br><br>

          <strong>
            Ele continuará salvo no histórico
            e nos relatórios.
          </strong>
        `,

        icon:
          "question",

        showCancelButton:
          true,

        confirmButtonText:
          "Arquivar",

        cancelButtonText:
          "Cancelar",

        confirmButtonColor:
          "#d86b24"

      });

    if (
      !resultado.isConfirmed
    ) {
      return;
    }

    try {

      await api.patch(
        `/pedidos/${pedido._id}/arquivar`
      );

      toast.success(
        "Pedido arquivado."
      );

      setPedidoAberto(null);

      await carregarPedidos(
        false
      );

    } catch (error) {

      console.error(
        "Erro ao arquivar:",
        error
      );

      toast.error(
        error.response?.data
          ?.mensagem ||
        "Não foi possível arquivar o pedido."
      );

    }

  }

  // ============================================
  // RESTAURAR
  // ============================================

  async function restaurarPedido(
    pedido
  ) {

    const resultado =
      await Swal.fire({

        title:
          "Restaurar pedido?",

        html: `
          O pedido
          <strong>
            #${idCurto(
              pedido._id
            )}
          </strong>
          voltará para a lista principal.
        `,

        icon:
          "question",

        showCancelButton:
          true,

        confirmButtonText:
          "Restaurar",

        cancelButtonText:
          "Cancelar",

        confirmButtonColor:
          "#d86b24"

      });

    if (
      !resultado.isConfirmed
    ) {
      return;
    }

    try {

      await api.patch(
        `/pedidos/${pedido._id}/restaurar`
      );

      toast.success(
        "Pedido restaurado."
      );

      setPedidoAberto(null);

      await carregarPedidos(
        false
      );

    } catch (error) {

      console.error(
        "Erro ao restaurar:",
        error
      );

      toast.error(
        error.response?.data
          ?.mensagem ||
        "Não foi possível restaurar o pedido."
      );

    }

  }

  // ============================================
  // EXCLUIR DEFINITIVAMENTE
  // ============================================

  async function excluirPedido(
    pedido
  ) {

    const primeiraConfirmacao =
      await Swal.fire({

        title:
          "Excluir definitivamente?",

        html: `
          Você está prestes a excluir
          o pedido

          <strong>
            #${idCurto(
              pedido._id
            )}
          </strong>.

          <br><br>

          <span style="color:#b42318">
            Esta ação não poderá ser desfeita.
          </span>
        `,

        icon:
          "warning",

        showCancelButton:
          true,

        confirmButtonText:
          "Continuar",

        cancelButtonText:
          "Cancelar",

        confirmButtonColor:
          "#b42318"

      });

    if (
      !primeiraConfirmacao
        .isConfirmed
    ) {
      return;
    }

    /*
      Segunda confirmação para evitar
      exclusão acidental.
    */

    const segundaConfirmacao =
      await Swal.fire({

        title:
          "Tem certeza?",

        text:
          "O pedido será apagado do banco e deixará de contar nos relatórios e faturamento.",

        icon:
          "error",

        showCancelButton:
          true,

        confirmButtonText:
          "Sim, excluir",

        cancelButtonText:
          "Não",

        confirmButtonColor:
          "#b42318"

      });

    if (
      !segundaConfirmacao
        .isConfirmed
    ) {
      return;
    }

    try {

      await api.delete(
        `/pedidos/${pedido._id}`
      );

      toast.success(
        "Pedido excluído definitivamente."
      );

      setPedidoAberto(null);

      await carregarPedidos(
        false
      );

    } catch (error) {

      console.error(
        "Erro ao excluir pedido:",
        error
      );

      toast.error(
        error.response?.data
          ?.mensagem ||
        "Não foi possível excluir o pedido."
      );

    }

  }

  // ============================================
  // FORMATADORES
  // ============================================

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

        year:
          "numeric",

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

  // ============================================
  // STATUS
  // ============================================

  function classeStatus(status) {

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

  function proximoStatus(status) {

    switch (status) {

      case "Recebido":
        return "Preparando";

      case "Preparando":
        return "Saiu para entrega";

      case "Saiu para entrega":
        return "Entregue";

      default:
        return null;

    }

  }

  function textoBotaoStatus(
    status
  ) {

    switch (status) {

      case "Preparando":
        return "Iniciar preparo";

      case "Saiu para entrega":
        return "Saiu para entrega";

      case "Entregue":
        return "Marcar como entregue";

      default:
        return "Atualizar";

    }

  }

  // ============================================
  // WHATSAPP
  // ============================================

  function abrirWhatsapp(
    telefone
  ) {

    if (!telefone) {

      toast.error(
        "Cliente sem telefone cadastrado."
      );

      return;

    }

    const numero =
      telefone.replace(
        /\D/g,
        ""
      );

    window.open(
      `https://wa.me/55${numero}`,
      "_blank"
    );

  }

  // ============================================
  // MAPA
  // ============================================

  function abrirMapa(
    pedido
  ) {

    if (
      pedido.endereco
        ?.linkMaps
    ) {

      window.open(
        pedido.endereco
          .linkMaps,
        "_blank"
      );

      return;

    }

    if (
      pedido.endereco
        ?.latitude &&
      pedido.endereco
        ?.longitude
    ) {

      window.open(
        `https://www.google.com/maps?q=${pedido.endereco.latitude},${pedido.endereco.longitude}`,
        "_blank"
      );

      return;

    }

    toast.error(
      "Este pedido não possui localização."
    );

  }

  // ============================================
  // FILTROS
  // ============================================

  const pedidosFiltrados =
    useMemo(() => {

      return pedidos.filter(
        (pedido) => {

          const passaStatus =
            filtroStatus ===
              "Todos" ||
            pedido.status ===
              filtroStatus;

          const termo =
            busca
              .trim()
              .toLowerCase();

          if (!termo) {
            return passaStatus;
          }

          const nome =
            pedido.usuario
              ?.nome
              ?.toLowerCase() ||
            "";

          const telefone =
            pedido.usuario
              ?.telefone ||
            "";

          const id =
            pedido._id
              ?.toLowerCase() ||
            "";

          const passaBusca =
            nome.includes(
              termo
            ) ||
            telefone.includes(
              termo
            ) ||
            id.includes(
              termo
            );

          return (
            passaStatus &&
            passaBusca
          );

        }
      );

    }, [
      pedidos,
      filtroStatus,
      busca
    ]);

  // ============================================
  // LOADING
  // ============================================

  if (
    carregando
  ) {

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
              font-bold
              text-sm
              text-[#806b5e]
            "
          >
            Carregando pedidos...
          </p>

        </div>

      </div>

    );

  }

  // ============================================
  // TELA
  // ============================================

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
              Pedidos
            </h1>

            <p
              className="
                text-sm
                text-[#806b5e]
                mt-1
              "
            >
              Gerencie os pedidos
              recebidos pela loja.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              carregarPedidos(
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

        {/* ATIVOS / ARQUIVADOS */}

        <div
          className="
            grid
            grid-cols-2
            gap-2
            mt-6
            bg-[#eadbd0]
            p-1.5
            rounded-2xl
            max-w-md
          "
        >

          <button
            type="button"
            onClick={() =>
              setVisualizacao(
                "ativos"
              )
            }
            className={`
              min-h-[44px]
              rounded-xl
              font-extrabold
              text-sm
              flex
              items-center
              justify-center
              gap-2
              transition

              ${
                visualizacao ===
                "ativos"

                  ? `
                    bg-[#fffaf5]
                    text-[#c45a1a]
                    shadow-sm
                  `

                  : `
                    text-[#70594c]
                  `
              }
            `}
          >

            <PackageOpen
              size={17}
            />

            Ativos

          </button>

          <button
            type="button"
            onClick={() =>
              setVisualizacao(
                "arquivados"
              )
            }
            className={`
              min-h-[44px]
              rounded-xl
              font-extrabold
              text-sm
              flex
              items-center
              justify-center
              gap-2
              transition

              ${
                visualizacao ===
                "arquivados"

                  ? `
                    bg-[#fffaf5]
                    text-[#c45a1a]
                    shadow-sm
                  `

                  : `
                    text-[#70594c]
                  `
              }
            `}
          >

            <Archive
              size={17}
            />

            Arquivados

          </button>

        </div>

        {/* FILTROS */}

        <section
          className="
            bg-[#fffaf5]
            border
            border-[#e5d5ca]
            rounded-2xl
            p-4
            mt-4
            shadow-sm
          "
        >

          <div
            className="
              flex
              flex-col
              lg:flex-row
              gap-3
            "
          >

            <div
              className="
                relative
                flex-1
              "
            >

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
                placeholder="Buscar cliente, telefone ou pedido..."
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

            <select
              value={
                filtroStatus
              }
              onChange={(event) =>
                setFiltroStatus(
                  event.target.value
                )
              }
              className="
                h-[46px]
                bg-white
                border
                border-[#dfcabc]
                rounded-xl
                px-4
                outline-none
                text-[#59453a]
                font-semibold
              "
            >

              <option
                value="Todos"
              >
                Todos
              </option>

              <option
                value="Recebido"
              >
                Recebidos
              </option>

              <option
                value="Preparando"
              >
                Preparando
              </option>

              <option
                value="Saiu para entrega"
              >
                Saiu para entrega
              </option>

              <option
                value="Entregue"
              >
                Entregues
              </option>

            </select>

          </div>

        </section>

        {/* CONTADOR */}

        <div
          className="
            flex
            items-center
            justify-between
            mt-5
            mb-3
          "
        >

          <p
            className="
              text-sm
              text-[#806b5e]
            "
          >
            {
              pedidosFiltrados
                .length
            }
            {" "}
            {pedidosFiltrados
              .length === 1
              ? "pedido encontrado"
              : "pedidos encontrados"}
          </p>

        </div>

        {/* SEM PEDIDOS */}

        {pedidosFiltrados
          .length === 0 ? (

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

            {visualizacao ===
            "arquivados" ? (

              <Archive
                size={34}
                className="
                  mx-auto
                  text-[#c45a1a]
                "
              />

            ) : (

              <PackageOpen
                size={34}
                className="
                  mx-auto
                  text-[#c45a1a]
                "
              />

            )}

            <h2
              className="
                text-lg
                font-extrabold
                text-[#35241b]
                mt-3
              "
            >
              {visualizacao ===
              "arquivados"
                ? "Nenhum pedido arquivado"
                : "Nenhum pedido encontrado"}
            </h2>

          </section>

        ) : (

          <div
            className="
              grid
              xl:grid-cols-2
              gap-4
            "
          >

            {pedidosFiltrados
              .map((pedido) => {

                const aberto =
                  pedidoAberto ===
                  pedido._id;

                const proximo =
                  proximoStatus(
                    pedido.status
                  );

                return (

                  <article
                    key={
                      pedido._id
                    }
                    className="
                      bg-[#fffaf5]
                      border
                      border-[#e5d5ca]
                      rounded-3xl
                      shadow-sm
                      overflow-hidden
                    "
                  >

                    {/* TOPO */}

                    <div
                      className="
                        p-5
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
                              text-xl
                              font-extrabold
                              text-[#35241b]
                            "
                          >
                            #
                            {idCurto(
                              pedido._id
                            )}
                          </h2>

                          <div
                            className="
                              flex
                              items-center
                              gap-1
                              text-xs
                              text-[#8b7568]
                              mt-1
                            "
                          >

                            <Clock3
                              size={13}
                            />

                            {dataHora(
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

                            ${classeStatus(
                              pedido.status
                            )}
                          `}
                        >
                          {pedido.status}
                        </span>

                      </div>

                      {/* CLIENTE / TOTAL */}

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
                                text-[10px]
                                uppercase
                                tracking-wider
                                font-bold
                                text-[#927564]
                              "
                            >
                              Cliente
                            </span>

                          </div>

                          <p
                            className="
                              font-extrabold
                              text-[#453126]
                              mt-2
                            "
                          >
                            {pedido.usuario
                              ?.nome ||
                              "Cliente"}
                          </p>

                          {pedido.usuario
                            ?.telefone && (

                            <div
                              className="
                                flex
                                items-center
                                gap-1
                                mt-1
                                text-xs
                                text-[#806b5e]
                              "
                            >

                              <Phone
                                size={12}
                              />

                              {
                                pedido
                                  .usuario
                                  .telefone
                              }

                            </div>

                          )}

                        </div>

                        <div
                          className="
                            bg-[#f6ebe3]
                            rounded-2xl
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

                            <Banknote
                              size={17}
                              className="
                                text-[#c45a1a]
                              "
                            />

                            <span
                              className="
                                text-[10px]
                                uppercase
                                tracking-wider
                                font-bold
                                text-[#927564]
                              "
                            >
                              Total
                            </span>

                          </div>

                          <p
                            className="
                              text-xl
                              font-extrabold
                              text-[#a74417]
                              mt-2
                            "
                          >
                            {dinheiro(
                              pedido.total
                            )}
                          </p>

                          <p
                            className="
                              text-xs
                              text-[#806b5e]
                              mt-1
                              capitalize
                            "
                          >
                            {
                              pedido
                                .pagamento
                            }
                          </p>

                        </div>

                      </div>

                      {/* OBSERVAÇÃO */}

                      {pedido
                        .observacoes && (

                        <div
                          className="
                            mt-3
                            bg-[#fff5d9]
                            border
                            border-[#eed697]
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
                              text-[#9a6812]
                            "
                          >
                            Observações
                          </p>

                          <p
                            className="
                              text-sm
                              text-[#634d37]
                              mt-1
                            "
                          >
                            {
                              pedido
                                .observacoes
                            }
                          </p>

                        </div>

                      )}

                      {/* WHATSAPP / MAPA */}

                      <div
                        className="
                          grid
                          grid-cols-2
                          gap-2
                          mt-4
                        "
                      >

                        <button
                          type="button"
                          onClick={() =>
                            abrirWhatsapp(
                              pedido
                                .usuario
                                ?.telefone
                            )
                          }
                          className="
                            min-h-[44px]
                            rounded-xl
                            bg-[#e9f6ed]
                            text-[#347148]
                            font-bold
                            text-xs
                            sm:text-sm
                            flex
                            items-center
                            justify-center
                            gap-2
                          "
                        >

                          <MessageCircle
                            size={17}
                          />

                          WhatsApp

                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            abrirMapa(
                              pedido
                            )
                          }
                          disabled={
                            pedido
                              .tipoEntrega !==
                            "entrega"
                          }
                          className="
                            min-h-[44px]
                            rounded-xl
                            bg-[#edf4fb]
                            text-[#386a9e]
                            disabled:opacity-40
                            font-bold
                            text-xs
                            sm:text-sm
                            flex
                            items-center
                            justify-center
                            gap-2
                          "
                        >

                          <MapPin
                            size={17}
                          />

                          Localização

                        </button>

                      </div>

                    </div>

                    {/* ================================= */}
                    {/* AÇÕES DO PEDIDO ATIVO */}
                    {/* ================================= */}

                    {visualizacao ===
                    "ativos" ? (

                      <div
                        className="
                          bg-[#fff7f0]
                          border-y
                          border-[#eadbd0]
                          p-4
                        "
                      >

                        {proximo ? (

                          <button
                            type="button"
                            onClick={() =>
                              alterarStatus(
                                pedido,
                                proximo
                              )
                            }
                            className="
                              w-full
                              min-h-[48px]
                              bg-[#d86b24]
                              hover:bg-[#be5418]
                              text-white
                              rounded-xl
                              font-extrabold
                              flex
                              items-center
                              justify-center
                              gap-2
                            "
                          >

                            {proximo ===
                            "Saiu para entrega" ? (

                              <Truck
                                size={18}
                              />

                            ) : (

                              <UtensilsCrossed
                                size={18}
                              />

                            )}

                            {textoBotaoStatus(
                              proximo
                            )}

                          </button>

                        ) : (

                          <div>

                            <div
                              className="
                                w-full
                                min-h-[48px]
                                bg-[#e7f6eb]
                                text-[#39734a]
                                rounded-xl
                                font-extrabold
                                flex
                                items-center
                                justify-center
                              "
                            >
                              Pedido finalizado
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                arquivarPedido(
                                  pedido
                                )
                              }
                              className="
                                w-full
                                min-h-[46px]
                                mt-2
                                bg-[#f3e2d4]
                                hover:bg-[#ead2c0]
                                text-[#70442d]
                                rounded-xl
                                font-extrabold
                                flex
                                items-center
                                justify-center
                                gap-2
                              "
                            >

                              <Archive
                                size={17}
                              />

                              Arquivar pedido

                            </button>

                          </div>

                        )}

                      </div>

                    ) : (

                      /* ================================= */
                      /* AÇÕES ARQUIVADOS */
                      /* ================================= */

                      <div
                        className="
                          grid
                          grid-cols-2
                          gap-2
                          bg-[#fff7f0]
                          border-y
                          border-[#eadbd0]
                          p-4
                        "
                      >

                        <button
                          type="button"
                          onClick={() =>
                            restaurarPedido(
                              pedido
                            )
                          }
                          className="
                            min-h-[46px]
                            bg-[#e7f6eb]
                            text-[#39734a]
                            rounded-xl
                            font-extrabold
                            flex
                            items-center
                            justify-center
                            gap-2
                          "
                        >

                          <RotateCcw
                            size={17}
                          />

                          Restaurar

                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            excluirPedido(
                              pedido
                            )
                          }
                          className="
                            min-h-[46px]
                            bg-[#fdebea]
                            text-[#b42318]
                            rounded-xl
                            font-extrabold
                            flex
                            items-center
                            justify-center
                            gap-2
                          "
                        >

                          <Trash2
                            size={17}
                          />

                          Excluir

                        </button>

                      </div>

                    )}

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
                        text-sm
                        font-bold
                        text-[#70442d]
                        flex
                        items-center
                        justify-center
                        gap-2
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

                    {/* CONTEÚDO DOS DETALHES */}

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

                          <h3
                            className="
                              font-extrabold
                              text-[#35241b]
                            "
                          >
                            Itens do pedido
                          </h3>

                          <div
                            className="
                              mt-3
                              space-y-2
                            "
                          >

                            {pedido.itens
                              ?.map(
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
                                      item
                                        .quantidade
                                    }
                                    x{" "}
                                    {
                                      item
                                        .nome
                                    }
                                  </span>

                                  <strong
                                    className="
                                      text-[#453126]
                                    "
                                  >
                                    {dinheiro(
                                      item
                                        .subtotal
                                    )}
                                  </strong>

                                </div>

                              ))
                            }

                          </div>

                          {/* VALORES */}

                          <div
                            className="
                              border-t
                              border-[#eadbd0]
                              mt-4
                              pt-4
                              space-y-2
                              text-sm
                            "
                          >

                            <div
                              className="
                                flex
                                justify-between
                              "
                            >

                              <span>
                                Subtotal
                              </span>

                              <span>
                                {dinheiro(
                                  pedido
                                    .subtotal
                                )}
                              </span>

                            </div>

                            <div
                              className="
                                flex
                                justify-between
                              "
                            >

                              <span>
                                Entrega
                              </span>

                              <span>
                                {dinheiro(
                                  pedido
                                    .taxaEntrega
                                )}
                              </span>

                            </div>

                            <div
                              className="
                                flex
                                justify-between
                                font-extrabold
                              "
                            >

                              <span>
                                Total
                              </span>

                              <span
                                className="
                                  text-[#a74417]
                                "
                              >
                                {dinheiro(
                                  pedido
                                    .total
                                )}
                              </span>

                            </div>

                          </div>

                          {/* TROCO */}

                          {pedido.pagamento ===
                            "dinheiro" &&
                            pedido
                              .trocoPara && (

                            <div
                              className="
                                mt-4
                                bg-[#f6ebe3]
                                p-4
                                rounded-2xl
                              "
                            >

                              <p
                                className="
                                  text-xs
                                  text-[#806b5e]
                                "
                              >
                                Troco para
                              </p>

                              <strong
                                className="
                                  text-[#453126]
                                "
                              >
                                {dinheiro(
                                  pedido
                                    .trocoPara
                                )}
                              </strong>

                            </div>

                          )}

                          {/* ENDEREÇO */}

                          {pedido.tipoEntrega ===
                            "entrega" &&
                            pedido
                              .endereco && (

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

                                  <strong
                                    className="
                                      text-[#453126]
                                    "
                                  >
                                    {
                                      pedido
                                        .endereco
                                        .rua
                                    },
                                    {" "}
                                    {
                                      pedido
                                        .endereco
                                        .numero
                                    }
                                  </strong>

                                  <p
                                    className="
                                      text-xs
                                      text-[#806b5e]
                                      mt-1
                                    "
                                  >
                                    {
                                      pedido
                                        .endereco
                                        .bairro
                                    }
                                    {" • "}
                                    {
                                      pedido
                                        .endereco
                                        .cidade
                                    }
                                  </p>

                                  {pedido
                                    .endereco
                                    .complemento && (

                                    <p
                                      className="
                                        text-xs
                                        text-[#806b5e]
                                        mt-1
                                      "
                                    >
                                      {
                                        pedido
                                          .endereco
                                          .complemento
                                      }
                                    </p>

                                  )}

                                  {pedido
                                    .endereco
                                    .referencia && (

                                    <p
                                      className="
                                        text-xs
                                        text-[#806b5e]
                                        mt-1
                                      "
                                    >
                                      Referência:
                                      {" "}
                                      {
                                        pedido
                                          .endereco
                                          .referencia
                                      }
                                    </p>

                                  )}

                                </div>

                              </div>

                            </div>

                          )}

                          {/* DATA ARQUIVAMENTO */}

                          {visualizacao ===
                            "arquivados" &&
                            pedido
                              .arquivadoEm && (

                            <div
                              className="
                                mt-4
                                text-xs
                                text-[#927d70]
                              "
                            >
                              Arquivado em:
                              {" "}
                              {dataHora(
                                pedido
                                  .arquivadoEm
                              )}
                            </div>

                          )}

                        </div>

                      </div>

                    )}

                  </article>

                );

              })
            }

          </div>

        )}

      </div>

    </div>

  );

}