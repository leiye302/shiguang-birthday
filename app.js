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
      const days = Math.round((birthday - today) / 86400000);
      $("#birthday-date").textContent = content.birthday.slice(5).replace("-", ".");
      $("#birthday-label").textContent = days === 0 ? "今天，全世界的温柔都送给你" : days === 1 ? "明天，就是你的专属节日" : days > 1 ? `还有 ${days} 天，迎来你的专属节日` : "这一份生日快乐，永远为你珍藏";
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
  // 留着页面跨过零点时，生日提示和相伴天数也会更新。
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

  // 用户点击后才播放；内置旋律由 Web Audio 合成，不请求外部音频。
  let audioContext;
  let audioTrack;
  let masterGain;
  let musicTimer;
  let noteIndex = 0;
  let musicPlaying = false;
  let musicBusy = false;
  const melody = [261.63, 329.63, 392, 523.25, 440, 392, 329.63, 293.66, 261.63, 329.63, 392, 440, 392, 329.63, 293.66, 261.63];

  function musicState(playing) {
    musicPlaying = playing;
    $("#music-toggle").setAttribute("aria-pressed", String(playing));
    $("#music-toggle").setAttribute("aria-label", playing ? "暂停轻柔音乐" : "播放轻柔音乐");
    $(".music-label").textContent = playing ? "温柔播放中" : "听一点温柔";
  }

  function playNote() {
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = melody[noteIndex++ % melody.length];
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(.16, now + .03);
    gain.gain.exponentialRampToValueAtTime(.001, now + 1.9);
    oscillator.connect(gain).connect(masterGain);
    oscillator.start(now);
    oscillator.stop(now + 2);
    oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
  }

  function pauseMusic() {
    clearInterval(musicTimer);
    if (masterGain && audioContext) masterGain.gain.setValueAtTime(0, audioContext.currentTime);
    if (audioTrack) audioTrack.pause();
    musicState(false);
  }

  $("#music-toggle").addEventListener("click", async () => {
    if (musicBusy) return;
    if (musicPlaying) { pauseMusic(); return; }
    musicBusy = true;
    try {
      if (content.musicSrc) {
        if (!audioTrack) {
          audioTrack = new Audio(content.musicSrc);
          audioTrack.loop = true;
          audioTrack.volume = .3;
          audioTrack.addEventListener("error", () => { pauseMusic(); toast("音乐暂时没能播放，再试一次吧。"); });
        }
        await audioTrack.play();
      } else {
        if (!audioContext) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (!AudioContextClass) throw new Error("Audio is unavailable");
          audioContext = new AudioContextClass();
          masterGain = audioContext.createGain();
          masterGain.gain.value = .22;
          masterGain.connect(audioContext.destination);
        }
        await audioContext.resume();
        masterGain.gain.setValueAtTime(.22, audioContext.currentTime);
        playNote();
        musicTimer = setInterval(playNote, 850);
      }
      musicState(true);
      if (document.hidden) pauseMusic();
    } catch {
      pauseMusic();
      toast("音乐暂时没能播放，再试一次吧。");
    } finally { musicBusy = false; }
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden && musicPlaying) pauseMusic(); });
  window.addEventListener("pagehide", pauseMusic);
})();
