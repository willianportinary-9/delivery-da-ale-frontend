import {
  useContext,
  useEffect,
  useRef,
  useState
} from "react";

import {
  Bell,
  Menu,
  ShieldCheck
} from "lucide-react";

import {
  Navigate,
  useLocation,
  useNavigate
} from "react-router-dom";

import toast from "react-hot-toast";

import AdminSidebar
  from "../components/AdminSidebar";

import {
  AuthContext
} from "../context/AuthContext";

import api from "../services/api";

const CHAVE_PEDIDOS_VISTOS =
  "deliveryAle_admin_pedidos_vistos_ate";

export default function AdminLayout({
  children
}) {

  const {
    usuario,
    token
  } = useContext(AuthContext);

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [
    menuAberto,
    setMenuAberto
  ] = useState(false);

  const [
    novosPedidos,
    setNovosPedidos
  ] = useState(0);

  const quantidadeAnterior =
    useRef(0);

  /*
    ============================================
    MARCAR PEDIDOS COMO VISTOS
    ============================================
  */

  function marcarPedidosVistos() {

    localStorage.setItem(
      CHAVE_PEDIDOS_VISTOS,
      new Date().toISOString()
    );

    quantidadeAnterior.current = 0;

    setNovosPedidos(0);

  }

  /*
    ============================================
    ABRIR PEDIDOS PELO SINO
    ============================================
  */

  function abrirPedidosNovos() {

    marcarPedidosVistos();

    setMenuAberto(false);

    navigate(
      "/admin/pedidos"
    );

  }

  /*
    ============================================
    VERIFICAR NOVOS PEDIDOS
    ============================================
  */

  useEffect(() => {

    if (
      !usuario ||
      !token ||
      usuario.tipo !== "admin"
    ) {
      return;
    }

    let componenteAtivo = true;

    /*
      Se o administrador estiver
      na página de pedidos,
      consideramos que ele está
      acompanhando os pedidos.
    */

    if (
      location.pathname ===
      "/admin/pedidos"
    ) {

      marcarPedidosVistos();

      const intervaloVistos =
        setInterval(
          () => {

            localStorage.setItem(
              CHAVE_PEDIDOS_VISTOS,
              new Date().toISOString()
            );

          },
          10000
        );

      return () =>
        clearInterval(
          intervaloVistos
        );

    }

    async function verificarPedidos() {

      /*
        Não faz consulta se a aba
        estiver em segundo plano.
      */

      if (document.hidden) {
        return;
      }

      try {

        const response =
          await api.get(
            "/pedidos?arquivados=false"
          );

        const lista =
          Array.isArray(
            response.data
          )
            ? response.data
            : response.data
                .pedidos || [];

        if (
          lista.length === 0
        ) {

          if (componenteAtivo) {
            setNovosPedidos(0);
          }

          quantidadeAnterior
            .current = 0;

          return;
        }

        /*
          Ordena do mais novo
          para o mais antigo.
        */

        const listaOrdenada =
          [...lista].sort(
            (a, b) =>
              new Date(
                b.createdAt
              ) -
              new Date(
                a.createdAt
              )
          );

        const ultimoPedido =
          listaOrdenada[0];

        const dataUltimoPedido =
          ultimoPedido?.createdAt;

        if (!dataUltimoPedido) {
          return;
        }

        let ultimaVisualizacao =
          localStorage.getItem(
            CHAVE_PEDIDOS_VISTOS
          );

        /*
          Primeira vez usando
          o sistema de notificações.

          Os pedidos que já existiam
          não serão considerados novos.
        */

        if (!ultimaVisualizacao) {

          localStorage.setItem(
            CHAVE_PEDIDOS_VISTOS,
            dataUltimoPedido
          );

          quantidadeAnterior
            .current = 0;

          if (componenteAtivo) {
            setNovosPedidos(0);
          }

          return;
        }

        const dataVista =
          new Date(
            ultimaVisualizacao
          ).getTime();

        const pedidosNovos =
          listaOrdenada.filter(
            (pedido) => {

              if (
                !pedido.createdAt
              ) {
                return false;
              }

              return (
                new Date(
                  pedido.createdAt
                ).getTime() >
                dataVista
              );

            }
          );

        const quantidade =
          pedidosNovos.length;

        /*
          Só mostra o toast quando
          realmente chegou pedido novo,
          evitando repetir o aviso
          a cada 10 segundos.
        */

        if (
          quantidade >
          quantidadeAnterior.current
        ) {

          const diferenca =
            quantidade -
            quantidadeAnterior.current;

          if (
            quantidadeAnterior.current >= 0
          ) {

            toast(
              diferenca === 1
                ? "Novo pedido recebido!"
                : `${diferenca} novos pedidos recebidos!`,
              {
                icon: "🔔",
                duration: 5000
              }
            );

          }

        }

        quantidadeAnterior.current =
          quantidade;

        if (componenteAtivo) {

          setNovosPedidos(
            quantidade
          );

        }

      } catch (error) {

        /*
          Não mostramos toast de erro
          a cada 10 segundos para não
          incomodar o administrador.
        */

        console.error(
          "Erro ao verificar novos pedidos:",
          error
        );

      }

    }

    verificarPedidos();

    const intervalo =
      setInterval(
        verificarPedidos,
        10000
      );

    return () => {

      componenteAtivo = false;

      clearInterval(
        intervalo
      );

    };

  }, [
    location.pathname,
    usuario,
    token
  ]);

  /*
    Proteção no frontend.
    O backend também protege
    as rotas administrativas.
  */

  if (
    !usuario ||
    !token ||
    usuario.tipo !== "admin"
  ) {

    return (

      <Navigate
        to="/admin"
        replace
      />

    );

  }

  return (

    <div
      className="
        min-h-screen
        bg-[#f4efeb]
        flex
      "
    >

      {/* OVERLAY MOBILE */}

      {menuAberto && (

        <button
          type="button"
          onClick={() =>
            setMenuAberto(false)
          }
          className="
            fixed
            inset-0
            bg-black/50
            z-40
            lg:hidden
          "
        />

      )}

      <AdminSidebar
        aberto={menuAberto}
        fechar={() =>
          setMenuAberto(false)
        }
        novosPedidos={
          novosPedidos
        }
        abrirPedidosNovos={
          abrirPedidosNovos
        }
        marcarPedidosVistos={
          marcarPedidosVistos
        }
      />

      <div
        className="
          flex-1
          min-w-0
        "
      >

        {/* HEADER MOBILE */}

        <header
          className="
            lg:hidden
            sticky
            top-0
            z-30
            h-[66px]
            bg-[#fffaf5]/95
            backdrop-blur-xl
            border-b
            border-[#e4d4c8]
            px-4
            flex
            items-center
            justify-between
          "
        >

          <button
            type="button"
            onClick={() =>
              setMenuAberto(true)
            }
            className="
              w-10
              h-10
              bg-[#f1e2d5]
              text-[#5a3520]
              rounded-xl
              flex
              items-center
              justify-center
            "
          >

            <Menu size={21} />

          </button>

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <ShieldCheck
              size={18}
              className="
                text-[#d86b24]
              "
            />

            <span
              className="
                font-extrabold
                text-[#35241b]
              "
            >
              Painel Admin
            </span>

          </div>

          {/* SINO MOBILE */}

          <button
            type="button"
            onClick={
              abrirPedidosNovos
            }
            className="
              relative
              w-10
              h-10
              bg-[#f1e2d5]
              text-[#5a3520]
              rounded-xl
              flex
              items-center
              justify-center
            "
            title="Novos pedidos"
          >

            <Bell size={20} />

            {novosPedidos > 0 && (

              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  min-w-[20px]
                  h-5
                  px-1
                  bg-[#d86b24]
                  text-white
                  text-[10px]
                  font-extrabold
                  rounded-full
                  flex
                  items-center
                  justify-center
                  border-2
                  border-[#fffaf5]
                "
              >

                {novosPedidos > 99
                  ? "99+"
                  : novosPedidos}

              </span>

            )}

          </button>

        </header>

        <main>

          {children}

        </main>

      </div>

    </div>

  );

}