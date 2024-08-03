const API_ENDPOINT = "https://api.openai.com/v1/chat/completions";

// ChatGPTリクエストのmessagesに入れる値のテンプレート
export const chatGPTMessage = {
  role: "system", // system, assistant, user
  content: "",
};

// ChatGPTリクエストを送信する
export async function queryChatGPT(apiKey, systemPrompt, messages) {
  console.log("messages", messages);
  // ChatGPT送信情報JSONテンプレート
  const chatGPTRequest = {
    model: "gpt-4o-mini",
    frequency_penalty: 1,
    max_tokens: 150,
    presence_penalty: 0,
    top_p: 1,
    n: 1,
    messages: [],
  };
  const request = chatGPTRequest;

  request.messages.push({ ...chatGPTMessage, content: systemPrompt });
  request.messages.push(...messages);
  console.log("request", request.messages);

  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
