/*------------------------------
* DOM取得
----------------------------------*/
const ballElement = document.querySelectorAll<HTMLElement>(".ball");
/*------------------------------
* 各セッティング
----------------------------------*/
const ballSetting = {
  x: 0,
  y: 0,
  size: 300,
  r: Math.random() * 255,
  g: Math.random() * 255,
  b: Math.random() * 255,
  a: 0.4,
};

const mouseParam = {
  x: 0,
  y: 0,
  spX: 0,
  spY: 0,
};

/*------------------------------
* 処理定義
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

function _styleInit(): void {
  //x,y軸に中央
  ballSetting.x = window.innerWidth * 0.5 - ballSetting.size * 0.5;
  ballSetting.y = window.innerHeight * 0.5 - ballSetting.size * 0.5;
  //ボールにスタイリングを適用
  let win = window.innerWidth;
  if (win >= 768) {
    ballElement[0].style.width = `${ballSetting.size}px`;
    ballElement[0].style.height = `${ballSetting.size}px`;
  } else {
    ballElement[0].style.width = `calc(${ballSetting.size}px / 2)`;
    ballElement[0].style.height = `calc(${ballSetting.size}px / 2)`;
  }
  ballElement[0].style.background = `rgba(${ballSetting.r},${ballSetting.g},${ballSetting.b},${ballSetting.a})`;
}

function _mouseMove(e: any) {
  e.preventDefault();
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
  const mouseX = mouseParam.x - ballSetting.size * 0.5;
  const mouseY = mouseParam.y - ballSetting.size * 0.5;

  //02. 01で設定した値をtop.leftにセット。
  ballElement[0].style.left = `${mouseX}px`;
  ballElement[0].style.top = `${mouseY}px`;

  requestAnimationFrame(_ballMove);
}

export {};
