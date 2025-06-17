"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    CozeWebSDK?: {
      WebChatClient: new (config: any) => void;
    };
  }
}

const CozeChatWidget = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://sf-cdn.coze.com/obj/unpkg-va/flow-platform/chat-app-sdk/1.2.0-beta.6/libs/oversea/index.js";
    script.async = true;

    script.onload = () => {
      if (window.CozeWebSDK?.WebChatClient) {
        new window.CozeWebSDK.WebChatClient({
          config: {
            bot_id: "7516567095715708944",
          },
          componentProps: {
            title: "Trợ lý học tập Coze 💬",
          },
          auth: {
            type: "token",
            token:
              "pat_c4MJwwCC2FeI8rmIVoQ2qCLhwEjlo4SocXKIKknnPqkyh4Gdm5Fsh7WgvY0wk5zZ",
            onRefreshToken: () =>
              "pat_c4MJwwCC2FeI8rmIVoQ2qCLhwEjlo4SocXKIKknnPqkyh4Gdm5Fsh7WgvY0wk5zZ",
          },
        });
      } else {
        console.error("❌ CozeWebSDK not found!");
      }
    };

    document.body.appendChild(script);
  }, []);

  return null;
};

export default CozeChatWidget;
