// 所有个人内容集中在这里。当前回忆文案、插画均为占位，不代表真实经历。
// 照片放入 assets/photos/ 后，将 image 改为 "./assets/photos/文件名.jpg" 即可。
window.SITE_CONTENT = {
  siteTitle: "拾光集",
  recipient: "亲爱的你",
  sender: "一直在你身边的我",
  birthday: "2026-10-16",
  timeZone: "Asia/Shanghai",
  // 不虚构相恋日期；填入 YYYY-MM-DD 后，首页自动显示相伴天数（起始日为第 1 天）。
  anniversary: null,
  // 可替换为自己有权使用的音乐路径；留空时播放浏览器合成的轻柔音符。
  musicSrc: null,
  memories: [
    {
      chapter: "01", date: "故事的开头 · 待我们填写", icon: "✿", title: "故事，从遇见你开始",
      description: "想在这里记下第一次见面的天气、你说过的第一句话，还有那个让我偷偷心动的瞬间。",
      image: "./assets/sky.svg", imageAlt: "蓝天白云与花朵的占位插画", caption: "关于初见，想记得再清楚一点。", tag: "初见的那一天"
    },
    {
      chapter: "02", date: "平凡的日子 · 待我们填写", icon: "♡", title: "和你一起，浪费一点时间",
      description: "一起散步、一起吃饭、一起等一场日落。想把这些小小的日常，都收进我们的回忆里。",
      image: "./assets/coffee.svg", imageAlt: "两杯咖啡与桌上小花的占位插画", caption: "两个人，一点闲暇，就很好。", tag: "日常也闪着光"
    },
    {
      chapter: "03", date: "2026.10.16 · 你的生日", icon: "✧", title: "新的一岁，也想陪着你",
      description: "愿你眼里有光，心里有爱。可以勇敢，也可以偶尔偷懒；可以做大人的事，也永远保留小朋友的快乐。",
      image: null, imageAlt: "", caption: "", tag: "生日快乐呀"
    }
  ],
  photos: [
    { image: "./assets/sky.svg", alt: "蓝天与花朵插画", title: "收集一个晴天", note: "以后放一张，我们一起抬头看到的天空。", tag: "小小的日常" },
    { image: "./assets/sea.svg", alt: "粉色日落海岸插画", title: "日落时分，想你", note: "想和你一起看很多很多场日落。", tag: "下一站，海边" },
    { image: "./assets/coffee.svg", alt: "两杯咖啡插画", title: "快乐是双人份", note: "一杯给你，一杯给我，时间慢一点就好。", tag: "我们的日常" },
    { image: "./assets/flowers.svg", alt: "粉色花束插画", title: "把浪漫送给你", note: "生活里的小仪式，想一样一样陪你完成。", tag: "一点仪式感" },
    { image: "./assets/moon.svg", alt: "月色下小镇插画", title: "晚安，明天见", note: "把今天最后一句温柔，留给你。", tag: "月亮也知道" },
    { image: "./assets/cake.svg", alt: "草莓生日蛋糕插画", title: "今天你最大", note: "愿你许下的愿望，都在新的一岁慢慢实现。", tag: "HAPPY BIRTHDAY" }
  ],
  notes: [
    { id: "wishes", type: "checklist", color: "pink", title: "想和你一起做的事", items: ["看一场海边的日落", "拍一组属于我们的照片", "去一个没去过的地方"], footer: "慢慢来，一件一件实现", doodle: "♡" },
    { id: "words", type: "text", color: "yellow", title: "想说给你听", text: "你不用每一天都闪闪发光。\n在我这里，普通的你、困困的你、开开心心的你，都很可爱。", footer: "今天也很喜欢你", doodle: "✿" },
    { id: "next-time", type: "text", color: "peach", title: "下次见面的时候", text: "先给你一个大大的拥抱，\n再慢慢讲最近的小事。\n\n见面，就是最好的安排。", footer: "已经开始期待了", doodle: "✧" },
    { id: "promise", type: "text", color: "cream", title: "一个小约定", text: "以后也要一起吃好多顿饭，\n走好多段路，拍好多张照片。\n把“我们”写成很长很长的故事。", footer: "拉钩，盖章", doodle: "∞" }
  ],
  letter: {
    title: "生日快乐，我最喜欢的你。",
    paragraphs: [
      "想了好久，要送你一份什么样的礼物。最后决定，给我们的回忆安一个小小的家，把那些想留住的瞬间、来不及说出口的话，一点一点放进来。",
      "谢谢你出现在我的生活里。因为有你，普通的日子也多了好多值得期待的事情。想分享给你的晚霞，想带你去吃的小店，还有每一次见面前，藏不住的开心。",
      "新的一岁，愿你能做喜欢的事，见想见的人，拥有睡得很香的夜晚和笑得很开心的白天。不必急着成为谁，你慢慢长大，我慢慢陪你。",
      "以后的回忆，我们一起填满。今天，就先好好许个愿吧。生日快乐，我最喜欢的你。"
    ]
  }
};
