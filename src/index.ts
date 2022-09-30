/*------------------------------
* DOM取得
----------------------------------*/
const ballElement = document.querySelectorAll<HTMLElement>(".ball");
/*------------------------------
* 各セッティング
----------------------------------*/
const ballParam = {
  x: 0,
  y: 0,
  size: 200,
  r: Math.random() * 255,
  g: Math.random() * 255,
  b: Math.random() * 255,
  a: 1.0,
};

const mouseParam = {
  x: 0,
  y: 0,
};

/*------------------------------
* 処理定義
----------------------------------*/

function _styleInit(): void {
  //x,y軸に中央
  ballParam.x = window.innerWidth * 0.5 - ballParam.size * 0.5;
  ballParam.y = window.innerHeight * 0.5 - ballParam.size * 0.5;
  //ボールにスタイリングを適用
  ballElement[0].style.width = `${ballParam.size}px`;
  ballElement[0].style.height = `${ballParam.size}px`;

  ballElement[0].style.background = `rgba(${ballParam.r},${ballParam.g},${ballParam.b},${ballParam.a})`;
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

function _ballMove(): void {
  //01.ボールをマウスの中心に。
  const mouseX = mouseParam.x - ballParam.size * 0.5;
  const mouseY = mouseParam.y - ballParam.size * 0.5;

  //02. 01で設定した値をtop.leftにセット。
  ballElement[0].style.left = `${mouseX}px`;
  ballElement[0].style.top = `${mouseY}px`;

  requestAnimationFrame(_ballMove);
}

/*------------------------------
* 処理実行
----------------------------------*/
function render(): void {
  _styleInit();
  _ballMove();
  window.addEventListener("mousemove", _mouseMove);
  window.addEventListener("touchmove", _mouseMove);
  window.addEventListener("resize", () => {
    _styleInit();
  });
}
render();

export {};
