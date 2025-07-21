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
            bot_id: "7528249052929654792", // Đã cập nhật
          },
          componentProps: {
            title: "Trợ lý học tập Coze 💬",
          },
          auth: {
            type: "token",
            token:
              "pat_qIgoO3FWlKComxjlkinuMsm4UCL80m9blUM5lvmgSERAm2J0gan777I75zjuXmqE", // Đã cập nhật
            onRefreshToken: () =>
              "pat_qIgoO3FWlKComxjlkinuMsm4UCL80m9blUM5lvmgSERAm2J0gan777I75zjuXmqE", // Đã cập nhật
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
