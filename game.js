/*
恋愛シミュレーションゲームとしての基盤を提供する
*/

import { chatGPTMessage } from "./chatgpt.js";
import { character } from "./character.js";
import { player } from "./player.js";

// DOM: character-ccontainer
const characterContainer = document.getElementById("character-container");

// DOM: affinity
const affinity = document.getElementById("affinity");

// DOM: last
const last = document.getElementById("last");

// DOM: choices
const choices = document.getElementById("choices");

// DOM: relore
const relore = document.getElementById("relore");

// DOM: response
const response = document.getElementById("response");

// DOM: text
const text = document.getElementById("text");

// DOM: next
const next = document.getElementById("next");

const Util = {
  // ランダムな整数を生成する
  randomInt: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  // 指定秒数待つ
  sleep: (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },
  /**
   * クエリ文字列を取得
   */
  getQueryHash: () => {
    var result = {};
    var query = document.location.search;
    if (query.length < 1) return result;

    query = query.substring(1);
    var kvs = query.split("&amp;");
    for (var i = 0; i < kvs.length; i++) {
      var element = kvs[i].split("=");
      var key = decodeURIComponent(element[0]);
      var value = decodeURIComponent(element[1]);
      result[key] = decodeURIComponent(value);
    }
    return result;
  },
};

const API_KEY = Util.getQueryHash().t;
// ゲームの状態を管理するクラス
class Game {
  // コンストラクタ
  constructor() {
    this.doms = {
      characterContainer,
      affinity,
      choices,
      last,
      relore,
      response,
      text,
      next,
    };

    this.state = {
      scene: "title",
      text: "テキスト",
      hasNext: false,
      response: "選択肢",
      point: 0,
      affinity: 0,
      last: 10,
      thread: [{ ...chatGPTMessage, role: "user", content: "こんにちは" }],
    };

    this.doms.text.style.display = "none";
    this.doms.choices.style.display = "none";

    // 初回動作
    this.setEvent();
    this.talk();
  }

  // 画面の各ボタンにイベントを割り当てる
  setEvent() {
    this.doms.choices.addEventListener("click", async (e) => {
      if (e.target.dataset.response) {
        this.decreaseLast();
        this.update();

        const response = e.target.dataset.response;
        // ユーザの選択肢をスレッドに追加
        this.state.thread.push({
          ...chatGPTMessage,
          role: "user",
          content: response,
        });

        this.talk();

        // 現在選択中の回答点を好感度に加算
        this.addAffinity(this.state.point * 2);
      } else {
        this.think();
      }
    });

    this.doms.text.addEventListener("click", async (e) => {
      if (this.state.hasNext) {
        this.talk();
      }
    });
  }

  // 各DOM要素を更新する
  update() {
    this.doms.text.textContent = this.state.text;
    this.doms.response.textContent = this.state.response;
    this.doms.response.dataset.response = this.state.response;
    if (this.state.hasNext) {
      this.doms.next.style.display = "flex";
    } else {
      this.doms.next.style.display = "none";
    }
    this.doms.affinity.textContent = this.state.affinity;
    this.doms.last.textContent = this.state.last;

    // 好感度が３３以下なら、キャラクターの画像を変更
    if (this.state.affinity <= 33) {
      this.doms.characterContainer.style.backgroundImage =
        "url(./ch-2.png)";
    } else if (this.state.affinity <= 66) {
      this.doms.characterContainer.style.backgroundImage =
        "url(./ch-1.png)";
    } else {
      this.doms.characterContainer.style.backgroundImage =
        "url(./ch-3.png)";
    }
  }
  // 好感度を加算
  addAffinity(point) {
    this.state.affinity += point;
    if(this.state.affinity >= 100){
      this.state.affinity = 100;
    }
    console.log("affinity: ", this.state.affinity);
  }
  // 残り回数を減らす
  decreaseLast() {
    this.state.last -= 1;
    console.log("last: ", this.state.last);
  }

  // キャラクタの発話シーケンスを行う
  async talk() {
    this.doms.choices.style.display = "none";

    const [message, finished] = await character(
      API_KEY,
      this.state.thread,
      this.state.affinity
    );
    this.state.thread.push({
      ...chatGPTMessage,
      role: "assistant",
      content: message,
    });

    this.doms.text.style.display = "flex";
    this.state.text = message;
    this.state.hasNext = !finished;

    this.update();

    if (finished) {
      this.think();
    } else {
      // await Util.sleep(1000);
      // await this.talk();
    }
  }

  // 回答を考える
  async think() {
    this.doms.choices.style.display = "none";
    this.doms.text.style.display = "flex";

    // -1から10のランダムな整数を生成
    const point = Util.randomInt(-1, 10);
    this.state.point = point;

    // const thread = [
    //     this.state.thread[this.state.thread.length - 1],
    // ]
    // const [response, finished] = await player(API_KEY, thread, point);
    const [response, finished] = await player(
      API_KEY,
      this.state.thread,
      point
    );
    this.doms.choices.style.display = "flex";
    this.state.response = response;

    this.update();
  }
}

// ゲームのインスタンスを生成
const game = new Game();
