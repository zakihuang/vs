layui.define(["jquery", "lodash"], function (exports) {
  var $ = layui.jquery;
  var _ = layui.lodash;

  $.fn.virtualScroll = function (settings) {
    // 初始化处理
    initDomCss(this);

    var opts = $.extend({}, $.fn.virtualScroll.defaults, settings);
    var list = opts.list;
    var ITEM_HEIGHT = opts.itemHeight;
    var COUNT = list.length;
    var MAX_COUNT = Math.ceil($(".vs-view").get(0).clientHeight / ITEM_HEIGHT);
    var switchScrollScale = [0, MAX_COUNT * ITEM_HEIGHT];
    var $phantom = $(".vs-phantom");
    var $scroll = $(".vs-scroll");
    var $container = $(".vs-list");
    var $line = $('<div class="vs-line"><div>');

    appendElement(list.slice(0, MAX_COUNT * 2), $container, $line);

    setPantomHeight();

    $scroll.scroll(
      _.throttle(function (e) {
        getRunDataList($(e.target).scrollTop(), list);
      }, 16.6)
    );

    // 工具函数
    function appendElement(dataList, $container, child) {
      $container.html("");
      var fragment = document.createDocumentFragment();
      $.each(dataList, function (i, item) {
        fragment.appendChild(opts.line(child.clone(), item, i).get(0));
      });
      $container.append(fragment);
    }

    function getRunDataList(distance, list) {
      if (!switchScroll(distance)) {
        var startIndex = getStartIndex(distance, list);
        var beforeList = list.slice(getBeforeIndex(startIndex), startIndex);
        var nowList = list.slice(startIndex, startIndex + MAX_COUNT);
        var afterList = list.slice(
          getAfterIndex(startIndex),
          getAfterIndex(startIndex) + MAX_COUNT
        );

        changeListTop(startIndex);

        changeSwitchScale(
          startIndex,
          getBeforeIndex(startIndex),
          getAfterIndex(startIndex)
        );

        appendElement(
          [].concat(beforeList, nowList, afterList),
          $container,
          $line
        );
      }
    }

    function changeListTop(startIndex) {
      $container.css("top", startIndex * ITEM_HEIGHT + "px");
    }

    function switchScroll(scrollTop) {
      return (
        scrollTop > switchScrollScale[0] && scrollTop < switchScrollScale[1]
      );
    }

    function changeSwitchScale(startIndex, beforeIndex, afterIndex) {
      var beforeScale = Math.ceil(startIndex) * ITEM_HEIGHT;
      var afterScale = Math.floor(afterIndex) * ITEM_HEIGHT;
      switchScrollScale = [beforeScale, afterScale];
    }

    function getStartIndex(scrollTop, list) {
      var start = 0;
      var end = list.length - 1;
      while (start < end) {
        var mid = Math.floor((end + start) / 2);
        var top = mid * 32;
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

    function setPantomHeight() {
      $phantom.height(ITEM_HEIGHT * COUNT);
    }

    function initDomCss($this) {
      $this.html(
        [
          '<div class="vs-view">',
          '<div class="vs-scroll">',
          '<div class="vs-phantom"></div>',
          '<div class="vs-list"></div>',
          "</div>",
          "</div>"
        ].join("")
      );

      var css = [
        "/* 可视区域 */",
        ".vs-view {",
        "  position: relative;",
        "  width: 600px;",
        "  height: 500px;",
        "}",
        "/* 滚动条 */",
        ".vs-scroll {",
        " position: absolute;",
        " left: 0;",
        " right: 0;",
        " top: 0;",
        " bottom: 0;",
        " background-color: #4DC0EB;",
        " overflow-y: scroll;",
        " }",
        "/* 撑开容器 */",
        ".vs-phantom {",
        "  position: absolute;",
        "  left: 0;",
        "  right: 0;",
        "  top: 0;",
        "  bottom: 0;",
        "  z-index: -1;",
        "}",
        ".vs-list {",
        "  position: absolute;",
        "  left: 0;",
        "  right: 0;",
        "  top: 0;",
        "}",
        ".vs-line {",
        "  height: 32px;",
        "  color: #24305E;",
        "  line-height: 32px;",
        "  padding-left: 10px;",
        "}"
      ].join("");

      var style = document.createElement("style");

      (document.head || document.getElementsByTagName("head")[0]).appendChild(
        style
      );

      style.type = "text/css";
      if (style.styleSheet) {
        // This is required for IE8 and below.
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }

    return this;
  };

  $.fn.virtualScroll.defaults = {
    itemHeight: 32,
    list: [],
    line: function ($child, item, idx) {
      return $child.html(idx + "：测试数据：" + item.id);
    }
  };

  exports("jqueryvs", {});
});
