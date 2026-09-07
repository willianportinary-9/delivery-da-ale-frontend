import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useLocation } from "react-router-dom";
import api from "../services/api";

function WhatsAppButton() {
  const [configuracoes, setConfiguracoes] = useState(null);
  const location = useLocation();

  useEffect(() => {
    async function carregarConfiguracoes() {
      try {
        const response = await api.get("/configuracoes");
        setConfiguracoes(response.data);
      } catch (error) {
        console.error(
          "Erro ao carregar WhatsApp da loja:",
          error
        );
      }
    }

    carregarConfiguracoes();
  }, []);

  if (location.pathname.startsWith("/pedidos")) {
    return null;
  }

  const numeroOriginal =
    configuracoes?.whatsapp || "";

  let numero = String(numeroOriginal).replace(/\D/g, "");

  if (!numero) {
    return null;
  }

  if (!numero.startsWith("55")) {
    numero = `55${numero}`;
  }

  const nomeLoja =
    configuracoes?.nomeLoja || "Delivery da Alê";

  const mensagem = encodeURIComponent(
    `Olá! Vim pelo ${nomeLoja} e gostaria de falar sobre um pedido.`
  );

  const link = `https://wa.me/${numero}?text=${mensagem}`;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a loja pelo WhatsApp"
      title="Falar com a loja pelo WhatsApp"
      className="
        fixed
        right-4
        bottom-24
        z-50
        flex
        items-center
        gap-2
        rounded-full
        bg-[#25D366]
        text-white
        shadow-xl
        border
        border-white/30
        px-4
        h-14
        font-extrabold
        transition
        hover:scale-105
        active:scale-95
      "
    >
      <MessageCircle
        size={25}
        strokeWidth={2.5}
      />

      <span className="hidden sm:inline">
        WhatsApp
      </span>
    </a>
  );
}

export default WhatsAppButton;
