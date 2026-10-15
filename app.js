(() => {
  "use strict";
  const content = window.SITE_CONTENT;
  if (!content) return;

  const $ = selector => document.querySelector(selector);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const wishStorageKey = "shiguang-birthday:wishes:v1";
  let photoIndex = 0;
  let toastTimer;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function image(src, alt, eager = false) {
    const node = element("img");
    node.src = src;
    node.alt = alt || "回忆里的一个瞬间";
    node.loading = eager ? "eager" : "lazy";
    node.decoding = "async";
    node.addEventListener("error", () => {
      if (node.dataset.fallback) return;
      node.dataset.fallback = "true";
      node.src = "./assets/sky.svg";
      node.alt = "照片暂时无法显示，以蓝天插画代替";
    });
    return node;
  }

  function tape() {
    const node = element("span", "tape");
    node.setAttribute("aria-hidden", "true");
    return node;
  }

  function toast(message) {
    const node = $("#toast");
    clearTimeout(toastTimer);
    node.textContent = message;
    node.classList.add("is-visible");
    toastTimer = setTimeout(() => node.classList.remove("is-visible"), 3000);
  }

  function dateNumber(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [year, month, day] = value.split("-").map(Number);
    const number = Date.UTC(year, month - 1, day);
    return new Date(number).toISOString().slice(0, 10) === value ? number : null;
  }

  function todayNumber() {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: content.timeZone || "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date());
    const date = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return Date.UTC(Number(date.year), Number(date.month) - 1, Number(date.day));
  }

  function updateDates() {
    const today = todayNumber();
    const birthday = dateNumber(content.birthday);
    if (birthday !== null) {
      $("#birthday-date").textContent = content.birthday.slice(5).replace("-", ".");
      $("#birthday-label").textContent = "一份只属于你的生日祝福";
      // 生日礼物使用固定祝福；年龄按这次庆祝日期计算。
      const birth = dateNumber(content.birthDate);
      if (birth !== null && birth <= birthday) {
        const targetDate = new Date(birthday);
        const birthDate = new Date(birth);
        const beforeBirthday = content.birthday.slice(5) < content.birthDate.slice(5);
        const age = targetDate.getUTCFullYear() - birthDate.getUTCFullYear() - Number(beforeBirthday);
        $("#birthday-label").textContent = `写给${content.recipient}的 ${age} 岁`;
        document.title = `${content.siteTitle} · ${content.recipient}，${age} 岁生日快乐`;
      }
      $("#letter-date").textContent = content.birthday.replaceAll("-", ".");
      $("#letter-date").dateTime = content.birthday;
    }
    const anniversary = dateNumber(content.anniversary);
    if (anniversary !== null && anniversary <= today) {
      const days = Math.floor((today - anniversary) / 86400000) + 1;
      $("#anniversary").replaceChildren(document.createTextNode("这是我们相伴的第 "), element("strong", "", String(days)), document.createTextNode(" 天 ♡"));
    }
    $("#footer-year").textContent = new Date(today).getUTCFullYear();
  }

  document.querySelectorAll("[data-site-title]").forEach(node => { node.textContent = content.siteTitle; });
  document.querySelectorAll("[data-recipient]").forEach(node => { node.textContent = content.recipient; });
  document.title = `${content.siteTitle} · 送给最特别的你`;
  $(".brand").setAttribute("aria-label", `${content.siteTitle}，回到首页`);
  updateDates();
  // 相伴天数按北京时间更新，生日祝福保持不变。
  setInterval(updateDates, 60_000);

  const timeline = $("#timeline");
  content.memories.forEach(memory => {
    const card = element("article", "memory-card");
    const title = element("h3");
    const icon = element("span", "", memory.icon);
    icon.setAttribute("aria-hidden", "true");
    title.append(icon, document.createTextNode(memory.title));
    card.append(element("p", "memory-date", memory.date), title, element("p", "memory-description", memory.description));
    if (memory.image) {
      const figure = element("figure");
      figure.append(image(memory.image, memory.imageAlt), element("figcaption", "", memory.caption));
      card.append(figure);
    }
    const bottom = element("div", "memory-bottom");
    bottom.append(element("span", "memory-tag", memory.tag), element("span", "memory-number", memory.chapter));
    card.append(bottom);
    timeline.append(card);
  });

  const photos = content.photos;
  $("#photo-count").textContent = photos.length;
  photos.forEach((photo, index) => {
    const card = element("button", "polaroid");
    card.type = "button";
    card.style.setProperty("--rotation", `${[-2, 1.5, -1, 1.4, -1.6, 2][index % 6]}deg`);
    card.setAttribute("aria-label", `查看照片：${photo.title}`);
    card.setAttribute("aria-haspopup", "dialog");
    card.setAttribute("aria-controls", "photo-dialog");
    card.append(tape(), image(photo.image, photo.alt), element("span", "polaroid-title", photo.title), element("span", "polaroid-tag", photo.tag));
    card.addEventListener("click", () => {
      photoIndex = index;
      renderPhoto();
      $("#photo-dialog").showModal();
    });
    $("#photo-grid").append(card);
  });

  function renderPhoto() {
    if (!photos.length) return;
    const photo = photos[photoIndex];
    const current = image(photo.image, photo.alt, true);
    current.id = "lightbox-image";
    $("#lightbox-image").replaceWith(current);
    $("#photo-dialog-title").textContent = photo.title;
    $("#photo-dialog-description").textContent = photo.note;
    $("#lightbox-count").textContent = `${photoIndex + 1} / ${photos.length}`;
  }

  function movePhoto(direction) {
    if (!photos.length) return;
    photoIndex = (photoIndex + direction + photos.length) % photos.length;
    renderPhoto();
  }
  $("#previous-photo").addEventListener("click", () => movePhoto(-1));
  $("#next-photo").addEventListener("click", () => movePhoto(1));
  $("#photo-dialog").addEventListener("keydown", event => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      movePhoto(event.key === "ArrowLeft" ? -1 : 1);
    }
  });

  let savedWishes = {};
  try {
    const saved = JSON.parse(localStorage.getItem(wishStorageKey) || "{}");
    if (saved && typeof saved === "object" && !Array.isArray(saved)) savedWishes = saved;
  } catch { /* 本地存储不可用时，勾选仍可在当前页面使用。 */ }

  content.notes.forEach((note, index) => {
    const card = element("article", `sticky-note ${note.color}`);
    card.style.setProperty("--rotation", `${[-2, 1.3, 1.1, -1.4][index % 4]}deg`);
    card.append(tape(), element("h3", "", note.title));
    if (note.type === "checklist") {
      const list = element("ul");
      note.items.forEach((text, itemIndex) => {
        const key = `${note.id}:${text}`;
        const item = element("li");
        const label = element("label");
        const checkbox = element("input");
        checkbox.type = "checkbox";
        checkbox.id = `wish-${index}-${itemIndex}`;
        checkbox.checked = savedWishes[key] === true;
        label.htmlFor = checkbox.id;
        checkbox.addEventListener("change", () => {
          savedWishes[key] = checkbox.checked;
          let persisted = true;
          try { localStorage.setItem(wishStorageKey, JSON.stringify(savedWishes)); }
          catch { persisted = false; }
          toast(persisted ? (checkbox.checked ? "又一起完成了一件小美好 ♡" : "慢慢来，我们还有好多时间。") : "当前浏览器无法保存更改，刷新后会重置。");
        });
        label.append(checkbox, element("span", "", text));
        item.append(label);
        list.append(item);
      });
      card.append(list);
    } else {
      card.append(element("p", "", note.text));
    }
    const bottom = element("div", "note-bottom");
    const doodle = element("span", "", note.doodle);
    doodle.setAttribute("aria-hidden", "true");
    bottom.append(element("small", "", note.footer), doodle);
    card.append(bottom);
    $("#notes-grid").append(card);
  });

  $("#letter-dialog-title").textContent = content.letter.title;
  $("#letter-to").textContent = `${content.recipient}：`;
  $("#letter-signature").textContent = content.sender;
  content.letter.paragraphs.forEach(paragraph => $("#letter-body").append(element("p", "", paragraph)));
  $("#open-letter").addEventListener("click", () => $("#letter-dialog").showModal());
  document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => document.getElementById(button.dataset.close).close());
  });
  document.querySelectorAll("dialog").forEach(dialog => {
    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  });

  $("#make-wish").addEventListener("click", () => {
    $("#wish-message").textContent = "愿你许下的愿望，都在新的一岁慢慢实现 ♡";
    $("#make-wish").textContent = "生日快乐，愿你永远被爱 ♡";
    $("#make-wish").disabled = true;
    if (reducedMotion.matches) return;
    const container = $("#confetti");
    container.style.height = `${$("#letter-dialog").scrollHeight}px`;
    for (let index = 0; index < 45; index++) {
      const piece = element("span", "confetti");
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = ["#d491a6", "#e8ba7e", "#bfc8a4", "#edc8bd"][index % 4];
      piece.style.animationDelay = `${Math.random() * .7}s`;
      container.append(piece);
    }
    setTimeout(() => container.replaceChildren(), 4200);
  });

  const links = [...document.querySelectorAll(".main-nav a")];
  const sections = [...document.querySelectorAll("main > section[id]")];
  let scrollQueued = false;
  function updateActiveSection() {
    const threshold = $(".site-header").getBoundingClientRect().height + 90;
    const section = [...sections].reverse().find(node => node.getBoundingClientRect().top <= threshold) || sections[0];
    links.forEach(link => {
      const active = link.hash === `#${section.id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    scrollQueued = false;
  }
  window.addEventListener("scroll", () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(updateActiveSection);
  }, { passive: true });
  window.addEventListener("resize", updateActiveSection, { passive: true });
  updateActiveSection();

  for (let index = 0; index < 19; index++) {
    const petal = element("span", "petal");
    petal.style.left = `${(index * 23 + 7) % 100}%`;
    petal.style.animationDuration = `${16 + index % 8 * 2}s`;
    petal.style.animationDelay = `${-index * 2.7}s`;
    petal.style.width = `${5 + index % 5}px`;
    petal.style.height = `${8 + index % 7}px`;
    $("#petals").append(petal);
  }

  // 点击后才设置音源；音乐从平台播放，不将音频文件复制到仓库。
  const audioTrack = $("#background-music");
  const musicButton = $("#music-toggle");
  const musicTitle = content.musicTitle || "背景音乐";
  audioTrack.volume = .3;
  musicButton.title = [musicTitle, content.musicArtist].filter(Boolean).join(" · ");

  function musicState(state) {
    const active = state !== "paused";
    musicButton.setAttribute("aria-pressed", String(active));
    musicButton.setAttribute("aria-busy", String(state === "loading"));
    musicButton.setAttribute("aria-label", `${active ? "暂停" : "播放"}${musicTitle}`);
    $(".music-label").textContent = state === "loading" ? "音乐加载中…" : musicTitle;
  }

  function pauseMusic() {
    audioTrack.pause();
    musicState("paused");
  }

  audioTrack.addEventListener("play", () => musicState("loading"));
  audioTrack.addEventListener("playing", () => {
    if (document.hidden) pauseMusic();
    else musicState("playing");
  });
  audioTrack.addEventListener("waiting", () => { if (!audioTrack.paused) musicState("loading"); });
  audioTrack.addEventListener("pause", () => musicState("paused"));
  audioTrack.addEventListener("error", () => {
    pauseMusic();
    toast("音乐暂时没能播放，再点一下试试吧。");
  });
  musicState("paused");

  musicButton.addEventListener("click", async () => {
    if (!audioTrack.paused) { pauseMusic(); return; }
    if (!content.musicSrc) { toast("音乐还没准备好，再等等吧。"); return; }
    try {
      if (!audioTrack.getAttribute("src")) audioTrack.src = content.musicSrc;
      if (audioTrack.error) audioTrack.load();
      await audioTrack.play();
      if (document.hidden) pauseMusic();
    } catch (error) {
      // 加载过程中再次点击暂停会中止 play()，无需提示播放失败。
      if (error.name === "AbortError") return;
      pauseMusic();
      if (!audioTrack.error) toast("音乐暂时没能播放，再点一下试试吧。");
    }
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden) pauseMusic(); });
  window.addEventListener("pagehide", pauseMusic);
})();
