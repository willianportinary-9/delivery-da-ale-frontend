import { useContext, useState } from "react";

import {
  ChevronRight,
  ClipboardList,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  ShieldCheck,
  X,
  UserRound,
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

export default function Perfil() {

  const {
  usuario,
  token,
  login,
  logout
} = useContext(AuthContext);

const navigate = useNavigate();

  const [editandoTelefone, setEditandoTelefone] =
    useState(false);

  const [telefone, setTelefone] =
    useState("");

  const [salvandoTelefone, setSalvandoTelefone] =
    useState(false);

  function formatarTelefone(valor) {

  const numeros =
    String(valor || "")
      .replace(/\D/g, "")
      .slice(0, 11);

  if (numeros.length <= 2) {
    return numeros;
  }

  if (numeros.length <= 6) {
    return `(${numeros.slice(
      0,
      2
    )}) ${numeros.slice(2)}`;
  }

  if (numeros.length <= 10) {
    return `(${numeros.slice(
      0,
      2
    )}) ${numeros.slice(
      2,
      6
    )}-${numeros.slice(6)}`;
  }

  return `(${numeros.slice(
    0,
    2
  )}) ${numeros.slice(
    2,
    7
  )}-${numeros.slice(7)}`;
}

function iniciarEdicaoTelefone() {

  setTelefone(
    formatarTelefone(
      usuario?.telefone || ""
    )
  );

  setEditandoTelefone(true);
}

function cancelarEdicaoTelefone() {

  setTelefone("");

  setEditandoTelefone(false);
}

async function salvarTelefone() {

  const telefoneLimpo =
    telefone.replace(/\D/g, "");

  if (
    telefoneLimpo.length < 10 ||
    telefoneLimpo.length > 11
  ) {

    toast.error(
      "Informe um telefone válido com DDD."
    );

    return;
  }

  try {

    setSalvandoTelefone(true);

    const response =
      await api.put(
        "/usuarios/perfil",
        {
          telefone: telefoneLimpo
        }
      );

    /*
      Reutilizamos o login que já
      existe no AuthContext.
      Assim atualizamos:
      - usuario
      - localStorage
      - mantemos o mesmo token
    */

    login(
      response.data.usuario,
      token
    );

    setEditandoTelefone(false);

    toast.success(
      "Telefone atualizado com sucesso!"
    );

  } catch (error) {

    console.error(
      "Erro ao atualizar telefone:",
      error
    );

    toast.error(
      error.response?.data?.mensagem ||
      "Não foi possível atualizar o telefone."
    );

  } finally {

    setSalvandoTelefone(false);

  }
}

  function sair() {

    logout();

    toast.success(
      "Você saiu da sua conta."
    );

    navigate("/");
  }

  /*
    ==========================
    USUÁRIO NÃO LOGADO
    ==========================
  */

  if (!usuario) {

    return (

      <div className="min-h-screen bg-[#f7f2ec]">

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
            pb-16
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
                <UserRound size={22} />
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
                  Meu Perfil
                </h1>

              </div>

            </div>

          </div>

        </header>

        {/* CARD */}

        <main
          className="
            max-w-xl
            mx-auto
            px-4
            -mt-8
            relative
            z-10
          "
        >

          <section
            className="
              bg-[#fffaf5]
              border
              border-[#eadbd0]
              rounded-3xl
              shadow-lg
              p-7
              text-center
            "
          >

            <div
              className="
                w-20
                h-20
                mx-auto
                rounded-full
                bg-[#f3e2d4]
                text-[#c45a1a]
                flex
                items-center
                justify-center
              "
            >
              <UserRound size={36} />
            </div>

            <h2
              className="
                text-xl
                font-extrabold
                text-[#35241b]
                mt-5
              "
            >
              Entre para continuar
            </h2>

            <p
              className="
                text-sm
                text-[#806b5e]
                mt-2
                max-w-sm
                mx-auto
              "
            >
              Faça login para finalizar pedidos,
              salvar endereços e acompanhar o
              andamento das suas compras.
            </p>

            <Link
              to="/login"
              className="
                w-full
                min-h-[52px]
                mt-6
                bg-[#d86b24]
                hover:bg-[#be5418]
                text-white
                font-extrabold
                rounded-2xl
                flex
                items-center
                justify-center
                gap-2
                shadow-md
                transition
              "
            >
              <LogIn size={19} />
              Entrar
            </Link>

            <Link
              to="/cadastro"
              className="
                w-full
                min-h-[50px]
                mt-3
                border
                border-[#d8bdaa]
                text-[#70442d]
                font-bold
                rounded-2xl
                flex
                items-center
                justify-center
                transition
                hover:bg-[#fff2e8]
              "
            >
              Criar minha conta
            </Link>

          </section>

          {/* ADMIN */}

          <Link
            to="/admin"
            className="
              flex
              items-center
              justify-center
              gap-2
              mt-5
              pb-8
              text-sm
              font-bold
              text-[#806b5e]
            "
          >
            <ShieldCheck size={16} />
            Área administrativa
          </Link>

        </main>

      </div>

    );

  }

  /*
    ==========================
    USUÁRIO LOGADO
    ==========================
  */

  return (

    <div className="min-h-screen bg-[#f7f2ec]">

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
          pb-20
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
              mt-1
            "
          >
            Meu Perfil
          </h1>

          <p
            className="
              text-sm
              text-[#ead8ca]
              mt-2
            "
          >
            Seus dados, pedidos e endereços.
          </p>

        </div>

      </header>

      <main
        className="
          max-w-3xl
          mx-auto
          px-4
          -mt-11
          relative
          z-10
        "
      >

        {/* DADOS DO USUÁRIO */}

        <section
          className="
            bg-[#fffaf5]
            border
            border-[#eadbd0]
            rounded-3xl
            shadow-lg
            p-5
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
                w-16
                h-16
                shrink-0
                rounded-full
                bg-[#d86b24]
                text-white
                flex
                items-center
                justify-center
                shadow-md
              "
            >
              <UserRound size={29} />
            </div>

            <div className="min-w-0">

              <p
                className="
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-[#c45a1a]
                "
              >
                Olá!
              </p>

              <h2
                className="
                  text-xl
                  font-extrabold
                  text-[#35241b]
                  truncate
                "
              >
                {usuario.nome}
              </h2>

            </div>

          </div>

          <div
            className="
              border-t
              border-[#eadbd0]
              mt-5
              pt-4
              space-y-3
            "
          >

            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <Mail
                size={18}
                className="text-[#c45a1a]"
              />

              <span
                className="
                  text-sm
                  text-[#654f43]
                  break-all
                "
              >
                {usuario.email}
              </span>
            </div>

            <div>

  <div
    className="
      flex
      items-center
      gap-3
    "
  >

    <Phone
      size={18}
      className="text-[#c45a1a]"
    />

    <span
      className="
        flex-1
        text-sm
        text-[#654f43]
      "
    >

      {usuario.telefone
        ? formatarTelefone(
            usuario.telefone
          )
        : "Telefone não informado"}

    </span>

    {!editandoTelefone && (

      <button
        type="button"
        onClick={
          iniciarEdicaoTelefone
        }
        className="
          w-9
          h-9
          shrink-0
          rounded-xl
          bg-[#f3e2d4]
          text-[#c45a1a]
          flex
          items-center
          justify-center
          transition
          hover:bg-[#ead2c0]
        "
        title="Editar telefone"
      >

        <Pencil size={16} />

      </button>

    )}

  </div>

  {editandoTelefone && (

    <div
      className="
        mt-3
        ml-7
      "
    >

      <input
        type="tel"
        value={telefone}
        onChange={(event) =>
          setTelefone(
            formatarTelefone(
              event.target.value
            )
          )
        }
        placeholder="(38) 99999-9999"
        className="
          w-full
          h-[46px]
          px-4
          bg-white
          border
          border-[#dfcabc]
          rounded-xl
          outline-none
          text-sm
          text-[#453126]
          focus:border-[#d86b24]
        "
      />

      <div
        className="
          grid
          grid-cols-2
          gap-2
          mt-2
        "
      >

        <button
          type="button"
          onClick={
            cancelarEdicaoTelefone
          }
          disabled={
            salvandoTelefone
          }
          className="
            min-h-[42px]
            border
            border-[#d8bdaa]
            bg-white
            text-[#70442d]
            rounded-xl
            font-bold
            text-sm
            flex
            items-center
            justify-center
            gap-2
          "
        >

          <X size={16} />

          Cancelar

        </button>

        <button
          type="button"
          onClick={
            salvarTelefone
          }
          disabled={
            salvandoTelefone
          }
          className="
            min-h-[42px]
            bg-[#d86b24]
            text-white
            rounded-xl
            font-extrabold
            text-sm
            flex
            items-center
            justify-center
            gap-2
            disabled:opacity-60
          "
        >

          <Save size={16} />

          {salvandoTelefone
            ? "Salvando..."
            : "Salvar"}

        </button>

      </div>

    </div>

  )}

</div>

          </div>

        </section>

        {/* OPÇÕES */}

        <section className="mt-5 space-y-3">

          {/* ENDEREÇOS */}

          <Link
            to="/enderecos"
            className="
              bg-[#fffaf5]
              border
              border-[#eadbd0]
              rounded-2xl
              p-4
              shadow-sm
              flex
              items-center
              gap-4
              transition
              hover:shadow-md
            "
          >

            <div
              className="
                w-11
                h-11
                shrink-0
                rounded-2xl
                bg-[#f3e2d4]
                text-[#c45a1a]
                flex
                items-center
                justify-center
              "
            >
              <MapPin size={21} />
            </div>

            <div className="flex-1">

              <h3
                className="
                  font-extrabold
                  text-[#35241b]
                "
              >
                Meus Endereços
              </h3>

              <p
                className="
                  text-xs
                  text-[#806b5e]
                  mt-0.5
                "
              >
                Gerencie seus locais de entrega
              </p>

            </div>

            <ChevronRight
              size={20}
              className="text-[#a89184]"
            />

          </Link>

          {/* PEDIDOS */}

          <Link
            to="/pedidos"
            className="
              bg-[#fffaf5]
              border
              border-[#eadbd0]
              rounded-2xl
              p-4
              shadow-sm
              flex
              items-center
              gap-4
              transition
              hover:shadow-md
            "
          >

            <div
              className="
                w-11
                h-11
                shrink-0
                rounded-2xl
                bg-[#f3e2d4]
                text-[#c45a1a]
                flex
                items-center
                justify-center
              "
            >
              <ClipboardList size={21} />
            </div>

            <div className="flex-1">

              <h3
                className="
                  font-extrabold
                  text-[#35241b]
                "
              >
                Meus Pedidos
              </h3>

              <p
                className="
                  text-xs
                  text-[#806b5e]
                  mt-0.5
                "
              >
                Veja pedidos e acompanhe o status
              </p>

            </div>

            <ChevronRight
              size={20}
              className="text-[#a89184]"
            />

          </Link>

        </section>

        {/* DELIVERY DA ALÊ */}

        <section
          className="
            bg-[#f1e2d5]
            rounded-2xl
            p-4
            mt-5
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              w-10
              h-10
              shrink-0
              rounded-xl
              bg-[#5a3520]
              text-white
              flex
              items-center
              justify-center
            "
          >
            <UtensilsCrossed size={19} />
          </div>

          <div>

            <p
              className="
                font-bold
                text-[#453126]
                text-sm
              "
            >
              Delivery da Alê
            </p>

            <p
              className="
                text-xs
                text-[#806b5e]
              "
            >
              Comida caseira feita com carinho.
            </p>

          </div>

        </section>

        {/* SAIR */}

        <button
          type="button"
          onClick={sair}
          className="
            w-full
            min-h-[52px]
            mt-5
            mb-6
            border
            border-[#d4b7a4]
            bg-[#fffaf5]
            text-[#a6472b]
            font-extrabold
            rounded-2xl
            flex
            items-center
            justify-center
            gap-2
            transition
            hover:bg-[#f8e9df]
          "
        >
          <LogOut size={19} />
          Sair da conta
        </button>

      </main>

    </div>

  );
}