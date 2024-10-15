import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import MarioAvatar from "../public/mario.png";
import DefaultAvatar from "../public/default_pfp.jpg";
import { marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";
import DOMPurify from "dompurify";

const options = {
  prefix: "chat-header-",
};

marked.use(gfmHeadingId(options));
marked.setOptions({
  gfm: true,
  breaks: true,
});

export default function ChatMessages({
  messages,
  isStreaming,
}: {
  messages: { text: string; isUser: boolean }[];
  isStreaming: boolean;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [maskStyle, setMaskStyle] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(); // Ensure this works as expected
    const chatMessages = document.getElementById("chat-messages");
    if (!chatMessages) return;

    // Using setTimeout to wait for DOM update
    setTimeout(() => {
      const links = chatMessages.getElementsByTagName("a");
      for (const link of Array.from(links)) {
        link.setAttribute("target", "_blank");
      }
    }, 500);
  }, [messages]);

  const handleScroll = () => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollElement;
    //console.log({ scrollTop, scrollHeight, clientHeight });

    if (scrollTop === 0) {
      // at the top - fade only at the bottom
      setMaskStyle(
        "linear-gradient(to bottom, white, white 5	%, white 90%, transparent)"
      );
    } else if (scrollTop + clientHeight >= scrollHeight) {
      // at the bottom - fade only at the top
      setMaskStyle(
        "linear-gradient(to bottom, transparent, white 5%, white 90%, white)"
      );
    } else {
      // middle - fade both top and bottom
      setMaskStyle(
        "linear-gradient(to bottom, transparent, white 5%, white 90%, transparent)"
      );
    }
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) scrollElement.addEventListener("scroll", handleScroll);

    return () => {
      if (scrollElement)
        scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="overflow-y-auto h-full w-full mt-auto justify-start flex flex-col margin-top: auto"
      id="chat-messages"
      ref={scrollRef}
      style={{
        maskImage: maskStyle,
      }}
    >
      {" "}
      {/* Add id for links effect */}
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.isUser ? "justify-end" : "justify-start"
          } p-2`}
        >
          <div
            className={`flex p-2 items-start overflow-hidden text-wrap whitespace-pre-wrap break-words ${
              message.isUser && "flex-row-reverse"
            }`}
          >
            {!message.isUser ? (
              <Image
                src={MarioAvatar}
                alt="Mario Avatar"
                className="w-10 h-10 md:w-14 md:h-14 aspect-square rounded-full mr-4 object-cover flex-shrink-0 align-top"
              />
            ) : (
              <Image
                src={DefaultAvatar}
                alt="Mario Avatar"
                className="w-10 h-10 md:w-14 md:h-14 aspect-square rounded-full ml-4 object-cover flex-shrink-0 align-top"
              />
            )}
            {message.isUser ? (
              <span
                className="bg-gray-300/40 p-3 rounded-lg max-w-96 text-wrap whitespace-pre-wrap break-words"
                style={{ wordBreak: "break-word" }}
              >
                {message.text}
              </span>
            ) : (
              <span
                className="max-w-lg overflow-hiddend text-wrap whitespace-pre-wrap break-words tracking-tight"
                style={{ wordBreak: "break-word" }}
                id="bot-response"
                // className="leading-8"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(marked(message.text) as string),
                }}
              />
            )}
            {/* Only show the loading animation if the message is being streamed */}
            {isStreaming && index === messages.length - 1 && (
              <span className="animate-pulse">...</span>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
