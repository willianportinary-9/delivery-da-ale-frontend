import {
  useContext,
  useState
} from "react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
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

export default function Cadastro() {

  const navigate = useNavigate();
  const location = useLocation();

  const destino =
    location.state?.from || "/";

  const { login } =
    useContext(AuthContext);

  const [nome, setNome] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [telefone, setTelefone] =
    useState("");

  const [senha, setSenha] =
    useState("");

  const [confirmarSenha,
    setConfirmarSenha] =
    useState("");

  const [mostrarSenha,
    setMostrarSenha] =
    useState(false);

  const [carregando,
    setCarregando] =
    useState(false);

  function formatarTelefone(valor) {

    const numeros =
      valor.replace(/\D/g, "")
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

  async function cadastrar(event) {

    event.preventDefault();

    if (!nome.trim()) {

      toast.error(
        "Informe seu nome."
      );

      return;

    }

    if (!email.trim()) {

      toast.error(
        "Informe seu e-mail."
      );

      return;

    }

    const telefoneLimpo =
      telefone.replace(/\D/g, "");

    if (
      telefoneLimpo.length < 10 ||
      telefoneLimpo.length > 11
    ) {

      toast.error(
        "Informe o telefone com DDD."
      );

      return;

    }

    if (senha.length < 6) {

      toast.error(
        "A senha deve ter pelo menos 6 caracteres."
      );

      return;

    }

    if (
      senha !== confirmarSenha
    ) {

      toast.error(
        "As senhas não coincidem."
      );

      return;

    }

    try {

      setCarregando(true);

      // 1. Cria a conta
      await api.post(
        "/usuarios/cadastro",
        {
          nome:
            nome.trim(),

          email:
            email.trim(),

          telefone:
            telefoneLimpo,

          senha
        }
      );

      // 2. Faz login automaticamente
      const responseLogin =
        await api.post(
          "/usuarios/login",
          {
            email:
              email.trim(),

            senha
          }
        );

      const {
        token,
        usuario
      } = responseLogin.data;

      if (!token || !usuario) {

        toast.error(
          "Conta criada, mas não foi possível iniciar a sessão automaticamente."
        );

        navigate(
          "/login",
          {
            replace: true,
            state: {
              from: destino
            }
          }
        );

        return;
      }

      // 3. Salva a sessão no AuthContext/localStorage
      login(
        usuario,
        token
      );

      toast.success(
        `Bem-vindo, ${usuario.nome}!`
      );

      // 4. Retorna para a página em que estava
      navigate(
        destino,
        {
          replace: true
        }
      );

    } catch (error) {

      console.error(
        "Erro no cadastro:",
        error
      );

      const mensagem =
        error.response?.data
          ?.mensagem ||
        "Não foi possível realizar o cadastro.";

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

      {/* TOPO */}

      <header
        className="
          relative
          overflow-hidden
          bg-gradient-to-br
          from-[#3b2416]
          via-[#5a3520]
          to-[#2a1810]
          text-white
          px-6
          pt-9
          pb-24
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
            max-w-md
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
                  uppercase
                  tracking-[0.2em]
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

          <div className="mt-8">

            <h2
              className="
                text-3xl
                font-extrabold
              "
            >
              Crie sua conta
            </h2>

            <p
              className="
                mt-2
                text-sm
                text-[#ead8ca]
              "
            >
              Cadastre-se para fazer
              e acompanhar seus pedidos.
            </p>

          </div>

        </div>

      </header>

      {/* FORMULÁRIO */}

      <main
        className="
          px-4
          -mt-14
          relative
          z-10
          pb-8
        "
      >

        <form
          onSubmit={cadastrar}
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
            Cadastro
          </h2>

          <p
            className="
              text-sm
              text-[#806b5e]
              mt-1
              mb-6
            "
          >
            Leva só alguns segundos.
          </p>

          {/* NOME */}

          <label
            className="
              block
              text-sm
              font-bold
              text-[#59453a]
              mb-2
            "
          >
            Nome
          </label>

          <div className="relative mb-4">

            <UserRound
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
              type="text"
              value={nome}
              onChange={(event) =>
                setNome(
                  event.target.value
                )
              }
              placeholder="Seu nome"
              autoComplete="name"
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
                focus:border-[#d86b24]
                focus:ring-2
                focus:ring-[#d86b24]/10
              "
            />

          </div>

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

          <div className="relative mb-4">

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
                focus:border-[#d86b24]
                focus:ring-2
                focus:ring-[#d86b24]/10
              "
            />

          </div>

          {/* TELEFONE */}

          <label
            className="
              block
              text-sm
              font-bold
              text-[#59453a]
              mb-2
            "
          >
            Telefone
          </label>

          <div className="relative mb-4">

            <Phone
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
              autoComplete="tel"
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
                focus:border-[#d86b24]
                focus:ring-2
                focus:ring-[#d86b24]/10
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

          <div className="relative mb-4">

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
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
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
                focus:border-[#d86b24]
                focus:ring-2
                focus:ring-[#d86b24]/10
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

          {/* CONFIRMAR SENHA */}

          <label
            className="
              block
              text-sm
              font-bold
              text-[#59453a]
              mb-2
            "
          >
            Confirmar senha
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
              value={confirmarSenha}
              onChange={(event) =>
                setConfirmarSenha(
                  event.target.value
                )
              }
              placeholder="Digite novamente"
              autoComplete="new-password"
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
                focus:border-[#d86b24]
                focus:ring-2
                focus:ring-[#d86b24]/10
              "
            />

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
              text-white
              font-extrabold
              rounded-2xl
              shadow-lg
              transition
            "
          >
            {carregando
              ? "Criando conta..."
              : "Criar minha conta"}
          </button>

          {/* LOGIN */}

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
              Já possui uma conta?
            </p>

            <Link
              to="/login"
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
              Fazer login
            </Link>

          </div>

        </form>

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
          "
        >
          Voltar para o cardápio
        </Link>

      </main>

    </div>

  );
}