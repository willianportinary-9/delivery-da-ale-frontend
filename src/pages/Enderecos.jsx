import {
  useContext,
  useEffect,
  useState
} from "react";

import {
  ArrowLeft,
  Check,
  Home,
  LocateFixed,
  MapPin,
  Plus,
  X
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Enderecos() {

  const navigate = useNavigate();
  const location = useLocation();

  const destino =
    location.state?.from || null;

  const { usuario, token } =
    useContext(AuthContext);

  const [enderecos, setEnderecos] =
    useState([]);

  const [carregando, setCarregando] =
    useState(true);

  const [mostrarFormulario,
    setMostrarFormulario] =
    useState(false);

  const [salvando, setSalvando] =
    useState(false);

  const [buscandoLocalizacao,
    setBuscandoLocalizacao] =
    useState(false);

  const [form, setForm] = useState({
    nome: "Casa",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "Porteirinha",
    complemento: "",
    referencia: "",
    latitude: null,
    longitude: null
  });

  useEffect(() => {

    if (!token || !usuario) {

      toast.error(
        "Faça login para acessar seus endereços."
      );

      navigate("/login", {
        replace: true,
        state: {
          from:
            destino ||
            "/enderecos"
        }
      });

      return;
    }

    carregarEnderecos();

  }, []);

  async function carregarEnderecos() {

    try {

      setCarregando(true);

      const response =
        await api.get("/enderecos");

      const lista =
        Array.isArray(response.data)
          ? response.data
          : response.data.enderecos || [];

      setEnderecos(lista);

      /*
        Se não tiver nenhum endereço,
        já abre o formulário.
      */

      if (lista.length === 0) {
        setMostrarFormulario(true);
      }

    } catch (error) {

      console.error(
        "Erro ao carregar endereços:",
        error
      );

      toast.error(
        "Não foi possível carregar seus endereços."
      );

    } finally {

      setCarregando(false);

    }
  }

  function alterarCampo(event) {

    const {
      name,
      value
    } = event.target;

    setForm((anterior) => ({
      ...anterior,
      [name]: value
    }));

  }

  function pegarLocalizacao() {

    if (!navigator.geolocation) {

      toast.error(
        "Seu navegador não possui suporte à localização."
      );

      return;
    }

    setBuscandoLocalizacao(true);

    navigator.geolocation.getCurrentPosition(

      (position) => {

        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        setForm((anterior) => ({
          ...anterior,
          latitude,
          longitude
        }));

        toast.success(
          "Localização capturada!"
        );

        setBuscandoLocalizacao(false);

      },

      (error) => {

        console.error(
          "Erro de localização:",
          error
        );

        toast.error(
          "Não foi possível obter sua localização."
        );

        setBuscandoLocalizacao(false);

      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }

    );

  }

  async function salvarEndereco(event) {

    event.preventDefault();

    if (!form.rua.trim()) {

      toast.error(
        "Informe a rua."
      );

      return;
    }

    if (!form.numero.trim()) {

      toast.error(
        "Informe o número."
      );

      return;
    }

    if (!form.bairro.trim()) {

      toast.error(
        "Informe o bairro."
      );

      return;
    }

    if (!form.cidade.trim()) {

      toast.error(
        "Informe a cidade."
      );

      return;
    }

    try {

      setSalvando(true);

      const dados = {
        nome:
          form.nome.trim() ||
          "Casa",

        rua:
          form.rua.trim(),

        numero:
          form.numero.trim(),

        bairro:
          form.bairro.trim(),

        cidade:
          form.cidade.trim(),

        complemento:
          form.complemento.trim(),

        referencia:
          form.referencia.trim(),

        latitude:
          form.latitude,

        longitude:
          form.longitude
      };

      await api.post(
        "/enderecos",
        dados
      );

      toast.success(
        "Endereço cadastrado!"
      );

      setForm({
        nome: "Casa",
        rua: "",
        numero: "",
        bairro: "",
        cidade: "Porteirinha",
        complemento: "",
        referencia: "",
        latitude: null,
        longitude: null
      });

      setMostrarFormulario(false);

      /*
        Se o cliente veio do Checkout,
        retorna automaticamente para continuar
        a finalização do pedido.
      */

      if (destino === "/checkout") {

        navigate(
          "/checkout",
          {
            replace: true
          }
        );

        return;
      }

      await carregarEnderecos();

    } catch (error) {

      console.error(
        "Erro ao cadastrar endereço:",
        error
      );

      const mensagem =
        error.response?.data?.mensagem ||
        "Não foi possível cadastrar o endereço.";

      toast.error(mensagem);

    } finally {

      setSalvando(false);

    }
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
          pt-6
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

        <div
          className="
            relative
            max-w-3xl
            mx-auto
          "
        >

          <button
            type="button"
            onClick={() => {

              if (destino) {

                navigate(
                  destino,
                  {
                    replace: true
                  }
                );

                return;
              }

              navigate(-1);
            }}
            className="
              flex
              items-center
              gap-1
              text-sm
              text-[#ead8ca]
            "
          >
            <ArrowLeft size={18} />
            Voltar
          </button>

          <div
            className="
              flex
              items-center
              gap-3
              mt-6
            "
          >

            <div
              className="
                w-11
                h-11
                bg-[#d86b24]
                rounded-2xl
                flex
                items-center
                justify-center
              "
            >
              <MapPin size={22} />
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
                Meus Endereços
              </h1>

            </div>

          </div>

        </div>

      </header>

      <main
        className="
          max-w-3xl
          mx-auto
          px-4
          py-5
        "
      >

        {/* LISTA */}

        {carregando ? (

          <div
            className="
              text-center
              py-12
              text-[#806b5e]
            "
          >
            Carregando endereços...
          </div>

        ) : (

          <>
            {enderecos.length > 0 && (

              <section className="space-y-3">

                {enderecos.map(
                  (endereco) => (

                    <div
                      key={endereco._id}
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
                          items-start
                          gap-3
                        "
                      >

                        <div
                          className="
                            w-11
                            h-11
                            rounded-2xl
                            bg-[#f3e2d4]
                            text-[#c45a1a]
                            flex
                            items-center
                            justify-center
                            shrink-0
                          "
                        >
                          <Home size={20} />
                        </div>

                        <div className="flex-1">

                          <div
                            className="
                              flex
                              flex-wrap
                              items-center
                              gap-2
                            "
                          >

                            <h2
                              className="
                                font-extrabold
                                text-[#35241b]
                              "
                            >
                              {endereco.nome ||
                                "Endereço"}
                            </h2>

                            {endereco.principal && (

                              <span
                                className="
                                  flex
                                  items-center
                                  gap-1
                                  text-[10px]
                                  font-bold
                                  bg-[#d86b24]
                                  text-white
                                  px-2
                                  py-1
                                  rounded-full
                                "
                              >
                                <Check size={11} />
                                Principal
                              </span>

                            )}

                          </div>

                          <p
                            className="
                              mt-2
                              text-sm
                              font-semibold
                              text-[#59453a]
                            "
                          >
                            {endereco.rua},{" "}
                            {endereco.numero}
                          </p>

                          <p
                            className="
                              text-sm
                              text-[#806b5e]
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
                                text-[#927d70]
                                mt-1
                              "
                            >
                              {endereco.complemento}
                            </p>

                          )}

                          {endereco.referencia && (

                            <p
                              className="
                                text-xs
                                text-[#927d70]
                                mt-1
                              "
                            >
                              Referência:{" "}
                              {
                                endereco.referencia
                              }
                            </p>

                          )}

                          {endereco.latitude &&
                            endereco.longitude && (

                            <div
                              className="
                                flex
                                items-center
                                gap-1
                                mt-3
                                text-xs
                                font-semibold
                                text-[#4d7c58]
                              "
                            >
                              <LocateFixed
                                size={14}
                              />

                              Localização salva
                            </div>

                          )}

                        </div>

                      </div>

                    </div>

                  )
                )}

              </section>

            )}

            {/* NOVO ENDEREÇO */}

            {!mostrarFormulario && (

              <button
                type="button"
                onClick={() =>
                  setMostrarFormulario(
                    true
                  )
                }
                className="
                  w-full
                  mt-4
                  min-h-[52px]
                  border-2
                  border-dashed
                  border-[#d7b9a5]
                  rounded-2xl
                  text-[#b6501a]
                  font-extrabold
                  flex
                  items-center
                  justify-center
                  gap-2
                  bg-[#fffaf5]
                "
              >
                <Plus size={19} />
                Adicionar endereço
              </button>

            )}

          </>
        )}

        {/* FORMULÁRIO */}

        {mostrarFormulario && (

          <form
            onSubmit={salvarEndereco}
            className="
              bg-[#fffaf5]
              border
              border-[#eadbd0]
              rounded-3xl
              p-5
              shadow-sm
              mt-4
            "
          >

            <div
              className="
                flex
                items-center
                justify-between
                mb-5
              "
            >

              <div>

                <p
                  className="
                    text-[10px]
                    uppercase
                    tracking-wider
                    font-bold
                    text-[#c45a1a]
                  "
                >
                  Novo local
                </p>

                <h2
                  className="
                    text-xl
                    font-extrabold
                    text-[#35241b]
                  "
                >
                  Cadastrar endereço
                </h2>

              </div>

              {enderecos.length > 0 && (

                <button
                  type="button"
                  onClick={() =>
                    setMostrarFormulario(
                      false
                    )
                  }
                  className="
                    w-9
                    h-9
                    rounded-full
                    bg-[#f3e7dd]
                    flex
                    items-center
                    justify-center
                    text-[#6d5548]
                  "
                >
                  <X size={18} />
                </button>

              )}

            </div>

            {/* NOME */}

            <label className="text-sm font-bold text-[#59453a]">
              Nome do endereço
            </label>

            <input
              name="nome"
              value={form.nome}
              onChange={alterarCampo}
              placeholder="Ex: Casa, Trabalho"
              className="
                w-full
                mt-2
                mb-4
                border
                border-[#dfcabc]
                rounded-2xl
                px-4
                py-3
                outline-none
                focus:border-[#d86b24]
              "
            />

            {/* RUA */}

            <label className="text-sm font-bold text-[#59453a]">
              Rua
            </label>

            <input
              name="rua"
              value={form.rua}
              onChange={alterarCampo}
              placeholder="Nome da rua"
              className="
                w-full
                mt-2
                mb-4
                border
                border-[#dfcabc]
                rounded-2xl
                px-4
                py-3
                outline-none
                focus:border-[#d86b24]
              "
            />

            {/* NUMERO E BAIRRO */}

            <div
              className="
                grid
                grid-cols-[110px_1fr]
                gap-3
              "
            >

              <div>

                <label className="text-sm font-bold text-[#59453a]">
                  Número
                </label>

                <input
                  name="numero"
                  value={form.numero}
                  onChange={alterarCampo}
                  placeholder="120"
                  className="
                    w-full
                    mt-2
                    border
                    border-[#dfcabc]
                    rounded-2xl
                    px-4
                    py-3
                    outline-none
                    focus:border-[#d86b24]
                  "
                />

              </div>

              <div>

                <label className="text-sm font-bold text-[#59453a]">
                  Bairro
                </label>

                <input
                  name="bairro"
                  value={form.bairro}
                  onChange={alterarCampo}
                  placeholder="Centro"
                  className="
                    w-full
                    mt-2
                    border
                    border-[#dfcabc]
                    rounded-2xl
                    px-4
                    py-3
                    outline-none
                    focus:border-[#d86b24]
                  "
                />

              </div>

            </div>

            {/* CIDADE */}

            <div className="mt-4">

              <label className="text-sm font-bold text-[#59453a]">
                Cidade
              </label>

              <input
                name="cidade"
                value={form.cidade}
                onChange={alterarCampo}
                className="
                  w-full
                  mt-2
                  border
                  border-[#dfcabc]
                  rounded-2xl
                  px-4
                  py-3
                  outline-none
                  focus:border-[#d86b24]
                "
              />

            </div>

            {/* COMPLEMENTO */}

            <div className="mt-4">

              <label className="text-sm font-bold text-[#59453a]">
                Complemento
              </label>

              <input
                name="complemento"
                value={form.complemento}
                onChange={alterarCampo}
                placeholder="Opcional"
                className="
                  w-full
                  mt-2
                  border
                  border-[#dfcabc]
                  rounded-2xl
                  px-4
                  py-3
                  outline-none
                  focus:border-[#d86b24]
                "
              />

            </div>

            {/* REFERENCIA */}

            <div className="mt-4">

              <label className="text-sm font-bold text-[#59453a]">
                Ponto de referência
              </label>

              <input
                name="referencia"
                value={form.referencia}
                onChange={alterarCampo}
                placeholder="Ex: próximo à praça"
                className="
                  w-full
                  mt-2
                  border
                  border-[#dfcabc]
                  rounded-2xl
                  px-4
                  py-3
                  outline-none
                  focus:border-[#d86b24]
                "
              />

            </div>

            {/* GPS */}

            <button
              type="button"
              onClick={pegarLocalizacao}
              disabled={buscandoLocalizacao}
              className={`
                w-full
                mt-5
                p-4
                rounded-2xl
                border
                flex
                items-center
                gap-3
                text-left
                transition
                ${
                  form.latitude &&
                  form.longitude
                    ? `
                      border-[#84b391]
                      bg-[#eef8f0]
                    `
                    : `
                      border-[#dfcabc]
                      bg-[#fff7f0]
                    `
                }
              `}
            >

              <div
                className="
                  w-10
                  h-10
                  shrink-0
                  rounded-xl
                  bg-[#d86b24]
                  text-white
                  flex
                  items-center
                  justify-center
                "
              >
                <LocateFixed size={20} />
              </div>

              <div>

                <p
                  className="
                    font-extrabold
                    text-[#453126]
                    text-sm
                  "
                >
                  {buscandoLocalizacao
                    ? "Obtendo localização..."
                    : form.latitude &&
                      form.longitude
                      ? "Localização capturada"
                      : "Usar minha localização"}
                </p>

                <p
                  className="
                    text-xs
                    text-[#806b5e]
                    mt-0.5
                  "
                >
                  Ajuda o entregador a
                  encontrar você.
                </p>

              </div>

            </button>

            {/* SALVAR */}

            <button
              type="submit"
              disabled={salvando}
              className="
                w-full
                min-h-[54px]
                mt-5
                bg-[#d86b24]
                hover:bg-[#be5418]
                disabled:opacity-60
                text-white
                font-extrabold
                rounded-2xl
                shadow-lg
              "
            >
              {salvando
                ? "Salvando..."
                : "Salvar endereço"}
            </button>

          </form>

        )}

      </main>

    </div>
  );
}