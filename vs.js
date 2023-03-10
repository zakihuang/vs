/**
 * 页面初始数据生成
 */
const ITEM_HEIGHT = 32;
const COUNT = 10000;
const MAX_COUNT = Math.ceil(
  document.querySelector(".view").clientHeight / ITEM_HEIGHT
);


const container = document.querySelector(".list");

const listData = [];
for (let i = 0; i < COUNT; i++) {
  listData.push({
    text: i + 1
  });
}

listData.forEach((item, index) => {
  item.top = index * ITEM_HEIGHT;
});

const line = createElement("div", {
  className: "line"
});

let runData = listData.slice(0, MAX_COUNT * 2);
if (container) {
  appendElement(runData, container, line);
} else {
  // appendElement(listData, container2, line)
}

function createElement(tag, options = { style: {} }) {
  const dom = document.createElement("div");
  changeDomStyle(dom, options);
  return dom;
}

// 生成假数据
function initInnerHTMLData(dom, text) {
  dom.innerHTML = text;
  return dom;
}

function changeDomStyle(dom, options) {
  const { className, style } = options;
  dom.className = className || "";
  for (const key in style) {
    dom.style[key] = style[key];
  }
}

function appendElement(dataList, container, child) {
  container.innerHTML = "";
  const fragment = document.createDocumentFragment();
  dataList.forEach((item) => {
    child = initInnerHTMLData(child.cloneNode(true), item.text);
    fragment.appendChild(child);
  });
  container.append(fragment);
}

/**
 * 虚拟滚动条
 */
let switchScrollScale = [0, MAX_COUNT * ITEM_HEIGHT];
setBackgroundHeight();

let tick = false;
document.querySelector("#scroll").addEventListener("scroll", (e) => {
  if (!tick) {
    tick = true;
    window.requestAnimationFrame(() => {
      tick = false;
    });
    getRunDataList(getScrollDistance(e));
  }
});

function setBackgroundHeight() {
  document.querySelector(".background").style.height =
    getListHeight(ITEM_HEIGHT, COUNT) + "px";
}

function getListHeight(height, num) {
  return height * num;
}

function getScrollDistance(event) {
  return event.target.scrollTop;
}

function getRunDataList(distance) {
  // console.log(distance, switchScrollScale)
  if (!switchScroll(distance)) {
    const startIndex = getStartIndex(distance);
    const beforeList = listData.slice(getBeforeIndex(startIndex), startIndex);
    const nowList = listData.slice(startIndex, startIndex + MAX_COUNT);
    const afterList = listData.slice(
      getAfterIndex(startIndex),
      getAfterIndex(startIndex) + MAX_COUNT
    );
    changeListTop(startIndex, beforeList[0] || listData[startIndex]);
    // console.log(beforeList, nowList, afterList)
    changeSwitchScale(
      startIndex,
      getBeforeIndex(startIndex),
      getAfterIndex(startIndex)
    );
    runData = [...beforeList, ...nowList, ...afterList];
    appendElement(runData, container, line);
  }
}

function changeListTop(startIndex, { top }) {
  // console.log(document.querySelector('.list').style, top)
  document.querySelector(
    ".list"
  ).style.top = `${top}px`;
}

function switchScroll(scrollTop) {
  return scrollTop > switchScrollScale[0] && scrollTop < switchScrollScale[1];
  // return scrollTop > (COUNT - MAX_COUNT + 1) * ITEM_HEIGHT || scrollTop < (MAX_COUNT - 1) * ITEM_HEIGHT
}

function changeSwitchScale(startIndex, beforeIndex, afterIndex) {
  const beforeScale = Math.ceil(startIndex) * ITEM_HEIGHT;
  const afterScale = Math.floor(afterIndex) * ITEM_HEIGHT;
  switchScrollScale = [beforeScale, afterScale];
}

// 二分法查找
function getStartIndex(scrollTop) {
  let start = 0;
  let end = listData.length - 1;
  while (start < end) {
    const mid = Math.floor((end + start) / 2);
    const { top } = listData[mid];
    if (scrollTop >= top && scrollTop < top + ITEM_HEIGHT) {
      start = mid;
      break;
    } else if (scrollTop >= top + ITEM_HEIGHT) {
      start = mid + 1;
    } else if (scrollTop < top) {
      end = mid - 1;
    }
  }
  return start < 0 ? 0 : start;
}

function getBeforeIndex(startIndex) {
  return startIndex - MAX_COUNT < 0 ? 0 : startIndex - MAX_COUNT;
}

function getAfterIndex(startIndex) {
  return startIndex + MAX_COUNT > COUNT ? COUNT : startIndex + MAX_COUNT;
}


///

