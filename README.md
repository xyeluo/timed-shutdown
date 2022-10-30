# timed-shutdown

### 简介

设置完任务类型、名字、执行时间后点击创建任务，就可以添加到计划列表（插件的实现也是依托于 windows 系统的任务计划程序），已创建的任务可以在插件的计划列表移除。

### 截图

![未添加](images/1662088739000.png)

![1667102290537](./images/1667102290537.png)

### 关键词

输入框内输入“定时关机”、“定时重启”、"定时休眠"等关键词

通过关键词进入插件能快速选择对应任务类型

### 注意

- 该插件仅支持 windows 系统
- win11 可能出现休眠时间过长后会变成关机（命令执行确实是休眠），其他 windows 系统未测试
- 创建时要确保系统的任务计划程序没有与要添加的任务同名，否则点击创建会无反应
- 当月没有的日期任务将会顺延到下个月执行

### 使用

```
git clone https://github.com/tk914/timed-shutdown.git
cd timed-shutdown
//安装依赖
yarn ready
//运行项目 
yarn start
//打包
yarn utools
```

### 安装

[GitHub Release](https://github.com/tk914/timed-shutdown/releases)
