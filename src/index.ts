import { gsap, Power4 } from "gsap";
//https://github.com/dataarts/dat.gui
//https://qiita.com/machilda777/items/f8f05e569665c237168a
import * as dat from "dat.gui";
/*------------------------------
* DOM取得
----------------------------------*/
const ballElement = document.querySelectorAll<HTMLElement>(".ball");

/*------------------------------
* gui設定
----------------------------------*/
const gui = new dat.GUI();
const property = {
  color: `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`,
};

window.onload = function () {
  gui.addColor(property, "color").onChange(_styleInit);
};

/*------------------------------
* 各セッティング
----------------------------------*/
const ballParam = {
  x: 0,
  y: 0,
  size: 50,
  r: Math.random() * 255,
  g: Math.random() * 255,
  b: Math.random() * 255,
  a: 1.0,
};

/*------------------------------
* 処理定義
----------------------------------*/

function _styleInit(): void {
  //x,y軸に中央
  ballParam.x = window.innerWidth * 0.5 - ballParam.size * 0.5;
  ballParam.y = window.innerHeight * 0.5 - ballParam.size * 0.5;
  for (let i = 0; i < ballElement.length; i++) {
    //ボールにスタイリングを適用
    ballElement[i].style.width = `${ballParam.size}px`;
    ballElement[i].style.height = `${ballParam.size}px`;
    ballElement[i].style.left = `${ballParam.x}px`;
    ballElement[i].style.top = `${ballParam.y}px`;
    ballElement[i].style.background = property.color;
  }
  window.addEventListener("resize", _styleInit);
}

function _move(y: number, ease: string) {
  ballElement.forEach((ball, index) => {
    const delay: any = `0.${index}`;
    if (index <= 2) {
      gsap.to(ball, {
        y: y,
        ease: ease,
        duration: 1,
        delay: delay * 3,
      });
    } else if (index >= 2 && index <= 5) {
      gsap.to(ball, {
        x: y,
        ease: ease,
        duration: 1,
        delay: delay * 3,
      });
    } else if (index >= 5 && index <= 8) {
      gsap.to(ball, {
        x: -y,
        ease: ease,
        duration: 1,
        delay: delay * 3,
      });
    } else {
      gsap.to(ball, {
        y: -y,
        ease: ease,
        duration: 1,
        delay: delay * 3,
      });
    }
  });
}

function _allMove() {
  let flag = false; //分岐用フラッグ
  _move(-200, "Power4.Out");
  setInterval(() => {
    flag = !flag; //反転
    if (flag === true) {
      _move(0, "Power4.In");
    } else {
      _move(-200, "Power4.Out");
    }
  }, 3000);

  // 1ループ毎(6秒毎)にランダムで色を再設定
  setInterval(() => {
    const changeColor = `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},${ballParam.a})`;
    for (let i = 0; i < ballElement.length; i++) {
      ballElement[i].style.background = changeColor;
    }
  }, 6000);
}

/*------------------------------
* 処理実行
----------------------------------*/
function render(): void {
  _styleInit();
  _allMove();
}
render();

export {};
