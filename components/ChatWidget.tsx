"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Phone } from "lucide-react";

type Message = {
  from: "bot" | "user";
  text: string;
  actions?: Action[];
};

type Action = {
  label: string;
  value: string;
};

const WHATSAPP_NUMBER = "31"; // vul later in: bijv. "31612345678"
const PHONE_NUMBER = ""; // vul later in

const INITIAL: Message = {
  from: "bot",
  text: "Hallo! 👋 Welkom bij JG Mobility. Hoe kan ik je helpen?",
  actions: [
    { label: "Aanbod bekijken", value: "aanbod" },
    { label: "Auto verkopen (consignatie)", value: "consignatie" },
    { label: "Prijsinfo opvragen", value: "prijs" },
    { label: "Iets anders", value: "anders" },
  ],
};

const BOT_RESPONSES: Record<string, Message> = {
  aanbod: {
    from: "bot",
    text: "Ons aanbod vind je op de Aanbod-pagina. We hebben een selectie premium auto's beschikbaar. Wil je direct doorbladeren?",
    actions: [
      { label: "Naar het aanbod →", value: "goto_aanbod" },
      { label: "Nog een vraag", value: "terug" },
    ],
  },
  consignatie: {
    from: "bot",
    text: "Via consignatie verkopen wij jouw auto voor jou. Stuur ons de gegevens en foto's, dan nemen we contact op als we interesse hebben. Volledig vrijblijvend!",
    actions: [
      { label: "Auto aanbieden →", value: "goto_contact" },
      { label: "Eerst bellen", value: "bellen" },
      { label: "Via WhatsApp", value: "whatsapp" },
    ],
  },
  prijs: {
    from: "bot",
    text: "Voor een specifieke vraagprijs of taxatie neem je het beste direct contact op met Jimi.",
    actions: [
      { label: "Direct bellen", value: "bellen" },
      { label: "WhatsApp", value: "whatsapp" },
      { label: "E-mail sturen", value: "goto_contact" },
    ],
  },
  anders: {
    from: "bot",
    text: "Geen probleem! Je kunt Jimi direct bereiken via telefoon, WhatsApp of e-mail. Wat past het beste bij jou?",
    actions: [
      { label: "Direct bellen", value: "bellen" },
      { label: "WhatsApp", value: "whatsapp" },
      { label: "E-mail / formulier", value: "goto_contact" },
    ],
  },
  terug: INITIAL,
  bellen: {
    from: "bot",
    text: "Je kunt Jimi bereiken via het telefoonnummer. Klik hieronder om direct te bellen.",
    actions: [{ label: "📞 Nu bellen", value: "do_bellen" }],
  },
  whatsapp: {
    from: "bot",
    text: "Stuur Jimi een WhatsApp-bericht — hij reageert zo snel mogelijk!",
    actions: [{ label: "💬 Open WhatsApp", value: "do_whatsapp" }],
  },
};

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const handleAction = (value: string) => {
    if (value === "goto_aanbod") {
      window.location.href = "/aanbod";
      return;
    }
    if (value === "goto_contact") {
      window.location.href = "/contact";
      return;
    }
    if (value === "do_bellen") {
      if (PHONE_NUMBER) window.location.href = `tel:${PHONE_NUMBER}`;
      return;
    }
    if (value === "do_whatsapp") {
      if (WHATSAPP_NUMBER) window.open(`https://wa.me/${WHATSAPP_NUMBER}`, "_blank");
      return;
    }
    const response = BOT_RESPONSES[value];
    if (response) {
      setMessages((prev) => [...prev, response]);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { from: "user", text: input };
    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        from: "bot",
        text: "Bedankt voor je bericht! Voor een snel antwoord kun je het beste direct contact opnemen met Jimi.",
        actions: [
          { label: "Direct bellen", value: "bellen" },
          { label: "WhatsApp", value: "whatsapp" },
          { label: "E-mail sturen", value: "goto_contact" },
        ],
      },
    ]);
    setInput("");
  };

  return (
    <>
      {/* Chat venster */}
      {open && (
        <div
          className="fixed bottom-20 right-4 z-50 w-80 rounded-xl overflow-hidden shadow-2xl flex flex-col"
          style={{ maxHeight: "480px", backgroundColor: "#001337", border: "1px solid rgba(255,255,255,0.3)" }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ backgroundColor: "#001337", borderBottom: "1px solid rgba(255,255,255,0.2)" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-white text-sm font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>
                JG Mobility
              </span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white">
              <X size={16} />
            </button>
          </div>

          {/* Berichten */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ maxHeight: "320px" }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col gap-2 ${msg.from === "user" ? "items-end" : "items-start"}`}>
                <div
                  className="px-3 py-2 rounded-xl text-sm max-w-[90%]"
                  style={{
                    fontFamily: "var(--font-inter)",
                    backgroundColor: msg.from === "bot" ? "rgba(255,255,255,0.08)" : "#ffffff",
                    color: msg.from === "bot" ? "#ffffff" : "#001337",
                  }}
                >
                  {msg.text}
                </div>
                {msg.actions && (
                  <div className="flex flex-wrap gap-1.5">
                    {msg.actions.map((action) => (
                      <button
                        key={action.value}
                        onClick={() => handleAction(action.value)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:opacity-80"
                        style={{
                          border: "1px solid rgba(255,255,255,0.5)",
                          color: "#ffffff",
                          backgroundColor: "transparent",
                          fontFamily: "var(--font-inter)",
                        }}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div
            className="px-3 py-2 flex items-center gap-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Typ een bericht..."
              className="flex-1 bg-transparent text-white text-xs outline-none placeholder:text-white/30"
              style={{ fontFamily: "var(--font-inter)" }}
            />
            <button onClick={handleSend} className="text-white/50 hover:text-white">
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Toggle knop */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-110"
        style={{ backgroundColor: "#ffffff" }}
      >
        {open ? <X size={22} color="#001337" /> : <MessageCircle size={22} color="#001337" />}
      </button>
    </>
  );
}
