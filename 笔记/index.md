# 🔥近期任务
全身心投入到公司项目的实习中去，尽量以场景结合代码的方式学习，更为高效和深入
## ❎未完成
```dataview
task
from "实验平台"
where !complete
```
## ✅已完成
```dataview
task 
from "实验平台"
where completed
```



# 🏆今天是 `=dateformat(date(today), "yyyy年M月d日")`

- bilibili: [哔哩哔哩 (゜-゜)つロ 干杯\~-bilibili](https://www.bilibili.com/)
- 语雀：[dashboard](https://www.yuque.com/dashboard/books)
- chatgpt：[ChatGPT](https://chatgpt.com/)
- 豆包：[豆包](https://www.doubao.com/chat/)
- leekcode：[Leekcode](https://leetcode.cn/)

# 📕近一周的日记

```dataview
TABLE file.name AS "日记文件", file.cday AS "创建时间"
FROM "日报"
WHERE file.cday > date(today) - dur(7 days)
SORT file.cday DESC
LIMIT 7
```

# 📅写作记录

```contributionGraph
title: Breathe's   LOG
graphType: calendar
dateRangeValue: 3
dateRangeType: LATEST_MONTH
startOfWeek: 1
showCellRuleIndicators: true
titleStyle:
  textAlign: left
  fontSize: 20px
  fontWeight: normal
dataSource:
  type: PAGE
  value: ""
  dateField:
    type: FILE_MTIME
fillTheScreen: true
enableMainContainerShadow: true
cellStyleRules:
  - id: Ocean_a
    color: "#8dd1e2"
    min: 1
    max: 2
  - id: Ocean_b
    color: "#63a1be"
    min: 2
    max: 3
  - id: Ocean_c
    color: "#376d93"
    min: 3
    max: "20"
  - id: Ocean_d
    color: "#012f60"
    min: "20"
    max: 9999
mainContainerStyle:
  backgroundColor: "#00000008"
cellStyle:
  minWidth: 20px
  minHeight: 20px

```
