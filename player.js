/**
 * @module character
 * 
 * chatgpt.mjsを使用して、キャラクターを演じる。
 * システムプロンプトを司る
 */
import { queryChatGPT } from "./chatgpt.js";

const SYSTEM_PROMPT = `
あなたは恋愛シミュレーションゲームの彼氏役です。
以下の文脈やキャラクター設定に基づいて、女の子の対応として10点満点中<replace>点の会話のシミュレーションをしてください。発言は短く要約して、100文字程度に抑えてください。沢山喋りそうになったら、話題を切り捨てて一つにしてください。
文脈：
芝生が広がる広大な公園で、青空が広がる絶好の天気の中、あなたと私はデートに来ました。柔らかな風が吹き抜け、遠くには緑豊かな立木が見え、鳥のさえずりが響く穏やかな場所です。
私たちは広場にビニールシートを敷いて、手作りのお弁当やお菓子を広げ、リラックスした時間を過ごしていました。笑顔で会話を交わし、楽しいひとときでした。しかし、何らかの原因で彼女の機嫌が急に悪くなってしまいました。先ほどまでの穏やかで楽しい雰囲気が一変し、あなたの表情には不機嫌さが漂い始めました。

低い点の例：
元気？
今日は何してたの？
高い点の例：
会えて嬉しいな
今日は何しようかな？一緒に考えようか
元気そうで何よりだ
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