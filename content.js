// 称呼、日期和照片已按本人提供的信息填写；便签与生日信正文仍待继续打磨。
// 照片放入 assets/photos/ 后，将 image 改为 "./assets/photos/文件名.jpg" 即可。
window.SITE_CONTENT = {
  siteTitle: "拾光集",
  recipient: "康老师",
  sender: "一直在你身边的我",
  birthday: "2026-10-16",
  birthDate: "2006-10-16",
  timeZone: "Asia/Shanghai",
  // 相伴天数按北京时间更新，起始日为第 1 天。
  anniversary: "2022-10-02",
  // 可替换为自己有权使用的音乐路径；留空时播放浏览器合成的轻柔音符。
  musicSrc: null,
  memories: [
    {
      chapter: "01", date: "故事的开头 · 初次约会", icon: "✿", title: "第一次约会，值得一直记得",
      description: "把初次约会的合照放在这里。关于我们的开头，想一直好好收藏。",
      image: "./assets/photos/first-date.jpg", imageAlt: "初次约会时拍下的两人合照", caption: "这张合照，是我们故事里的一页。", tag: "初次约会"
    },
    {
      chapter: "02", date: "相伴 1000 天", icon: "♡", title: "第 1000 天，还是想牵你的手",
      description: "从 2022 年 10 月 2 日开始，我们一起走到了 1000 天。以后还有好多好多天，想继续这样牵着你走。",
      image: "./assets/photos/day-1000.jpg", imageAlt: "在一起 1000 天时牵手走路的照片", caption: "第 1000 天，手还是要好好牵着。", tag: "我们的 1000 天"
    },
    {
      chapter: "03", date: "2026.10.16 · 20 岁生日", icon: "✧", title: "康老师，20 岁生日快乐",
      description: "愿你的 20 岁，眼里有光，心里有爱。可以勇敢，也可以偶尔偷懒；可以做大人的事，也永远保留小朋友的快乐。",
      image: null, imageAlt: "", caption: "", tag: "新的一岁，也想陪着你"
    }
  ],
  photos: [
    { image: "./assets/photos/northeast-trip.jpg", alt: "东北旅行时，两个人的影子落在草地上", title: "在东北，影子也成双", note: "东北旅行的一张小纪念。草地上，连我们的影子都在一起。", tag: "东北旅行" },
    { image: "./assets/photos/hainan-beach.jpg", alt: "海南海滩的拼图：沙上的 LOVE、两人的手势，以及并肩的影子", title: "把喜欢留在海南", note: "海南的海滩、沙上的 LOVE，还有我们并肩的影子，都留在这张照片里。", tag: "海南 · 海滩" },
    { image: "./assets/photos/day-1000.jpg", alt: "在一起 1000 天时，两个人牵着手走路", title: "牵手走到第 1000 天", note: "走到第 1000 天，还是想这样牵着你的手。", tag: "相伴 1000 天" },
    { image: "./assets/photos/first-date.jpg", alt: "初次约会时的两人合照", title: "初次约会的我们", note: "初次约会留下的合照，想一直好好收藏。", tag: "故事的开头" },
    { image: "./assets/photos/sunrise.jpg", alt: "海上日出，橙红色的太阳升在海面与栈桥旁", title: "日出，是新的喜欢", note: "把日出收藏起来，也把新一天的喜欢送给你。", tag: "日出时分" },
    { image: "./assets/photos/sunny-day.jpg", alt: "晴天的海边，康老师站在沙滩上", title: "晴天，和镜头里的你", note: "晴天、海风，还有镜头里的你。", tag: "想把晴天都送给你" }
  ],
  notes: [
    { id: "wishes", type: "checklist", color: "pink", title: "想和你一起做的事", items: ["看一场海边的日落", "拍一组属于我们的照片", "去一个没去过的地方"], footer: "慢慢来，一件一件实现", doodle: "♡" },
    { id: "words", type: "text", color: "yellow", title: "想说给你听", text: "你不用每一天都闪闪发光。\n在我这里，普通的你、困困的你、开开心心的你，都很可爱。", footer: "今天也很喜欢你", doodle: "✿" },
    { id: "next-time", type: "text", color: "peach", title: "下次见面的时候", text: "先给你一个大大的拥抱，\n再慢慢讲最近的小事。\n\n见面，就是最好的安排。", footer: "已经开始期待了", doodle: "✧" },
    { id: "promise", type: "text", color: "cream", title: "一个小约定", text: "以后也要一起吃好多顿饭，\n走好多段路，拍好多张照片。\n把“我们”写成很长很长的故事。", footer: "拉钩，盖章", doodle: "∞" }
  ],
  letter: {
    title: "康老师，20 岁生日快乐。",
    paragraphs: [
      "想了好久，要送你一份什么样的礼物。最后决定，给我们的回忆安一个小小的家，把那些想留住的瞬间、来不及说出口的话，一点一点放进来。",
      "谢谢你出现在我的生活里。因为有你，普通的日子也多了好多值得期待的事情。想分享给你的晚霞，想带你去吃的小店，还有每一次见面前，藏不住的开心。",
      "新的一岁，愿你能做喜欢的事，见想见的人，拥有睡得很香的夜晚和笑得很开心的白天。不必急着成为谁，你慢慢长大，我慢慢陪你。",
      "以后的回忆，我们一起填满。今天，就先好好许个愿吧。生日快乐，我最喜欢的你。"
    ]
  }
};
