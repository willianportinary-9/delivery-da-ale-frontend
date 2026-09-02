import { useContext } from "react";

import {
  LayoutDashboard,
  ClipboardList,
  PackageOpen,
  Settings,
  LogOut,
  UtensilsCrossed,
  Tags,
  X
} from "lucide-react";

import {
  NavLink,
  useNavigate
} from "react-router-dom";

import {
  AuthContext
} from "../context/AuthContext";

export default function AdminSidebar({
  aberto = false,
  fechar = () => {}
}) {

  const navigate = useNavigate();

  const {
    usuario,
    logout
  } = useContext(AuthContext);

  function sair() {

    logout();

    fechar();

    navigate(
      "/admin",
      {
        replace: true
      }
    );
  }

  const menu = [
    {
      nome: "Dashboard",
      rota: "/admin/dashboard",
      icone: LayoutDashboard
    },
    {
      nome: "Pedidos",
      rota: "/admin/pedidos",
      icone: ClipboardList
    },
    {
      nome: "Produtos",
      rota: "/admin/produtos",
      icone: PackageOpen
    },
    {
      nome: "Categorias",
      rota: "/admin/categorias",
      icone: Tags
    },
    {
      nome: "Configurações",
      rota: "/admin/configuracoes",
      icone: Settings
    }
  ];

  return (

    <aside
      className={`
        fixed
        lg:sticky
        top-0
        left-0
        z-50
        w-[280px]
        h-screen
        bg-gradient-to-b
        from-[#2a1810]
        via-[#3b2416]
        to-[#21120c]
        text-white
        flex
        flex-col
        shadow-2xl
        transition-transform
        duration-300

        ${
          aberto
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
    >

      {/* LOGO */}

      <div
        className="
          px-5
          pt-6
          pb-5
          border-b
          border-white/10
        "
      >

        <div
          className="
            flex
            items-center
            justify-between
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
                size={22}
              />
            </div>

            <div>

              <p
                className="
                  text-[9px]
                  uppercase
                  tracking-[0.2em]
                  text-[#d5b49e]
                "
              >
                Administração
              </p>

              <h1
                className="
                  font-extrabold
                  text-lg
                "
              >
                Delivery da Alê
              </h1>

            </div>

          </div>

          <button
            type="button"
            onClick={fechar}
            className="
              lg:hidden
              w-9
              h-9
              rounded-xl
              bg-white/10
              flex
              items-center
              justify-center
            "
          >
            <X size={19} />
          </button>

        </div>

      </div>

      {/* ADMIN */}

      <div
        className="
          px-5
          py-5
          border-b
          border-white/10
        "
      >

        <p
          className="
            text-xs
            text-[#bfa99b]
          "
        >
          Conectado como
        </p>

        <p
          className="
            font-bold
            mt-1
            truncate
          "
        >
          {usuario?.nome ||
            "Administrador"}
        </p>

        <span
          className="
            inline-block
            mt-2
            text-[10px]
            font-bold
            uppercase
            tracking-wider
            bg-[#d86b24]/20
            text-[#f0b98d]
            border
            border-[#d86b24]/30
            rounded-full
            px-2
            py-1
          "
        >
          Admin
        </span>

      </div>

      {/* MENU */}

      <nav
        className="
          flex-1
          px-4
          py-5
          space-y-2
        "
      >

        {menu.map((item) => {

          const Icone = item.icone;

          return (

            <NavLink
              key={item.rota}
              to={item.rota}
              onClick={fechar}
              className={({
                isActive
              }) => `
                flex
                items-center
                gap-3
                px-4
                py-3.5
                rounded-2xl
                font-bold
                text-sm
                transition-all

                ${
                  isActive
                    ? `
                      bg-[#d86b24]
                      text-white
                      shadow-lg
                    `
                    : `
                      text-[#d9c9bf]
                      hover:bg-white/10
                      hover:text-white
                    `
                }
              `}
            >

              <Icone size={19} />

              {item.nome}

            </NavLink>

          );

        })}

      </nav>

      {/* SAIR */}

      <div
        className="
          p-4
          border-t
          border-white/10
        "
      >

        <button
          type="button"
          onClick={sair}
          className="
            w-full
            min-h-[48px]
            rounded-2xl
            border
            border-white/10
            text-[#e6d5cb]
            hover:bg-[#a6472b]
            hover:text-white
            flex
            items-center
            justify-center
            gap-2
            font-bold
            transition
          "
        >
          <LogOut size={18} />

          Sair do painel
        </button>

      </div>

    </aside>

  );
}