import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";

import { CartContext } from "../context/CartContext";

import {
  House,
  ClipboardList,
  ShoppingBag,
  UserRound,
} from "lucide-react";

function BottomMenu() {
  const location = useLocation();

  const { cart } = useContext(CartContext);

  const quantidadeItens = cart.reduce(
    (total, item) =>
      total + item.quantidade,
    0
  );

  const itensMenu = [
    {
      nome: "Início",
      caminho: "/",
      icone: House,
    },
    {
      nome: "Pedidos",
      caminho: "/pedidos",
      icone: ClipboardList,
    },
    {
      nome: "Carrinho",
      caminho: "/carrinho",
      icone: ShoppingBag,
      carrinho: true,
    },
    {
      nome: "Perfil",
      caminho: "/perfil",
      icone: UserRound,
    },
  ];

  return (
    <nav
      className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        flex
        justify-center
        pointer-events-none
      "
    >
      <div
        className="
          w-full
          max-w-7xl
          h-[72px]
          bg-[#fffaf5]/95
          backdrop-blur-xl
          border-t
          border-[#d8c3b4]
          shadow-[0_-6px_25px_rgba(59,36,22,0.12)]
          flex
          items-center
          justify-around
          px-2
          pointer-events-auto
        "
      >
        {itensMenu.map((item) => {
          const Icone = item.icone;

          const ativo =
            location.pathname === item.caminho;

          return (
            <Link
              key={item.nome}
              to={item.caminho}
              className={`
                relative
                flex
                flex-col
                items-center
                justify-center
                min-w-[64px]
                h-full
                gap-1
                transition-all
                duration-200
                ${
                  ativo
                    ? "text-[#c45a1a]"
                    : "text-[#76665d]"
                }
              `}
            >
              <div className="relative">
                <Icone
                  size={22}
                  strokeWidth={ativo ? 2.5 : 2}
                />

                {item.carrinho &&
                  quantidadeItens > 0 && (
                    <span
                      className="
                        absolute
                        -top-2
                        -right-3
                        bg-[#c44a2c]
                        text-white
                        text-[10px]
                        font-bold
                        min-w-[18px]
                        h-[18px]
                        px-1
                        rounded-full
                        flex
                        items-center
                        justify-center
                        border-2
                        border-[#fffaf5]
                      "
                    >
                      {quantidadeItens}
                    </span>
                  )}
              </div>

              <span
                className={`
                  text-[11px]
                  ${
                    ativo
                      ? "font-bold"
                      : "font-medium"
                  }
                `}
              >
                {item.nome}
              </span>

              {ativo && (
                <span
                  className="
                    absolute
                    top-0
                    w-9
                    h-[3px]
                    rounded-b-full
                    bg-[#c45a1a]
                  "
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomMenu;