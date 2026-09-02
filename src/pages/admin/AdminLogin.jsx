import {
  useContext,
  useState
} from "react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UtensilsCrossed
} from "lucide-react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../services/api";

import {
  AuthContext
} from "../../context/AuthContext";

export default function AdminLogin() {

  const navigate = useNavigate();

  const { login } =
    useContext(AuthContext);

  const [email, setEmail] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [mostrarSenha,
    setMostrarSenha] =
    useState(false);

  const [carregando,
    setCarregando] =
    useState(false);

  async function entrar(event) {

    event.preventDefault();

    if (!email.trim()) {

      toast.error(
        "Informe o e-mail."
      );

      return;
    }

    if (!senha) {

      toast.error(
        "Informe a senha."
      );

      return;
    }

    try {

      setCarregando(true);

      const response =
        await api.post(
          "/usuarios/login",
          {
            email: email.trim(),
            senha
          }
        );

      const {
        token,
        usuario
      } = response.data;

      if (!token || !usuario) {

        toast.error(
          "Não foi possível realizar o login."
        );

        return;
      }

      /*
        O login pode até estar correto,
        mas somente administradores
        entram no painel.
      */

      if (
        usuario.tipo !== "admin"
      ) {

        toast.error(
          "Acesso permitido apenas para administradores."
        );

        return;
      }

      /*
        Salva o JWT e o administrador
        no AuthContext.
      */

      login(
        usuario,
        token
      );

      toast.success(
        "Bem-vindo ao painel!"
      );

      navigate(
        "/admin/dashboard",
        {
          replace: true
        }
      );

    } catch (error) {

      console.error(
        "Erro no login admin:",
        error
      );

      const mensagem =
        error.response?.data
          ?.mensagem ||
        "E-mail ou senha inválidos.";

      toast.error(
        mensagem
      );

    } finally {

      setCarregando(false);

    }

  }

  return (

    <div
      className="
        min-h-screen
        bg-[#f3eee9]
        lg:grid
        lg:grid-cols-2
      "
    >

      {/* LADO VISUAL */}

      <section
        className="
          relative
          overflow-hidden
          bg-gradient-to-br
          from-[#2a1810]
          via-[#4b2c1b]
          to-[#1e110b]
          text-white
          px-7
          py-10
          lg:flex
          lg:flex-col
          lg:justify-between
          lg:min-h-screen
        "
      >

        {/* textura */}

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
            max-w-xl
            mx-auto
            lg:mx-0
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
                w-12
                h-12
                rounded-2xl
                bg-[#d86b24]
                flex
                items-center
                justify-center
                shadow-lg
              "
            >
              <UtensilsCrossed
                size={24}
              />
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
                Gestão
              </p>

              <h1
                className="
                  text-xl
                  font-extrabold
                "
              >
                Delivery da Alê
              </h1>

            </div>

          </div>

          <div
            className="
              mt-10
              lg:mt-32
            "
          >

            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-white/10
                border
                border-white/10
                flex
                items-center
                justify-center
              "
            >
              <ShieldCheck
                size={28}
              />
            </div>

            <h2
              className="
                text-3xl
                lg:text-5xl
                font-extrabold
                mt-5
                leading-tight
              "
            >
              Painel
              <br />
              Administrativo
            </h2>

            <p
              className="
                mt-4
                text-[#ddc9bc]
                max-w-md
                text-sm
                lg:text-base
              "
            >
              Gerencie pedidos,
              produtos e acompanhe
              o funcionamento do
              Delivery da Alê.
            </p>

          </div>

        </div>

        <p
          className="
            relative
            hidden
            lg:block
            text-xs
            text-[#b89a88]
          "
        >
          Área exclusiva para administradores.
        </p>

      </section>

      {/* LOGIN */}

      <section
        className="
          flex
          items-center
          justify-center
          px-4
          py-10
          lg:px-10
        "
      >

        <div
          className="
            w-full
            max-w-md
          "
        >

          <div className="mb-7">

            <p
              className="
                text-[#c45a1a]
                text-xs
                uppercase
                tracking-wider
                font-extrabold
              "
            >
              Acesso restrito
            </p>

            <h2
              className="
                text-3xl
                font-extrabold
                text-[#35241b]
                mt-1
              "
            >
              Entrar no painel
            </h2>

            <p
              className="
                text-sm
                text-[#806b5e]
                mt-2
              "
            >
              Use sua conta de administrador.
            </p>

          </div>

          <form
            onSubmit={entrar}
            className="
              bg-[#fffaf5]
              border
              border-[#eadbd0]
              rounded-3xl
              shadow-xl
              p-6
            "
          >

            {/* EMAIL */}

            <label
              className="
                block
                text-sm
                font-bold
                text-[#59453a]
                mb-2
              "
            >
              E-mail
            </label>

            <div
              className="
                relative
                mb-4
              "
            >

              <Mail
                size={19}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-[#a48a7a]
                "
              />

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="admin@email.com"
                autoComplete="email"
                className="
                  w-full
                  h-[52px]
                  bg-white
                  border
                  border-[#dfcabc]
                  rounded-2xl
                  pl-12
                  pr-4
                  outline-none
                  text-[#35241b]
                  focus:border-[#d86b24]
                  focus:ring-2
                  focus:ring-[#d86b24]/10
                  transition
                "
              />

            </div>

            {/* SENHA */}

            <label
              className="
                block
                text-sm
                font-bold
                text-[#59453a]
                mb-2
              "
            >
              Senha
            </label>

            <div className="relative">

              <LockKeyhole
                size={19}
                className="
                  absolute
                  left-4
                  top-1/2
                  -translate-y-1/2
                  text-[#a48a7a]
                "
              />

              <input
                type={
                  mostrarSenha
                    ? "text"
                    : "password"
                }
                value={senha}
                onChange={(event) =>
                  setSenha(
                    event.target.value
                  )
                }
                placeholder="Digite sua senha"
                autoComplete="current-password"
                className="
                  w-full
                  h-[52px]
                  bg-white
                  border
                  border-[#dfcabc]
                  rounded-2xl
                  pl-12
                  pr-12
                  outline-none
                  text-[#35241b]
                  focus:border-[#d86b24]
                  focus:ring-2
                  focus:ring-[#d86b24]/10
                  transition
                "
              />

              <button
                type="button"
                onClick={() =>
                  setMostrarSenha(
                    !mostrarSenha
                  )
                }
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-[#806b5e]
                "
              >

                {mostrarSenha ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}

              </button>

            </div>

            {/* ENTRAR */}

            <button
              type="submit"
              disabled={carregando}
              className="
                w-full
                min-h-[54px]
                mt-6
                bg-[#d86b24]
                hover:bg-[#be5418]
                active:scale-[0.99]
                disabled:opacity-60
                text-white
                font-extrabold
                rounded-2xl
                shadow-lg
                transition
              "
            >

              {carregando
                ? "Entrando..."
                : "Entrar no painel"}

            </button>

          </form>

          <Link
            to="/"
            className="
              block
              text-center
              text-sm
              font-bold
              text-[#806b5e]
              mt-5
            "
          >
            Voltar para o Delivery da Alê
          </Link>

        </div>

      </section>

    </div>

  );
}