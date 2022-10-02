import gsap from "gsap";

/*------------------------------
* DOM取得
----------------------------------*/
const ballElement = document.querySelectorAll<HTMLElement>(".ball");
const btn = document.querySelector<HTMLElement>(".btn");
/*------------------------------
* 各セッティング
----------------------------------*/
const ballParam = {
  x: 0,
  y: 0,
  size: 40,
  r: Math.random() * 255,
  g: Math.random() * 255,
  b: Math.random() * 255,
  a: 0.0,
};

const mouseParam = {
  x: 0,
  y: 0,
};

const easeParam = {
  ease: 0.07, //遅延時間
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

    ballElement[i].style.background = `rgba(${ballParam.r},${ballParam.g},${ballParam.b},${ballParam.a})`;
  }
}

function _mouseMove(e: any) {
  // e.preventDefault();
  let win = window.innerWidth;
  if (win >= 768) {
    mouseParam.x = e.clientX;
    mouseParam.y = e.clientY;
  } else {
    mouseParam.x = e.changedTouches[0].pageX;
    mouseParam.y = e.changedTouches[0].pageY;
  }
}

function positionInit(radiusNumber: number): number[] {
  const time = new Date().getTime() / 600; //経過時間

  //マウスの中心点 + (cos(経過時間) * 半径)
  const x = mouseParam.x + Math.cos(time) * radiusNumber;
  //マウスの中心点 + (sin(経過時間) * 半径)
  const y = mouseParam.y + Math.sin(time) * radiusNumber;
  //01.ボールをマウスの中心に。
  const mouseX = x - ballParam.size * 0.5;
  const mouseY = y - ballParam.size * 0.5;

  // 02. easeを追加
  ballParam.x += (mouseX - ballParam.x) * easeParam.ease;
  ballParam.y += (mouseY - ballParam.y) * easeParam.ease;

  return [ballParam.x, ballParam.y];
}
function _ballMove(): void {
  let [positionX, positionY] = positionInit(60);
  //03. 02で設定した値をtop.leftにセット。
  ballElement[0].style.left = `${positionX}px`;
  ballElement[0].style.top = `${positionY}px`;

  requestAnimationFrame(_ballMove);
}
function _ballHover(): void {
  btn?.addEventListener("mouseenter", () => {
    gsap.to(ballElement[0], {
      scale: 1.5,
      duration: 0.5,
    });
    ballElement[0].innerHTML = "🐶";
  });
  btn?.addEventListener("mouseleave", () => {
    gsap.to(ballElement[0], {
      scale: 1,
      duration: 0.5,
    });
    ballElement[0].innerHTML = "🐱";
  });
}

/*------------------------------
* 処理実行
----------------------------------*/
function render(): void {
  _styleInit();
  _ballMove();
  _ballHover();
  window.addEventListener("mousemove", _mouseMove);
  window.addEventListener("touchmove", _mouseMove);
  window.addEventListener("resize", () => {
    _styleInit();
  });
}
render();

export {};
