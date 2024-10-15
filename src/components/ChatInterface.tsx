"use client";

import { useEffect, useRef, useState } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { usePathname } from "next/navigation";
import { v4 } from "uuid";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

const samples = {
  questions: [
    "What are the top engineering programs at Drexel?",
    "What are the on campus housing options at Drexel?",
    "What resources are available for freshman academic support at Drexel?",
  ],
  capabilities: [
    "Reference general sources or explain where you might find further reading.",
    "Answer questions on a wide range of topics, from academics to general knowledge.",
    "Assist with research, offering insight across various fields.",
  ],
  limitations: [
    "May occasionally get incorrect information.",
    "May occasionally produce harmful instructions or biased content.",
    "Limited knowledge, Drexel community based.",
  ],
  know: [
    "Clubs I can join",
    "Dining Plans",
    "Academic Tutoring Resources",
    "Ways to book a study room",
  ],
};

export default function ChatInterface({
  activeConversation,
}: {
  activeConversation?: Conversation;
}) {
  const [activeConvo, setActiveConvo] = useState(activeConversation);
  const [messages, setMessages] = useState<
    { text: string; isUser: boolean }[] | null
  >(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // auto focus on message input
  useEffect(() => {
    messageRef.current?.focus();
  }, []);

  // reset messages when navigating to home
  useEffect(() => {
    if (pathname === "/" && messages && messages.length > 0) {
      setActiveConvo(undefined);
      setMessages([]);
    }
  }, [pathname]);

  useEffect(() => {
    setMessages(activeConversation?.messages || []);
    setActiveConvo(activeConversation);
  }, [activeConversation]);

  const handleSendMessage = async (message: string) => {
    let convo = activeConvo;
    const pastConversations = JSON.parse(
      window.localStorage.getItem("conversations") || "[]"
    ) as Conversation[];
    console.log({ pastConversations });

    if (!convo) {
      const uuid = v4();
      convo = {
        id: uuid,
        title: `Conversation ${pastConversations.length + 1}`,
        messages: [],
      };
      convo.messages.push({
        text: message,
        isUser: true,
        timestamp: Date.now(),
      });
      setActiveConvo(convo);
      window.localStorage.setItem(
        "conversations",
        JSON.stringify([...pastConversations, convo])
      );
      window.history.pushState(null, "", `/chat/${uuid}`);
    } else {
      convo.messages = [
        ...convo.messages,
        { text: message, isUser: true, timestamp: Date.now() },
      ];
      const updatedConversations = pastConversations.map((c) =>
        c.id === convo!.id ? convo : c
      );
      window.localStorage.setItem(
        "conversations",
        JSON.stringify(updatedConversations)
      );
    }

    setMessages((prev) => [...prev!, { text: message, isUser: true }]);
    setMessages((prev) => [...prev!, { text: "", isUser: false }]);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priorConversation: activeConversation?.messages.map(
            (messageObject) => {
              return { text: messageObject.text, isUser: messageObject.isUser };
            }
          ),
          query: message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message, status: " + response.status);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Failed to get response body reader");

      let accumulatedChunks = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        accumulatedChunks += chunk;

        const updateMessages = (chunks: string) => {
          setMessages((prev) => {
            const newMessages = [...prev!];
            const lastMessage = newMessages[newMessages.length - 1];
            lastMessage.text = chunks;
            return newMessages;
          });
        };

        updateMessages(accumulatedChunks);
      }

      convo.messages.push({
        text: accumulatedChunks,
        isUser: false,
        timestamp: Date.now(),
      });
      const conversationExists = pastConversations.some(
        (c) => c.id === convo.id
      );
      const updatedConversations = conversationExists
        ? pastConversations.map((c) => (c.id === convo.id ? convo : c)) // Update existing
        : [...pastConversations, convo]; // Append new conversation if it doesn't exist

      window.localStorage.setItem(
        "conversations",
        JSON.stringify(updatedConversations)
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching bot response:", error.message);
        const errorText = `I'm sorry, I couldn't process your request at this moment.\nPlease contact the developers with this error message: ${error.message} for question "${message}" `;

        convo.messages.push({
          text: errorText,
          isUser: false,
          timestamp: Date.now(),
        });
        const conversationExists = pastConversations.some(
          (c) => c.id === convo.id
        );
        const updatedConversations = conversationExists
          ? pastConversations.map((c) => (c.id === convo.id ? convo : c)) // Update existing
          : [...pastConversations, convo]; // Append new conversation if it doesn't exist

        window.localStorage.setItem(
          "conversations",
          JSON.stringify(updatedConversations)
        );

        setMessages((prev) => {
          const newMessages = [...prev!];
          newMessages[newMessages.length - 1].text = errorText;
          return newMessages;
        });
      }
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] w-full items-center">
      {messages && messages.length > 0 && (
        <div className="xl:px-32 flex-grow overflow-auto w-full">
          <ChatMessages messages={messages} isStreaming={isStreaming} />
        </div>
      )}
      {messages && messages.length === 0 && (
        <>
          <div className="hidden md:flex flex-col items-center justify-center h-full w-full">
            <h1 className="text-3xl font-bold mb-10">Ask DragonGPT</h1>
            <div className="flex flex-row items-start gap-10">
              <div className="flex flex-col items-center">
                <h2 className="hidden lg:block text-lg font-bold mb-4">
                  Ask Questions
                </h2>
                <div className="flex flex-col gap-4">
                  {samples.questions.map((message, index) => (
                    // Put the message in the input field when clicked
                    <Button
                      key={index}
                      variant="ghost"
                      onClick={() => handleSendMessage(message)}
                      className="max-w-80 h-fit text-wrap text-base font-light rounded-lg bg-gray-100 dark:bg-gray-100/40 hover:bg-gray-200 dark:hover:bg-gray-300/40 text-left px-2"
                    >
                      {message}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="hidden lg:flex flex-col items-center">
                <h2 className="text-lg font-bold mb-4">
                  What can DragonGPT do?
                </h2>
                <div className="flex flex-col gap-4">
                  {samples.capabilities.map((str, index) => (
                    <span
                      className="max-w-80 h-fit text-wrap py-2 px-2 bg-gray-100 dark:bg-gray-100/40 rounded-lg"
                      key={index}
                    >
                      {str}
                    </span>
                  ))}
                </div>
              </div>
              <div className="hidden lg:flex flex-col items-center">
                <h2 className="text-lg font-bold mb-4">Limitations</h2>
                <div className="flex flex-col gap-4">
                  {samples.limitations.map((str, index) => (
                    <span
                      className="max-w-80 h-fit text-wrap py-2 px-2 bg-gray-100 dark:bg-gray-100/40 rounded-lg"
                      key={index}
                    >
                      {str}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="md:hidden flex flex-col items-center justify-center h-full w-full">
            <h1 className="text-4xl font-bold mb-10 text-center w-56 flex-1 mt-60">
              What would you like to know more about?
            </h1>
            <div className="flex flex-row items-start gap-10">
              <div className="flex flex-col items-center">
                <div className="flex flex-row flex-wrap gap-4 mb-2">
                  {samples.know.map((message, index) => (
                    // Put the message in the input field when clicked
                    <Button
                      key={index}
                      variant="ghost"
                      onClick={() => handleSendMessage(message)}
                      className="p-1 px-2 max-w-80 h-fit  text-base font-light rounded-full bg-gray-100 dark:bg-gray-100/40 hover:bg-gray-200 dark:hover:bg-gray-300/40 text-left"
                    >
                      {message}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {!messages && (
        <div className="flex flex-grow justify-center">
          <Spinner className="" />
        </div>
      )}
      <ChatInput onSendMessage={handleSendMessage} messageRef={messageRef} />
    </div>
  );
}
