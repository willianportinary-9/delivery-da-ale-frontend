import {
  useContext,
  useState
} from "react";

import {
  Menu,
  ShieldCheck
} from "lucide-react";

import {
  Navigate
} from "react-router-dom";

import AdminSidebar
  from "../components/AdminSidebar";

import {
  AuthContext
} from "../context/AuthContext";

export default function AdminLayout({
  children
}) {

  const {
    usuario,
    token
  } = useContext(AuthContext);

  const [menuAberto,
    setMenuAberto] =
    useState(false);

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
              className="text-[#d86b24]"
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

          <div className="w-10" />

        </header>

        <main>
          {children}
        </main>

      </div>

    </div>

  );
}