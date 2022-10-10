#!/bin/bash

function serve(){
    cd "./package" &&
    yarn serve
}

function dev(){
  rm -rf "./utools/dist" &&
  cd "./package" &&
  yarn build &&
  mv dist "../utools" &&
  cd "../utools" &&
  # 打包preload.js
  yarn ncc build -m  "./preload.js" &&
  cp "./plugin.json" "./dist/"
}
function utools(){
  node="node_modules"
  icon="${node}/iconv-lite/"
  safer="${node}/safer-buffer/"
  # 复制preload所需依赖
  iconNeed=("encodings" "lib" "LICENSE" "package.json")
  saferNeed=("safer.js" "LICENSE" "package.json")

  rm -rf "./dist/index.js" &&
  cp "./preload.js" "./dist/index.js" &&
  mkdir -p "./dist/$icon" "./dist/$safer"
  for idx in {0..3}; do
    if [ "${iconNeed[idx]}" ]; then
      cp -r "./${icon}${iconNeed[idx]}" "./dist/$icon"
    fi
    if [ "${saferNeed[idx]}" ]; then
      cp -r "./${safer}${saferNeed[idx]}" "./dist/$safer"
    fi
  done
}

case "${1}" in
  r)
    # 初始化依赖
    cd "./package" &&
    yarn &&
    cd "../utools" &&
    yarn
  ;;
  s)
    # 单独启动页面
    serve
  ;;
  d)
    # 压缩版本
    # 打包preload.js
    dev
  ;;
  u)
    # 提交审核版本
    # 未压缩preload.js
    dev
    utools
  ;;
  st)
    # 开发
    dev
    cd ..
    serve
  ;;
  *)
    echo "不存在的指令"
  ;;
esac
