"use client";

import React, { FormEvent, useState, useTransition } from "react";
import { MessageSquare, Send } from "lucide-react";

import { ChatMessage, sendAiChatMessage } from "@/lib/api";

const initialMessage: ChatMessage = {
  role: "assistant",
  content:
    "Здравствуйте. Я AI-оператор дашборда. Могу помочь оценить ситуацию в городе, разобрать алерты и предложить действия."
};

export default function AIChatPanel({ scenario }: { scenario: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || isPending) {
      return;
    }

    const nextMessages = [...messages, { role: "user", content: trimmedInput } as ChatMessage];
    setMessages(nextMessages);
    setInput("");
    setError("");

    startTransition(async () => {
      try {
        const response = await sendAiChatMessage(nextMessages);
        setMessages((currentMessages) => [...currentMessages, response.message]);
      } catch (submitError) {
        setError("Не удалось получить ответ от AI. Проверьте backend и ключ OpenAI.");
        console.error(submitError);
      }
    });
  };

  return (
    <section className="glass-panel chat-panel">
      <div className="chat-panel__header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <MessageSquare color="#2563eb" />
          <h2 className="heading-gradient" style={{ margin: 0 }}>AI-чат оператора</h2>
        </div>
        <span className="chat-panel__badge">OpenAI</span>
      </div>

      <div className="chat-panel__messages">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`chat-message ${message.role === "user" ? "chat-message--user" : "chat-message--assistant"}`}
          >
            <span className="chat-message__role">
              {message.role === "user" ? "Вы" : "AI"}
            </span>
            <p>{message.content}</p>
          </div>
        ))}
        {isPending ? (
          <div className="chat-message chat-message--assistant">
            <span className="chat-message__role">AI</span>
            <p>Формирую ответ по данным дашборда...</p>
          </div>
        ) : null}
      </div>

      <form className="chat-panel__form" onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Например: какие меры принять при росте PM2.5 и пробках в центре?"
          rows={3}
          className="chat-panel__input"
        />
        <div className="chat-panel__actions">
          {error ? <p className="chat-panel__error">{error}</p> : <span className="chat-panel__hint">Сценарий: {scenario}. Ответ строится с учетом активного контекста дашборда.</span>}
          <button type="submit" className="btn-primary" disabled={isPending || !input.trim()}>
            <Send size={16} />
            Отправить
          </button>
        </div>
      </form>
    </section>
  );
}
