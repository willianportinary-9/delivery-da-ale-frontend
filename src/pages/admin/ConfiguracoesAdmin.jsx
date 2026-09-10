import {
  useEffect,
  useState
} from "react";

import {
  Clock3,
  LockKeyhole,
  Mail,
  MessageSquare,
  Phone,
  QrCode,
  RefreshCw,
  Save,
  Settings,
  Store,
  Truck
} from "lucide-react";

import toast from "react-hot-toast";

import api from "../../services/api";

export default function ConfiguracoesAdmin() {

  const [carregando, setCarregando] =
    useState(true);

  const [salvando, setSalvando] =
    useState(false);

    const [
  carregandoConta,
  setCarregandoConta
] = useState(true);

const [
  salvandoConta,
  setSalvandoConta
] = useState(false);

const [
  contaAdmin,
  setContaAdmin
] = useState(null);

const [
  formSeguranca,
  setFormSeguranca
] = useState({
  novoEmail: "",
  senhaAtual: "",
  novaSenha: "",
  confirmarNovaSenha: ""
});

  const [form, setForm] =
    useState({
      nomeLoja: "",
      whatsapp: "",
      pixChave: "",
      pixNome: "",
      taxaEntrega: "3",
      horarioAbertura: "10:00",
      horarioFechamento: "14:00",
      lojaAberta: true,
      avisoAtivo: true,
      aviso: ""
    });

  useEffect(() => {
    carregarConfiguracoes();

    carregarContaAdmin();
  }, []);

  async function carregarConfiguracoes() {

    try {

      setCarregando(true);

      const response =
        await api.get(
          "/configuracoes"
        );

      const dados =
        response.data;

      setForm({
        nomeLoja:
          dados.nomeLoja || "",
        whatsapp:
          dados.whatsapp || "",
        pixChave:
          dados.pixChave || "",
        pixNome:
          dados.pixNome || "",
        taxaEntrega:
          String(
            dados.taxaEntrega ?? 3
          ),
        horarioAbertura:
          dados.horarioAbertura ||
          "10:00",
        horarioFechamento:
          dados.horarioFechamento ||
          "14:00",
        lojaAberta:
          dados.lojaAberta !== false,
        avisoAtivo:
          dados.avisoAtivo !== false,
        aviso:
          dados.aviso || ""
      });

    } catch (error) {

      console.error(
        "Erro ao carregar configurações:",
        error
      );

      toast.error(
        "Não foi possível carregar as configurações."
      );

    } finally {

      setCarregando(false);

    }

  }

  function alterarCampo(
    campo,
    valor
  ) {

    setForm((anterior) => ({
      ...anterior,
      [campo]: valor
    }));

  }

  async function salvar(event) {

    event.preventDefault();

    try {

      setSalvando(true);

      await api.put(
        "/configuracoes",
        {
          ...form,

          taxaEntrega:
            Number(
              String(
                form.taxaEntrega
              ).replace(",", ".")
            )
        }
      );

      toast.success(
        "Configurações salvas com sucesso."
      );

      await carregarConfiguracoes();

    } catch (error) {

      console.error(
        "Erro ao salvar configurações:",
        error
      );

      toast.error(
        error.response?.data?.mensagem ||
        "Não foi possível salvar."
      );

    } finally {

      setSalvando(false);

    }

  }

  async function carregarContaAdmin() {

  try {

    setCarregandoConta(true);

    const response =
      await api.get(
        "/usuarios/admin/conta"
      );

    setContaAdmin(
      response.data.usuario
    );

  } catch (error) {

    console.error(
      "Erro ao carregar conta do administrador:",
      error
    );

    toast.error(
      error.response?.data?.mensagem ||
      "Não foi possível carregar os dados da conta."
    );

  } finally {

    setCarregandoConta(false);

  }

}

function alterarCampoSeguranca(
  campo,
  valor
) {

  setFormSeguranca(
    (anterior) => ({
      ...anterior,
      [campo]: valor
    })
  );

}

async function salvarConta(event) {

  event.preventDefault();

  const novoEmail =
    formSeguranca.novoEmail
      .trim();

  const senhaAtual =
    formSeguranca.senhaAtual;

  const novaSenha =
    formSeguranca.novaSenha;

  const confirmarNovaSenha =
    formSeguranca
      .confirmarNovaSenha;

  if (!senhaAtual) {

    toast.error(
      "Informe sua senha atual."
    );

    return;
  }

  const vaiTrocarSenha =
    novaSenha.length > 0 ||
    confirmarNovaSenha.length > 0;

  if (
    !novoEmail &&
    !vaiTrocarSenha
  ) {

    toast.error(
      "Informe um novo e-mail ou uma nova senha."
    );

    return;
  }

  if (vaiTrocarSenha) {

    if (novaSenha.length < 6) {

      toast.error(
        "A nova senha deve ter pelo menos 6 caracteres."
      );

      return;
    }

    if (
      novaSenha !==
      confirmarNovaSenha
    ) {

      toast.error(
        "A confirmação da nova senha não confere."
      );

      return;
    }

  }

  try {

    setSalvandoConta(true);

    const response =
      await api.put(
        "/usuarios/admin/conta",
        {
          novoEmail,
          senhaAtual,
          novaSenha,
          confirmarNovaSenha
        }
      );

    setContaAdmin(
      response.data.usuario
    );

    setFormSeguranca({
      novoEmail: "",
      senhaAtual: "",
      novaSenha: "",
      confirmarNovaSenha: ""
    });

    toast.success(
      "Dados de acesso atualizados com sucesso!"
    );

  } catch (error) {

    console.error(
      "Erro ao atualizar conta:",
      error
    );

    toast.error(
      error.response?.data?.mensagem ||
      "Não foi possível atualizar os dados."
    );

  } finally {

    setSalvandoConta(false);

  }

}
  
  
  if (carregando) {

    return (

      <div
        className="
          min-h-[70vh]
          flex
          items-center
          justify-center
        "
      >

        <div className="text-center">

          <RefreshCw
            size={28}
            className="
              mx-auto
              text-[#d86b24]
              animate-spin
            "
          />

          <p
            className="
              mt-3
              text-sm
              font-bold
              text-[#806b5e]
            "
          >
            Carregando configurações...
          </p>

        </div>

      </div>

    );

  }

  return (

    <div
      className="
        p-4
        sm:p-6
        xl:p-8
      "
    >

      <div
        className="
          max-w-[1000px]
          mx-auto
        "
      >

        {/* CABEÇALHO */}

        <div>

          <p
            className="
              text-[#c45a1a]
              text-xs
              font-extrabold
              uppercase
              tracking-wider
            "
          >
            Administração
          </p>

          <h1
            className="
              text-2xl
              sm:text-3xl
              font-extrabold
              text-[#35241b]
              mt-1
            "
          >
            Configurações
          </h1>

          <p
            className="
              text-sm
              text-[#806b5e]
              mt-1
            "
          >
            Configure as informações
            gerais do Delivery da Alê.
          </p>

        </div>

        <form
          onSubmit={salvar}
          className="
            mt-6
            space-y-5
          "
        >

          {/* LOJA */}

          <section
            className="
              bg-[#fffaf5]
              border
              border-[#e5d5ca]
              rounded-3xl
              p-5
            "
          >

            <Titulo
              icone={Store}
              titulo="Loja"
              descricao="Informações gerais"
            />

            <Campo
              titulo="Nome da loja"
              value={form.nomeLoja}
              onChange={(valor) =>
                alterarCampo(
                  "nomeLoja",
                  valor
                )
              }
            />

            <div className="mt-4">

              <label
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  bg-[#f6ebe3]
                  p-4
                  rounded-2xl
                "
              >

                <div>

                  <p
                    className="
                      font-extrabold
                      text-[#453126]
                    "
                  >
                    Loja aberta
                  </p>

                  <p
                    className="
                      text-xs
                      text-[#806b5e]
                      mt-1
                    "
                  >
                    Controla se novos
                    pedidos podem ser feitos.
                  </p>

                </div>

                <input
                  type="checkbox"
                  checked={
                    form.lojaAberta
                  }
                  onChange={(event) =>
                    alterarCampo(
                      "lojaAberta",
                      event.target.checked
                    )
                  }
                  className="
                    w-5
                    h-5
                    accent-[#d86b24]
                  "
                />

              </label>

            </div>

          </section>

          {/* CONTATO */}

          <section
            className="
              bg-[#fffaf5]
              border
              border-[#e5d5ca]
              rounded-3xl
              p-5
            "
          >

            <Titulo
              icone={Phone}
              titulo="Contato"
              descricao="WhatsApp da loja"
            />

            <Campo
              titulo="WhatsApp"
              placeholder="Ex: 38999999999"
              value={form.whatsapp}
              onChange={(valor) =>
                alterarCampo(
                  "whatsapp",
                  valor
                )
              }
            />

          </section>

          {/* PIX */}

          <section
            className="
              bg-[#fffaf5]
              border
              border-[#e5d5ca]
              rounded-3xl
              p-5
            "
          >

            <Titulo
              icone={QrCode}
              titulo="PIX"
              descricao="Dados para pagamento"
            />

            <div
              className="
                grid
                sm:grid-cols-2
                gap-4
              "
            >

              <Campo
                titulo="Chave PIX"
                value={form.pixChave}
                onChange={(valor) =>
                  alterarCampo(
                    "pixChave",
                    valor
                  )
                }
              />

              <Campo
                titulo="Nome do recebedor"
                value={form.pixNome}
                onChange={(valor) =>
                  alterarCampo(
                    "pixNome",
                    valor
                  )
                }
              />

            </div>

          </section>

          {/* ENTREGA */}

          <section
            className="
              bg-[#fffaf5]
              border
              border-[#e5d5ca]
              rounded-3xl
              p-5
            "
          >

            <Titulo
              icone={Truck}
              titulo="Entrega"
              descricao="Valores de entrega"
            />

            <Campo
              titulo="Taxa de entrega (R$)"
              value={form.taxaEntrega}
              onChange={(valor) =>
                alterarCampo(
                  "taxaEntrega",
                  valor
                )
              }
              inputMode="decimal"
            />

          </section>

          {/* HORÁRIOS */}

          <section
            className="
              bg-[#fffaf5]
              border
              border-[#e5d5ca]
              rounded-3xl
              p-5
            "
          >

            <Titulo
              icone={Clock3}
              titulo="Horário"
              descricao="Funcionamento da loja"
            />

            <div
              className="
                grid
                grid-cols-2
                gap-4
              "
            >

              <div>

                <label
                  className="
                    text-xs
                    font-bold
                    text-[#654f43]
                  "
                >
                  Abertura
                </label>

                <input
                  type="time"
                  value={
                    form.horarioAbertura
                  }
                  onChange={(event) =>
                    alterarCampo(
                      "horarioAbertura",
                      event.target.value
                    )
                  }
                  className="
                    w-full
                    h-[48px]
                    mt-2
                    px-4
                    bg-white
                    border
                    border-[#dfcabc]
                    rounded-xl
                    outline-none
                    focus:border-[#d86b24]
                  "
                />

              </div>

              <div>

                <label
                  className="
                    text-xs
                    font-bold
                    text-[#654f43]
                  "
                >
                  Fechamento
                </label>

                <input
                  type="time"
                  value={
                    form.horarioFechamento
                  }
                  onChange={(event) =>
                    alterarCampo(
                      "horarioFechamento",
                      event.target.value
                    )
                  }
                  className="
                    w-full
                    h-[48px]
                    mt-2
                    px-4
                    bg-white
                    border
                    border-[#dfcabc]
                    rounded-xl
                    outline-none
                    focus:border-[#d86b24]
                  "
                />

              </div>

            </div>

          </section>

          {/* AVISO */}

          <section
            className="
              bg-[#fffaf5]
              border
              border-[#e5d5ca]
              rounded-3xl
              p-5
            "
          >

            <Titulo
              icone={MessageSquare}
              titulo="Aviso"
              descricao="Mensagem para os clientes"
            />

            <label
              className="
                flex
                items-center
                justify-between
                gap-4
                bg-[#f6ebe3]
                p-4
                rounded-2xl
                mb-4
              "
            >
              <div>
                <p
                  className="
                    font-extrabold
                    text-[#453126]
                  "
                >
                  Exibir aviso
                </p>

                <p
                  className="
                    text-xs
                    text-[#806b5e]
                    mt-1
                  "
                >
                  Ative ou desative a mensagem para os clientes.
                </p>
              </div>

              <input
                type="checkbox"
                checked={form.avisoAtivo}
                onChange={(event) =>
                  alterarCampo(
                    "avisoAtivo",
                    event.target.checked
                  )
                }
                className="
                  w-5
                  h-5
                  accent-[#d86b24]
                "
              />
            </label>

            <textarea
              rows={4}
              value={form.aviso}
              onChange={(event) =>
                alterarCampo(
                  "aviso",
                  event.target.value
                )
              }
              placeholder="Ex: Hoje teremos atendimento até às 14h."
              className="
                w-full
                mt-4
                p-4
                bg-white
                border
                border-[#dfcabc]
                rounded-xl
                resize-none
                outline-none
                focus:border-[#d86b24]
              "
            />

          </section>

          {/* SALVAR */}

          <button
            type="submit"
            disabled={salvando}
            className="
              w-full
              min-h-[52px]
              bg-[#d86b24]
              hover:bg-[#be5418]
              disabled:opacity-60
              text-white
              rounded-2xl
              font-extrabold
              flex
              items-center
              justify-center
              gap-2
            "
          >

            {salvando ? (

              <RefreshCw
                size={18}
                className="animate-spin"
              />

            ) : (

              <Save size={18} />

            )}

            {salvando
              ? "Salvando..."
              : "Salvar configurações"}

          </button>

        </form>

{/* SEGURANÇA DA CONTA */}

<section
  className="
    bg-[#fffaf5]
    border
    border-[#e5d5ca]
    rounded-3xl
    p-5
    mt-6
  "
>

  <Titulo
    icone={LockKeyhole}
    titulo="Segurança da conta"
    descricao="E-mail e senha do administrador"
  />

  {carregandoConta ? (

    <div
      className="
        py-8
        text-center
      "
    >

      <RefreshCw
        size={24}
        className="
          mx-auto
          text-[#d86b24]
          animate-spin
        "
      />

      <p
        className="
          mt-3
          text-sm
          font-bold
          text-[#806b5e]
        "
      >
        Carregando dados da conta...
      </p>

    </div>

  ) : (

    <>

      {/* E-MAIL ATUAL */}

      <div
        className="
          bg-[#f6ebe3]
          rounded-2xl
          p-4
        "
      >

        <p
          className="
            text-xs
            font-bold
            text-[#806b5e]
          "
        >
          E-mail atual
        </p>

        <div
          className="
            flex
            items-center
            gap-2
            mt-2
          "
        >

          <Mail
            size={18}
            className="text-[#c45a1a]"
          />

          <span
            className="
              text-sm
              font-bold
              text-[#453126]
              break-all
            "
          >
            {contaAdmin?.email ||
              "Não informado"}
          </span>

        </div>

      </div>

      <form
        onSubmit={salvarConta}
        className="
          mt-5
          space-y-4
        "
      >

        <Campo
          titulo="Novo e-mail"
          type="email"
          placeholder="Digite apenas se quiser alterar"
          value={
            formSeguranca.novoEmail
          }
          onChange={(valor) =>
            alterarCampoSeguranca(
              "novoEmail",
              valor
            )
          }
        />

        <Campo
          titulo="Senha atual"
          type="password"
          placeholder="Obrigatória para confirmar"
          value={
            formSeguranca.senhaAtual
          }
          onChange={(valor) =>
            alterarCampoSeguranca(
              "senhaAtual",
              valor
            )
          }
        />

        <div
          className="
            grid
            sm:grid-cols-2
            gap-4
          "
        >

          <Campo
            titulo="Nova senha"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={
              formSeguranca.novaSenha
            }
            onChange={(valor) =>
              alterarCampoSeguranca(
                "novaSenha",
                valor
              )
            }
          />

          <Campo
            titulo="Confirmar nova senha"
            type="password"
            placeholder="Repita a nova senha"
            value={
              formSeguranca
                .confirmarNovaSenha
            }
            onChange={(valor) =>
              alterarCampoSeguranca(
                "confirmarNovaSenha",
                valor
              )
            }
          />

        </div>

        <div
          className="
            bg-[#fff4e8]
            border
            border-[#efd4bd]
            rounded-2xl
            p-4
          "
        >

          <p
            className="
              text-xs
              text-[#755340]
              leading-relaxed
            "
          >
            Para alterar o e-mail ou
            a senha, informe sua senha
            atual. Se não quiser alterar
            um dos campos, deixe-o vazio.
          </p>

        </div>

        <button
          type="submit"
          disabled={salvandoConta}
          className="
            w-full
            min-h-[52px]
            bg-[#5a3520]
            hover:bg-[#452819]
            disabled:opacity-60
            text-white
            rounded-2xl
            font-extrabold
            flex
            items-center
            justify-center
            gap-2
          "
        >

          {salvandoConta ? (

            <RefreshCw
              size={18}
              className="animate-spin"
            />

          ) : (

            <LockKeyhole
              size={18}
            />

          )}

          {salvandoConta
            ? "Atualizando..."
            : "Atualizar conta"}

        </button>

      </form>

    </>

  )}

</section>


      </div>

    </div>

  );

}

function Titulo({
  icone: Icone,
  titulo,
  descricao
}) {

  return (

    <div
      className="
        flex
        items-center
        gap-3
        mb-5
      "
    >

      <div
        className="
          w-11
          h-11
          bg-[#f1e2d5]
          text-[#c45a1a]
          rounded-2xl
          flex
          items-center
          justify-center
        "
      >
        <Icone size={21} />
      </div>

      <div>

        <h2
          className="
            font-extrabold
            text-[#35241b]
          "
        >
          {titulo}
        </h2>

        <p
          className="
            text-xs
            text-[#806b5e]
          "
        >
          {descricao}
        </p>

      </div>

    </div>

  );

}

function Campo({
  titulo,
  value,
  onChange,
  placeholder = "",
  inputMode,
  type = "text"
}) {

  return (

    <div>

      <label
        className="
          text-xs
          font-bold
          text-[#654f43]
        "
      >
        {titulo}
      </label>

      <input
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        type={type}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="
          w-full
          h-[48px]
          mt-2
          px-4
          bg-white
          border
          border-[#dfcabc]
          rounded-xl
          outline-none
          focus:border-[#d86b24]
        "
      />

    </div>

  );

}