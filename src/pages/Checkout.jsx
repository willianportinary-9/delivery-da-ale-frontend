import {
  useContext,
  useEffect,
  useState
} from "react";

import {
  Banknote,
  Check,
  ChevronLeft,
  ClipboardList,
  CreditCard,
  LocateFixed,
  MapPin,
  Store,
  Truck
} from "lucide-react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import toast from "react-hot-toast";
import Swal from "sweetalert2";

import api from "../services/api";

import {
  CartContext
} from "../context/CartContext";

import {
  AuthContext
} from "../context/AuthContext";

export default function Checkout() {

  const navigate = useNavigate();

  const {
    cart,
    total,
    limparCarrinho
  } = useContext(CartContext);

  const {
    usuario,
    token
  } = useContext(AuthContext);

  // ============================================
  // ESTADOS
  // ============================================

  const [enderecos, setEnderecos] =
    useState([]);

  const [enderecoId, setEnderecoId] =
    useState("");

  const [tipoEntrega, setTipoEntrega] =
    useState("entrega");

  const [pagamento, setPagamento] =
    useState("pix");

  const [trocoPara, setTrocoPara] =
    useState("");

  const [observacoes, setObservacoes] =
    useState("");

  const [
    carregandoEnderecos,
    setCarregandoEnderecos
  ] = useState(false);

  const [
    finalizando,
    setFinalizando
  ] = useState(false);

  const [
    configuracoes,
    setConfiguracoes
  ] = useState(null);

  const [
    carregandoConfiguracoes,
    setCarregandoConfiguracoes
  ] = useState(true);

  // ============================================
  // VALORES
  // ============================================

  const taxaConfigurada =
    Number(
      configuracoes?.taxaEntrega ?? 0
    );

  const taxaEntrega =
    tipoEntrega === "entrega"
      ? taxaConfigurada
      : 0;

  const totalEstimado =
    Number(total) +
    Number(taxaEntrega);

  // ============================================
  // CARREGAMENTO INICIAL
  // ============================================

  useEffect(() => {

    carregarConfiguracoes();

  }, []);

  useEffect(() => {

    if (
      token &&
      usuario &&
      tipoEntrega === "entrega"
    ) {

      carregarEnderecos();

    }

  }, [
    token,
    usuario,
    tipoEntrega
  ]);

  // ============================================
  // CONFIGURAÇÕES
  // ============================================

  async function carregarConfiguracoes() {

    try {

      setCarregandoConfiguracoes(true);

      const response =
        await api.get(
          "/configuracoes"
        );

      setConfiguracoes(
        response.data
      );

    } catch (error) {

      console.error(
        "Erro ao carregar configurações:",
        error
      );

      toast.error(
        "Não foi possível carregar as configurações da loja."
      );

    } finally {

      setCarregandoConfiguracoes(false);

    }

  }

  // ============================================
  // ENDEREÇOS
  // ============================================

  async function carregarEnderecos() {

    try {

      setCarregandoEnderecos(true);

      const response =
        await api.get(
          "/enderecos"
        );

      const lista =
        Array.isArray(response.data)
          ? response.data
          : response.data.enderecos || [];

      setEnderecos(lista);

      const principal =
        lista.find(
          (endereco) =>
            endereco.principal
        );

      if (principal) {

        setEnderecoId(
          principal._id
        );

      } else if (
        lista.length > 0 &&
        !enderecoId
      ) {

        setEnderecoId(
          lista[0]._id
        );

      }

    } catch (error) {

      console.error(
        "Erro ao carregar endereços:",
        error
      );

    } finally {

      setCarregandoEnderecos(false);

    }

  }

  // ============================================
  // FORMATAR PREÇO
  // ============================================

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

  // ============================================
  // GEOLOCALIZAÇÃO
  // ============================================

  function pegarLocalizacao() {

    return new Promise(
      (resolve) => {

        if (
          !navigator.geolocation
        ) {

          resolve(null);

          return;

        }

        navigator.geolocation
          .getCurrentPosition(

            (position) => {

              resolve({

                latitude:
                  position.coords.latitude,

                longitude:
                  position.coords.longitude

              });

            },

            () => {

              resolve(null);

            },

            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 60000
            }

          );

      }
    );

  }

  // ============================================
  // COPIAR PIX
  // ============================================

  async function copiarPix() {

    if (
      !configuracoes?.pixChave
    ) {

      toast.error(
        "Chave PIX não cadastrada."
      );

      return;

    }

    try {

      await navigator.clipboard
        .writeText(
          configuracoes.pixChave
        );

      toast.success(
        "Chave PIX copiada!"
      );

    } catch (error) {

      console.error(
        "Erro ao copiar PIX:",
        error
      );

      toast.error(
        "Não foi possível copiar a chave PIX."
      );

    }

  }

  // ============================================
  // CONFIRMAR PEDIDO
  // ============================================

  async function confirmarPedido() {

    // Carrinho vazio

    if (
      cart.length === 0
    ) {

      toast.error(
        "Seu carrinho está vazio."
      );

      return;

    }

    // Configurações ainda carregando

    if (
      carregandoConfiguracoes
    ) {

      toast.error(
        "Aguarde as configurações da loja carregarem."
      );

      return;

    }

    // Falha ao carregar configurações

    if (!configuracoes) {

      toast.error(
        "Não foi possível verificar as configurações da loja."
      );

      return;

    }

    // Loja fechada

    if (
      !configuracoes.lojaAberta
    ) {

      await Swal.fire({

        icon: "warning",

        title: "Loja fechada",

        html: `
          No momento não estamos
          recebendo pedidos.

          <br><br>

          Funcionamento:

          <strong>
            ${configuracoes.horarioAbertura}
            às
            ${configuracoes.horarioFechamento}
          </strong>
        `,

        confirmButtonText: "Entendi",

        confirmButtonColor:
          "#d86b24"

      });

      return;

    }

    // Usuário não autenticado

    if (
      !token ||
      !usuario
    ) {

      toast.error(
        "Faça login para finalizar o pedido."
      );

      navigate(
        "/login",
        {
          state: {
            from: "/checkout"
          }
        }
      );

      return;

    }

    // Endereço obrigatório

    if (
      tipoEntrega === "entrega" &&
      !enderecoId
    ) {

      toast.error(
        "Selecione um endereço para entrega."
      );

      return;

    }

    // PIX não configurado

    if (
      pagamento === "pix" &&
      !configuracoes.pixChave
    ) {

      toast.error(
        "O PIX ainda não foi configurado pela loja."
      );

      return;

    }

    // Troco menor que total

    if (
      pagamento === "dinheiro" &&
      trocoPara &&
      Number(trocoPara) <
        totalEstimado
    ) {

      toast.error(
        "O valor para troco não pode ser menor que o total."
      );

      return;

    }

    const resultado =
      await Swal.fire({

        title: "Confirmar pedido?",

        html: `
          <div style="text-align:center">

            Total aproximado:

            <br>

            <strong
              style="
                font-size:22px;
                color:#a74417;
              "
            >
              ${formatarPreco(
                totalEstimado
              )}
            </strong>

          </div>
        `,

        icon: "question",

        showCancelButton: true,

        confirmButtonText:
          "Confirmar pedido",

        cancelButtonText:
          "Voltar",

        confirmButtonColor:
          "#d86b24"

      });

    if (
      resultado.isConfirmed
    ) {

      await finalizarPedido();

    }

  }

  // ============================================
  // FINALIZAR PEDIDO
  // ============================================

  async function finalizarPedido() {

    try {

      setFinalizando(true);

      let localizacao = null;

      // Só precisamos da localização
      // quando for entrega

      if (
        tipoEntrega === "entrega"
      ) {

        localizacao =
          await pegarLocalizacao();

      }

      const enderecoSelecionado =
        enderecos.find(
          (endereco) =>
            endereco._id ===
            enderecoId
        );

      /*
        Se o usuário não permitir
        localização atual, usamos a
        localização salva no endereço.
      */

      if (
        tipoEntrega === "entrega" &&
        !localizacao &&
        enderecoSelecionado
      ) {

        localizacao = {

          latitude:
            enderecoSelecionado
              .latitude ?? null,

          longitude:
            enderecoSelecionado
              .longitude ?? null

        };

      }

      // Itens no formato esperado
      // pelo backend MongoDB

      const itens =
        cart.map(
          (item) => ({

            produto:
              item._id,

            quantidade:
              item.quantidade

          })
        );

      const pedido = {

        itens,

        tipoEntrega,

        pagamento,

        observacoes:
          observacoes.trim(),

        latitude:
          localizacao?.latitude ??
          null,

        longitude:
          localizacao?.longitude ??
          null

      };

      // Endereço somente em entrega

      if (
        tipoEntrega === "entrega"
      ) {

        pedido.enderecoId =
          enderecoId;

      }

      // Troco somente para dinheiro

      if (
        pagamento === "dinheiro" &&
        trocoPara
      ) {

        pedido.trocoPara =
          Number(trocoPara);

      }

      /*
        IMPORTANTE:

        Não enviamos preço,
        subtotal, taxa ou total.

        O backend calcula tudo
        novamente utilizando os
        preços reais dos produtos
        e a taxa das configurações.
      */

      const response =
        await api.post(
          "/pedidos",
          pedido
        );

      limparCarrinho();

      await Swal.fire({

        icon: "success",

        title:
          "Pedido realizado!",

        text:
          "Seu pedido foi enviado para a cozinha.",

        confirmButtonText:
          "Acompanhar pedido",

        confirmButtonColor:
          "#d86b24"

      });

      console.log(
        "Pedido criado:",
        response.data
      );

      navigate(
        "/pedidos"
      );

    } catch (error) {

      console.error(
        "Erro ao finalizar pedido:",
        error
      );

      const mensagem =
        error.response?.data
          ?.mensagem ||
        "Não foi possível finalizar o pedido.";

      await Swal.fire({

        icon: "error",

        title: "Erro",

        text: mensagem,

        confirmButtonColor:
          "#d86b24"

      });

    } finally {

      setFinalizando(false);

    }

  }

  // ============================================
  // CARRINHO VAZIO
  // ============================================

  if (
    cart.length === 0
  ) {

    return (

      <div
        className="
          min-h-screen
          bg-[#f7f2ec]
          p-4
        "
      >

        <div
          className="
            max-w-xl
            mx-auto
            mt-10
            bg-[#fffaf5]
            border
            border-[#eadbd0]
            rounded-3xl
            p-8
            text-center
          "
        >

          <h1
            className="
              text-xl
              font-extrabold
              text-[#35241b]
            "
          >
            Seu carrinho está vazio
          </h1>

          <p
            className="
              text-sm
              text-[#806b5e]
              mt-2
            "
          >
            Adicione alguns produtos
            antes de finalizar.
          </p>

          <Link
            to="/"
            className="
              inline-block
              mt-5
              bg-[#d86b24]
              text-white
              font-bold
              px-6
              py-3
              rounded-2xl
            "
          >
            Voltar ao cardápio
          </Link>

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
          pt-6
          pb-8
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
            max-w-3xl
            mx-auto
          "
        >

          <Link
            to="/carrinho"
            className="
              inline-flex
              items-center
              gap-1
              text-sm
              text-[#ead8ca]
              mb-5
            "
          >

            <ChevronLeft
              size={18}
            />

            Carrinho

          </Link>

          <p
            className="
              text-[11px]
              uppercase
              tracking-[0.2em]
              text-[#edc5a5]
            "
          >
            Última etapa
          </p>

          <h1
            className="
              text-2xl
              sm:text-3xl
              font-extrabold
              mt-1
            "
          >
            Finalizar pedido
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-[#ead8ca]
            "
          >
            Confira a entrega e escolha
            a forma de pagamento.
          </p>

        </div>

      </header>

      <main
        className="
          max-w-3xl
          mx-auto
          px-4
          py-5
          space-y-4
        "
      >

        {/* ================================= */}
        {/* STATUS DA LOJA */}
        {/* ================================= */}

        {carregandoConfiguracoes ? (

          <section
            className="
              bg-[#fffaf5]
              border
              border-[#eadbd0]
              rounded-2xl
              p-4
            "
          >

            <p
              className="
                text-sm
                font-bold
                text-[#806b5e]
              "
            >
              Carregando informações
              da loja...
            </p>

          </section>

        ) : configuracoes ? (

          <section
            className={`
              border
              rounded-2xl
              p-4

              ${
                configuracoes.lojaAberta

                  ? `
                    bg-[#eaf7ed]
                    border-[#badfc3]
                  `

                  : `
                    bg-[#fbe9e6]
                    border-[#e5b6ad]
                  `
              }
            `}
          >

            <p
              className={`
                font-extrabold

                ${
                  configuracoes.lojaAberta
                    ? "text-[#39734a]"
                    : "text-[#a34332]"
                }
              `}
            >
              {configuracoes.lojaAberta
                ? "● Loja aberta"
                : "● Loja fechada"}
            </p>

            <p
              className="
                text-xs
                text-[#806b5e]
                mt-1
              "
            >
              Funcionamento:
              {" "}
              {
                configuracoes
                  .horarioAbertura
              }
              {" às "}
              {
                configuracoes
                  .horarioFechamento
              }
            </p>

            {configuracoes.aviso && (

              <p
                className="
                  text-xs
                  text-[#654f43]
                  font-semibold
                  mt-2
                "
              >
                {configuracoes.aviso}
              </p>

            )}

          </section>

        ) : null}

        {/* ================================= */}
        {/* ENTREGA OU RETIRADA */}
        {/* ================================= */}

        <section
          className="
            bg-[#fffaf5]
            border
            border-[#eadbd0]
            rounded-3xl
            p-5
            shadow-sm
          "
        >

          <h2
            className="
              font-extrabold
              text-[#35241b]
            "
          >
            Como você quer receber?
          </h2>

          <div
            className="
              grid
              grid-cols-2
              gap-3
              mt-4
            "
          >

            {/* ENTREGA */}

            <button
              type="button"
              onClick={() =>
                setTipoEntrega(
                  "entrega"
                )
              }
              className={`
                p-4
                rounded-2xl
                border
                transition

                ${
                  tipoEntrega ===
                  "entrega"

                    ? `
                      bg-[#d86b24]
                      border-[#d86b24]
                      text-white
                    `

                    : `
                      bg-white
                      border-[#dfcabc]
                      text-[#59453a]
                    `
                }
              `}
            >

              <Truck
                size={22}
                className="mx-auto"
              />

              <span
                className="
                  block
                  font-bold
                  mt-2
                "
              >
                Entrega
              </span>

              <span
                className="
                  block
                  text-xs
                  mt-1
                  opacity-90
                "
              >
                {formatarPreco(
                  taxaConfigurada
                )}
              </span>

            </button>

            {/* RETIRADA */}

            <button
              type="button"
              onClick={() =>
                setTipoEntrega(
                  "retirada"
                )
              }
              className={`
                p-4
                rounded-2xl
                border
                transition

                ${
                  tipoEntrega ===
                  "retirada"

                    ? `
                      bg-[#d86b24]
                      border-[#d86b24]
                      text-white
                    `

                    : `
                      bg-white
                      border-[#dfcabc]
                      text-[#59453a]
                    `
                }
              `}
            >

              <Store
                size={22}
                className="mx-auto"
              />

              <span
                className="
                  block
                  font-bold
                  mt-2
                "
              >
                Retirada
              </span>

              <span
                className="
                  block
                  text-xs
                  mt-1
                  opacity-90
                "
              >
                Grátis
              </span>

            </button>

          </div>

        </section>

        {/* ================================= */}
        {/* ENDEREÇO */}
        {/* ================================= */}

        {tipoEntrega === "entrega" && (

          <section
            className="
              bg-[#fffaf5]
              border
              border-[#eadbd0]
              rounded-3xl
              p-5
              shadow-sm
            "
          >

            <div
              className="
                flex
                justify-between
                items-center
                gap-3
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <MapPin
                  size={20}
                  className="
                    text-[#c45a1a]
                  "
                />

                <h2
                  className="
                    font-extrabold
                    text-[#35241b]
                  "
                >
                  Endereço de entrega
                </h2>

              </div>

              <Link
                to="/enderecos"
                state={{
                  from: "/checkout"
                }}
                className="
                  text-sm
                  font-bold
                  text-[#c45a1a]
                "
              >
                Alterar
              </Link>

            </div>

            {!token ? (

              <div className="mt-4">

                <p
                  className="
                    text-sm
                    text-[#78665c]
                  "
                >
                  Faça login para selecionar
                  seu endereço.
                </p>

                <Link
                  to="/login"
                  state={{
                    from: "/checkout"
                  }}
                  className="
                    inline-block
                    mt-3
                    bg-[#d86b24]
                    text-white
                    font-bold
                    text-sm
                    px-4
                    py-2.5
                    rounded-xl
                  "
                >
                  Fazer login
                </Link>

              </div>

            ) : carregandoEnderecos ? (

              <p
                className="
                  text-sm
                  text-[#78665c]
                  mt-4
                "
              >
                Carregando endereços...
              </p>

            ) : enderecos.length === 0 ? (

              <div className="mt-4">

                <p
                  className="
                    text-sm
                    text-[#78665c]
                  "
                >
                  Você ainda não possui
                  endereço cadastrado.
                </p>

                <Link
                  to="/enderecos"
                  state={{
                    from: "/checkout"
                  }}
                  className="
                    inline-block
                    mt-3
                    bg-[#d86b24]
                    text-white
                    font-bold
                    text-sm
                    px-4
                    py-2.5
                    rounded-xl
                  "
                >
                  Cadastrar endereço
                </Link>

              </div>

            ) : (

              <div
                className="
                  mt-4
                  space-y-3
                "
              >

                {enderecos.map(
                  (endereco) => (

                    <label
                      key={endereco._id}
                      className={`
                        flex
                        gap-3
                        p-4
                        rounded-2xl
                        border
                        cursor-pointer
                        transition

                        ${
                          enderecoId ===
                          endereco._id

                            ? `
                              border-[#d86b24]
                              bg-[#fff2e8]
                            `

                            : `
                              border-[#e5d3c6]
                              bg-white
                            `
                        }
                      `}
                    >

                      <input
                        type="radio"
                        name="endereco"
                        value={
                          endereco._id
                        }
                        checked={
                          enderecoId ===
                          endereco._id
                        }
                        onChange={() =>
                          setEnderecoId(
                            endereco._id
                          )
                        }
                        className="
                          accent-[#d86b24]
                          mt-1
                        "
                      />

                      <div
                        className="
                          flex-1
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                          "
                        >

                          <strong
                            className="
                              text-[#35241b]
                            "
                          >
                            {endereco.nome ||
                              "Endereço"}
                          </strong>

                          {endereco.principal && (

                            <span
                              className="
                                text-[10px]
                                font-bold
                                bg-[#d86b24]
                                text-white
                                rounded-full
                                px-2
                                py-0.5
                              "
                            >
                              Principal
                            </span>

                          )}

                        </div>

                        <p
                          className="
                            text-sm
                            text-[#654f43]
                            mt-1
                          "
                        >
                          {endereco.rua},{" "}
                          {endereco.numero}
                        </p>

                        <p
                          className="
                            text-xs
                            text-[#8b7568]
                          "
                        >
                          {endereco.bairro}
                          {" • "}
                          {endereco.cidade}
                        </p>

                        {endereco.complemento && (

                          <p
                            className="
                              text-xs
                              text-[#8b7568]
                              mt-1
                            "
                          >
                            {
                              endereco
                                .complemento
                            }
                          </p>

                        )}

                        {endereco.referencia && (

                          <p
                            className="
                              text-xs
                              text-[#8b7568]
                              mt-1
                            "
                          >
                            Referência:{" "}
                            {
                              endereco
                                .referencia
                            }
                          </p>

                        )}

                      </div>

                    </label>

                  )
                )}

                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    text-[#806b5e]
                    pt-1
                  "
                >

                  <LocateFixed
                    size={15}
                    className="
                      text-[#c45a1a]
                    "
                  />

                  A localização será usada
                  para ajudar na entrega.

                </div>

              </div>

            )}

          </section>

        )}

        {/* ================================= */}
        {/* PAGAMENTO */}
        {/* ================================= */}

        <section
          className="
            bg-[#fffaf5]
            border
            border-[#eadbd0]
            rounded-3xl
            p-5
            shadow-sm
          "
        >

          <h2
            className="
              font-extrabold
              text-[#35241b]
            "
          >
            Forma de pagamento
          </h2>

          <div
            className="
              grid
              grid-cols-2
              gap-3
              mt-4
            "
          >

            {/* PIX */}

            <button
              type="button"
              onClick={() =>
                setPagamento("pix")
              }
              className={`
                p-4
                rounded-2xl
                border
                flex
                flex-col
                items-center
                gap-2
                transition

                ${
                  pagamento === "pix"

                    ? `
                      border-[#d86b24]
                      bg-[#fff2e8]
                      text-[#a74417]
                    `

                    : `
                      border-[#dfcabc]
                      bg-white
                      text-[#59453a]
                    `
                }
              `}
            >

              <CreditCard
                size={22}
              />

              <strong>
                PIX
              </strong>

              {pagamento === "pix" && (

                <Check
                  size={16}
                />

              )}

            </button>

            {/* DINHEIRO */}

            <button
              type="button"
              onClick={() =>
                setPagamento(
                  "dinheiro"
                )
              }
              className={`
                p-4
                rounded-2xl
                border
                flex
                flex-col
                items-center
                gap-2
                transition

                ${
                  pagamento ===
                  "dinheiro"

                    ? `
                      border-[#d86b24]
                      bg-[#fff2e8]
                      text-[#a74417]
                    `

                    : `
                      border-[#dfcabc]
                      bg-white
                      text-[#59453a]
                    `
                }
              `}
            >

              <Banknote
                size={22}
              />

              <strong>
                Dinheiro
              </strong>

              {pagamento ===
                "dinheiro" && (

                <Check
                  size={16}
                />

              )}

            </button>

          </div>

          {/* PIX DINÂMICO */}

          {pagamento === "pix" && (

            <div
              className="
                mt-4
                bg-[#fff7f0]
                border
                border-[#e8c7b2]
                rounded-2xl
                p-4
              "
            >

              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-wider
                  font-extrabold
                  text-[#9a725c]
                "
              >
                Pagamento via PIX
              </p>

              {configuracoes?.pixNome && (

                <p
                  className="
                    text-xs
                    text-[#806b5e]
                    mt-2
                  "
                >
                  Recebedor:
                  {" "}
                  <strong
                    className="
                      text-[#453126]
                    "
                  >
                    {
                      configuracoes
                        .pixNome
                    }
                  </strong>
                </p>

              )}

              <div
                className="
                  mt-4
                "
              >

                <p
                  className="
                    text-xs
                    text-[#806b5e]
                  "
                >
                  Chave PIX
                </p>

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    mt-1
                    bg-white
                    border
                    border-[#e3d2c6]
                    rounded-xl
                    p-3
                  "
                >

                  <span
                    className="
                      text-sm
                      font-extrabold
                      text-[#35241b]
                      break-all
                    "
                  >
                    {
                      configuracoes
                        ?.pixChave ||
                      "Chave PIX não cadastrada"
                    }
                  </span>

                  {configuracoes
                    ?.pixChave && (

                    <button
                      type="button"
                      onClick={
                        copiarPix
                      }
                      className="
                        shrink-0
                        bg-[#d86b24]
                        hover:bg-[#be5418]
                        active:scale-95
                        text-white
                        font-bold
                        text-sm
                        px-4
                        py-2.5
                        rounded-xl
                        transition
                      "
                    >
                      Copiar
                    </button>

                  )}

                </div>

              </div>

              <div
                className="
                  border-t
                  border-[#eadbd0]
                  mt-4
                  pt-3
                "
              >

                <p
                  className="
                    text-xs
                    text-[#806b5e]
                  "
                >
                  Valor do pedido
                </p>

                <p
                  className="
                    text-xl
                    font-extrabold
                    text-[#a74417]
                    mt-0.5
                  "
                >
                  {formatarPreco(
                    totalEstimado
                  )}
                </p>

              </div>

            </div>

          )}

          {/* TROCO */}

          {pagamento ===
            "dinheiro" && (

            <div
              className="
                mt-4
              "
            >

              <label
                className="
                  text-sm
                  font-bold
                  text-[#59453a]
                "
              >
                Precisa de troco?
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={trocoPara}
                onChange={(event) =>
                  setTrocoPara(
                    event.target.value
                  )
                }
                placeholder="Ex: 100"
                className="
                  w-full
                  mt-2
                  border
                  border-[#dfcabc]
                  bg-white
                  rounded-2xl
                  px-4
                  py-3
                  outline-none
                  focus:border-[#d86b24]
                "
              />

              <p
                className="
                  text-[11px]
                  text-[#927d70]
                  mt-2
                "
              >
                Deixe vazio caso
                não precise de troco.
              </p>

            </div>

          )}

        </section>

        {/* ================================= */}
        {/* OBSERVAÇÕES */}
        {/* ================================= */}

        <section
          className="
            bg-[#fffaf5]
            border
            border-[#eadbd0]
            rounded-3xl
            p-5
            shadow-sm
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <ClipboardList
              size={20}
              className="
                text-[#c45a1a]
              "
            />

            <h2
              className="
                font-extrabold
                text-[#35241b]
              "
            >
              Observações
            </h2>

          </div>

          <textarea
            value={observacoes}
            onChange={(event) =>
              setObservacoes(
                event.target.value
              )
            }
            maxLength={300}
            placeholder="Ex: sem cebola, entregar no portão..."
            className="
              w-full
              h-24
              mt-4
              resize-none
              border
              border-[#dfcabc]
              bg-white
              rounded-2xl
              px-4
              py-3
              outline-none
              focus:border-[#d86b24]
            "
          />

          <p
            className="
              text-right
              text-[11px]
              text-[#927d70]
              mt-1
            "
          >
            {observacoes.length}/300
          </p>

        </section>

        {/* ================================= */}
        {/* RESUMO */}
        {/* ================================= */}

        <section
          className="
            bg-[#fffaf5]
            border
            border-[#eadbd0]
            rounded-3xl
            p-5
            shadow-sm
          "
        >

          <h2
            className="
              font-extrabold
              text-[#35241b]
            "
          >
            Resumo do pedido
          </h2>

          <div
            className="
              mt-4
              space-y-3
              text-sm
            "
          >

            {/* SUBTOTAL */}

            <div
              className="
                flex
                justify-between
                text-[#746056]
              "
            >

              <span>
                Subtotal
              </span>

              <span>
                {formatarPreco(
                  total
                )}
              </span>

            </div>

            {/* ENTREGA */}

            <div
              className="
                flex
                justify-between
                text-[#746056]
              "
            >

              <span>
                Entrega
              </span>

              <span>

                {tipoEntrega ===
                "retirada"

                  ? "Grátis"

                  : taxaEntrega === 0

                    ? "Grátis"

                    : formatarPreco(
                        taxaEntrega
                      )}

              </span>

            </div>

            {/* TOTAL */}

            <div
              className="
                border-t
                border-[#eadbd0]
                pt-4
                flex
                justify-between
                items-center
              "
            >

              <strong
                className="
                  text-[#35241b]
                  text-lg
                "
              >
                Total
              </strong>

              <strong
                className="
                  text-[#a74417]
                  text-xl
                "
              >
                {formatarPreco(
                  totalEstimado
                )}
              </strong>

            </div>

          </div>

          <p
            className="
              text-[11px]
              text-[#927d70]
              mt-3
            "
          >
            O valor final será confirmado
            pelo servidor ao criar o pedido.
          </p>

        </section>

        {/* ================================= */}
        {/* FINALIZAR */}
        {/* ================================= */}

        <button
          type="button"
          onClick={
            confirmarPedido
          }
          disabled={
            finalizando ||
            carregandoConfiguracoes ||
            configuracoes?.lojaAberta ===
              false
          }
          className="
            w-full
            min-h-[56px]
            bg-[#d86b24]
            hover:bg-[#be5418]
            disabled:opacity-60
            disabled:cursor-not-allowed
            text-white
            font-extrabold
            rounded-2xl
            shadow-lg
            transition
          "
        >

          {finalizando
            ? "Enviando pedido..."

            : carregandoConfiguracoes
              ? "Carregando..."

              : configuracoes?.lojaAberta ===
                false
                ? "Loja fechada"

                : `Finalizar • ${formatarPreco(
                    totalEstimado
                  )}`}

        </button>

      </main>

    </div>

  );

}