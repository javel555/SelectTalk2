/**
 * @module character
 * 
 * chatgpt.mjsを使用して、キャラクターを演じる。
 * システムプロンプトを司る
 */
import { queryChatGPT } from "./chatgpt.js";

const SYSTEM_PROMPT = `
あなたは恋愛シミュレーションゲームの彼女役です。
彼氏役からのメッセージに対して100点満点中<replace>点の回答を一つ考えてください
`;

export async function character(apiKey, messages, affinity) {
    // システムプロンプトから改行を削除
    let systemPrompt = SYSTEM_PROMPT.replace(/\n/g, "");
    systemPrompt = systemPrompt.replace("<replace>", affinity);
    const response = await queryChatGPT(apiKey, systemPrompt, messages);
    const finished = response.choices[0].finish_reason === "stop";
    const message = response.choices[0].message.content;
    console.log("character: ", message);
    return [message, finished];
}