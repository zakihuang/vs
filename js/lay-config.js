window.rootPath = (function (src) {
  src = document.scripts[document.scripts.length - 1].src;
  return src.substring(0, src.lastIndexOf("/") + 1);
})();

layui
  .config({
    base: rootPath + "lay-module/",
    version: true
  })
  .extend({
    lodash: 'lodash@3.10.1/lodash.custom.min',
    jqueryvs: "jqueryvs/index",
    tablevs: "tablevs/index",
    tableo: "tableo/index"
  });
