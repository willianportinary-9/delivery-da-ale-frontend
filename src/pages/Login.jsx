import {
  useContext,
  useState
} from "react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UtensilsCrossed
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../services/api";

import {
  AuthContext
} from "../context/AuthContext";

export default function Login() {

  const navigate = useNavigate();
  const location = useLocation();
  const destino =
  location.state?.from || "/";

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

  async function fazerLogin(event) {

    event.preventDefault();

    if (!email.trim()) {

      toast.error(
        "Informe seu e-mail."
      );

      return;
    }

    if (!senha) {

      toast.error(
        "Informe sua senha."
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
        Salva o usuário e o token
        no AuthContext/localStorage
      */

      login(
        usuario,
        token
      );

      toast.success(
        `Bem-vindo, ${usuario.nome}!`
      );

      /*
        Volta para a página que o cliente
        tentou acessar antes do login.
      */

      navigate(
        destino,
        {
          replace: true
        }
      );

    } catch (error) {

      console.error(
        "Erro no login:",
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
        bg-[#f7f2ec]
      "
    >

      {/* PARTE SUPERIOR */}

      <div
        className="
          relative
          bg-gradient-to-br
          from-[#3b2416]
          via-[#5a3520]
          to-[#2a1810]
          text-white
          px-6
          pt-10
          pb-24
          overflow-hidden
        "
      >

        {/* efeito de madeira */}

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
            max-w-md
            mx-auto
          "
        >

          {/* LOGO */}

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
                bg-[#d86b24]
                rounded-2xl
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
                  tracking-[0.2em]
                  uppercase
                  text-[#edc5a5]
                "
              >
                Comida caseira
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

          {/* TEXTO */}

          <div className="mt-8">

            <h2
              className="
                text-3xl
                font-extrabold
              "
            >
              Bem-vindo de volta!
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-[#ead8ca]
              "
            >
              Entre para finalizar e
              acompanhar seus pedidos.
            </p>

          </div>

        </div>

      </div>

      {/* FORMULÁRIO */}

      <div
        className="
          px-4
          -mt-14
          relative
          z-10
        "
      >

        <form
          onSubmit={fazerLogin}
          className="
            max-w-md
            mx-auto
            bg-[#fffaf5]
            border
            border-[#eadbd0]
            rounded-3xl
            shadow-xl
            p-6
          "
        >

          <h2
            className="
              text-xl
              font-extrabold
              text-[#35241b]
            "
          >
            Entrar
          </h2>

          <p
            className="
              text-sm
              text-[#806b5e]
              mt-1
              mb-6
            "
          >
            Informe seus dados.
          </p>

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
              placeholder="seuemail@email.com"
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

          {/* BOTÃO */}

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
              disabled:cursor-not-allowed
              text-white
              font-extrabold
              rounded-2xl
              shadow-lg
              transition
            "
          >

            {carregando
              ? "Entrando..."
              : "Entrar"}

          </button>

          {/* CADASTRO */}

          <div
            className="
              text-center
              mt-6
              pt-5
              border-t
              border-[#eadbd0]
            "
          >

            <p
              className="
                text-sm
                text-[#806b5e]
              "
            >
              Ainda não possui conta?
            </p>

            <Link
              to="/cadastro"
              state={{
                from: destino
              }}
              className="
                inline-block
                mt-2
                text-[#c45a1a]
                font-extrabold
                text-sm
              "
            >
              Criar minha conta
            </Link>

          </div>

        </form>

        {/* VOLTAR */}

        <Link
          to="/"
          className="
            block
            max-w-md
            mx-auto
            text-center
            text-sm
            font-bold
            text-[#806b5e]
            mt-5
            pb-8
          "
        >
          Voltar para o cardápio
        </Link>

      </div>

    </div>

  );
}