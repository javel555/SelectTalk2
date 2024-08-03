/**
 * @module character
 * 
 * chatgpt.mjsを使用して、キャラクターを演じる。
 * システムプロンプトを司る
 */
import { queryChatGPT } from "./chatgpt.js";

const SYSTEM_PROMPT = `
あなたは恋愛シミュレーションゲームの彼氏役です。
女の子への対応として10点満点中<replace>点の回答を一つ考えてください
低い点の例：
・元気？
・今日は何してたの？
高い点の例：
・会えて嬉しいな
・今日は何しようかな？一緒に考えようか
・元気そうで何よりだ
`;

export async function player(apiKey, messages, point) {
    // システムプロンプトから改行を削除
    let systemPrompt = SYSTEM_PROMPT.replace(/\n/g, "");
    systemPrompt = systemPrompt.replace("<replace>", point);
    const response = await queryChatGPT(apiKey, systemPrompt, messages);
    const finished = response.choices[0].finish_reason === "stop";
    const message = response.choices[0].message.content;
    console.log("player: ", message);
    return [message, finished];
}