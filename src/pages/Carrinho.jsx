import { useContext } from "react";
import { Link } from "react-router-dom";

import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  ArrowRight
} from "lucide-react";

import { CartContext } from "../context/CartContext";

export default function Carrinho() {
  const {
    cart,
    adicionarProduto,
    removerProduto,
    excluirProduto,
    total
  } = useContext(CartContext);

  function formatarPreco(valor) {
    return Number(valor).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL"
      }
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
          px-5
          pt-7
          pb-8
        "
      >
        <div
          className="absolute inset-0 opacity-20"
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

        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center gap-3">

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
                  text-[11px]
                  uppercase
                  tracking-[0.2em]
                  text-[#edc5a5]
                "
              >
                Delivery da Alê
              </p>

              <h1 className="text-2xl font-extrabold">
                Meu Carrinho
              </h1>
            </div>

          </div>

          <p className="mt-4 text-sm text-[#ead8ca]">
            Confira seus itens antes de continuar.
          </p>
        </div>
      </header>

      {/* CONTEÚDO */}

      <main
        className="
          max-w-6xl
          mx-auto
          px-4
          py-5
        "
      >

        {cart.length === 0 ? (

          /* CARRINHO VAZIO */

          <div
            className="
              bg-[#fffaf5]
              border
              border-[#eadbd0]
              rounded-3xl
              p-8
              text-center
              shadow-sm
            "
          >
            <div
              className="
                w-16
                h-16
                rounded-full
                bg-[#f3e2d4]
                text-[#c45a1a]
                flex
                items-center
                justify-center
                mx-auto
              "
            >
              <ShoppingBag size={30} />
            </div>

            <h2
              className="
                mt-4
                text-xl
                font-extrabold
                text-[#35241b]
              "
            >
              Seu carrinho está vazio
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-[#78665c]
              "
            >
              Escolha uma comida no cardápio
              para começar seu pedido.
            </p>

            <Link
              to="/"
              className="
                inline-flex
                items-center
                justify-center
                mt-6
                bg-[#d86b24]
                hover:bg-[#be5418]
                text-white
                font-bold
                px-6
                py-3
                rounded-2xl
                transition
              "
            >
              Ver cardápio
            </Link>
          </div>

        ) : (

          <>
            {/* ITENS */}

            <section className="space-y-3">

              {cart.map((item) => (

                <article
                  key={item._id}
                  className="
                    bg-[#fffaf5]
                    border
                    border-[#eadbd0]
                    rounded-3xl
                    overflow-hidden
                    shadow-sm
                  "
                >
                  <div className="flex">

                    {/* IMAGEM */}

                    <div
                      className="
                        w-[105px]
                        sm:w-[135px]
                        shrink-0
                        bg-[#e8d7ca]
                      "
                    >
                      {item.imagem ? (

                        <img
                          src={item.imagem}
                          alt={item.nome}
                          className="
                            w-full
                            h-full
                            min-h-[140px]
                            object-cover
                          "
                        />

                      ) : (

                        <div
                          className="
                            min-h-[140px]
                            w-full
                            flex
                            items-center
                            justify-center
                            text-[#9b7861]
                          "
                        >
                          <ShoppingBag size={28} />
                        </div>

                      )}
                    </div>

                    {/* INFORMAÇÕES */}

                    <div
                      className="
                        flex-1
                        p-4
                        min-w-0
                      "
                    >
                      <div
                        className="
                          flex
                          justify-between
                          gap-3
                        "
                      >

                        <div className="min-w-0">

                          <p
                            className="
                              text-[10px]
                              uppercase
                              tracking-wider
                              font-bold
                              text-[#c45a1a]
                            "
                          >
                            Delivery da Alê
                          </p>

                          <h2
                            className="
                              font-extrabold
                              text-[#35241b]
                              mt-1
                              truncate
                            "
                          >
                            {item.nome}
                          </h2>

                          {item.descricao && (
                            <p
                              className="
                                text-xs
                                text-[#78665c]
                                mt-1
                                line-clamp-2
                              "
                            >
                              {item.descricao}
                            </p>
                          )}

                        </div>

                        <button
                          onClick={() =>
                            excluirProduto(item._id)
                          }
                          className="
                            w-8
                            h-8
                            shrink-0
                            rounded-full
                            flex
                            items-center
                            justify-center
                            text-[#a9482d]
                            hover:bg-[#f5dfd5]
                            transition
                          "
                          aria-label={`Excluir ${item.nome}`}
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                      {/* PREÇO + CONTROLE */}

                      <div
                        className="
                          flex
                          items-end
                          justify-between
                          gap-3
                          mt-4
                        "
                      >

                        <div>
                          <strong
                            className="
                              text-[#a74417]
                              text-lg
                            "
                          >
                            {formatarPreco(
                              item.preco
                            )}
                          </strong>

                          <p
                            className="
                              text-[11px]
                              text-[#8b766a]
                              mt-0.5
                            "
                          >
                            Subtotal{" "}
                            {formatarPreco(
                              Number(item.preco) *
                              item.quantidade
                            )}
                          </p>
                        </div>

                        <div
                          className="
                            flex
                            items-center
                            bg-[#f3e7dd]
                            rounded-full
                            p-1
                            gap-1
                          "
                        >
                          <button
                            onClick={() =>
                              removerProduto(
                                item._id
                              )
                            }
                            className="
                              w-9
                              h-9
                              rounded-full
                              bg-white
                              text-[#70442d]
                              flex
                              items-center
                              justify-center
                              shadow-sm
                              active:scale-90
                              transition
                            "
                          >
                            <Minus size={17} />
                          </button>

                          <span
                            className="
                              min-w-[28px]
                              text-center
                              font-extrabold
                              text-[#35241b]
                            "
                          >
                            {item.quantidade}
                          </span>

                          <button
                            onClick={() =>
                              adicionarProduto(item)
                            }
                            className="
                              w-9
                              h-9
                              rounded-full
                              bg-[#d86b24]
                              hover:bg-[#be5418]
                              text-white
                              flex
                              items-center
                              justify-center
                              shadow-sm
                              active:scale-90
                              transition
                            "
                          >
                            <Plus size={17} />
                          </button>
                        </div>

                      </div>

                    </div>
                  </div>
                </article>

              ))}

            </section>

            {/* RESUMO */}

            <section
              className="
                bg-[#fffaf5]
                border
                border-[#eadbd0]
                rounded-3xl
                p-5
                shadow-sm
                mt-5
              "
            >
              <h2
                className="
                  font-extrabold
                  text-[#35241b]
                  text-lg
                "
              >
                Resumo
              </h2>

              <div
                className="
                  flex
                  justify-between
                  mt-4
                  text-sm
                  text-[#78665c]
                "
              >
                <span>Subtotal</span>

                <span>
                  {formatarPreco(total)}
                </span>
              </div>

              <div
                className="
                  flex
                  justify-between
                  mt-2
                  text-sm
                  text-[#78665c]
                "
              >
                <span>Taxa de entrega</span>

                <span>
                  Calculada no checkout
                </span>
              </div>

              <div
                className="
                  border-t
                  border-[#eadbd0]
                  mt-4
                  pt-4
                  flex
                  justify-between
                  items-center
                "
              >
                <span
                  className="
                    font-extrabold
                    text-[#35241b]
                  "
                >
                  Subtotal
                </span>

                <span
                  className="
                    text-xl
                    font-extrabold
                    text-[#a74417]
                  "
                >
                  {formatarPreco(total)}
                </span>
              </div>
            </section>

            {/* CONTINUAR */}

            <Link
              to="/checkout"
              className="
                mt-5
                w-full
                bg-[#d86b24]
                hover:bg-[#be5418]
                active:scale-[0.99]
                text-white
                rounded-2xl
                min-h-[54px]
                px-5
                font-extrabold
                flex
                items-center
                justify-center
                gap-2
                shadow-lg
                transition
              "
            >
              Continuar pedido
              <ArrowRight size={19} />
            </Link>

            <Link
              to="/"
              className="
                flex
                justify-center
                mt-4
                text-sm
                font-bold
                text-[#845c45]
              "
            >
              Adicionar mais itens
            </Link>

          </>
        )}

      </main>
    </div>
  );
}