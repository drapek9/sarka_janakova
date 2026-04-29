/**
 * Detail nemovitosti: hlavní foto vlevo + 4 náhledy vpravo + lightbox.
 */
(function () {
  const sideItems = [...document.querySelectorAll(".pdp-hero-side-item")];
  const mainBtn = document.querySelector("[data-pdp-main-open]");
  const mainImg = document.querySelector(".pdp-hero-main-img");
  const openAllBtn = document.querySelector("[data-pdp-open-all]");

  if (!sideItems.length || !mainBtn || !mainImg) return;

  const readPhotos = () => {
    const mainPhoto = {
      src: mainImg.getAttribute("src") ?? "",
      alt: mainImg.getAttribute("alt") ?? "",
    };
    const sidePhotos = sideItems.map((item) => {
      const img = item.querySelector("img");
      return {
        src: img?.getAttribute("src") ?? "",
        alt: img?.getAttribute("alt") ?? "",
      };
    });
    return [mainPhoto, ...sidePhotos];
  };

  let photos = readPhotos();

  sideItems.forEach((item) => {
    item.addEventListener("click", () => {
      const rawIndex = Number(item.getAttribute("data-pdp-photo-index"));
      const photoIndex = Number.isFinite(rawIndex) ? rawIndex : 0;
      openLb(photoIndex);
    });
  });

  mainBtn.addEventListener("click", () => openLb(0));
  openAllBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    openLb(0);
  });

  /* Lightbox */
  const lightbox = document.querySelector("[data-pdp-lightbox]");
  const imgLb = lightbox?.querySelector(".pdp-lb-img");
  const capLb = lightbox?.querySelector("[data-pdp-lb-caption]");
  const stageLb = lightbox?.querySelector("[data-pdp-lb-stage]");
  const closeEls = lightbox?.querySelectorAll("[data-pdp-lb-close]") ?? [];
  const prevLb = lightbox?.querySelector("[data-pdp-lb-prev]");
  const nextLb = lightbox?.querySelector("[data-pdp-lb-next]");
  const fsBtn = lightbox?.querySelector("[data-pdp-lb-fs]");
  const lbDialog = lightbox?.querySelector(".pdp-lb-dialog");

  let lbIndex = 0;
  let lastFocus = null;

  const updateLb = () => {
    photos = readPhotos();
    const cur = photos[lbIndex];
    if (!cur || !imgLb) return;
    imgLb.src = cur.src;
    imgLb.alt = cur.alt;
    if (capLb) capLb.textContent = `${lbIndex + 1} / ${photos.length} - ${cur.alt}`;
  };

  function openLb(i) {
    if (!lightbox) return;
    photos = readPhotos();
    lbIndex = (i + photos.length) % photos.length;
    lastFocus = document.activeElement;
    lightbox.hidden = false;
    document.body.classList.add("pdp-lb-open");
    updateLb();
    closeEls[0]?.focus({ preventScroll: true });
  }

  const closeLb = () => {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      exit?.call(document).catch(() => {});
    }
    if (lightbox) lightbox.hidden = true;
    document.body.classList.remove("pdp-lb-open");
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus({ preventScroll: true });
    }
  };

  if (lightbox && lbDialog) {
    lbDialog.addEventListener("click", (e) => {
      if (e.target === lbDialog) closeLb();
    });
  }

  closeEls.forEach((el) => el.addEventListener("click", closeLb));

  prevLb?.addEventListener("click", () => {
    photos = readPhotos();
    lbIndex = (lbIndex - 1 + photos.length) % photos.length;
    updateLb();
  });

  nextLb?.addEventListener("click", () => {
    photos = readPhotos();
    lbIndex = (lbIndex + 1) % photos.length;
    updateLb();
  });

  fsBtn?.addEventListener("click", () => {
    const target = stageLb || lbDialog;
    if (!target) return;
    const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fsEl) {
      const req = target.requestFullscreen || target.webkitRequestFullscreen;
      req?.call(target).catch(() => {});
    } else {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      exit?.call(document).catch(() => {});
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeLb();
    }
    if (e.key === "ArrowLeft") {
      photos = readPhotos();
      lbIndex = (lbIndex - 1 + photos.length) % photos.length;
      updateLb();
    }
    if (e.key === "ArrowRight") {
      photos = readPhotos();
      lbIndex = (lbIndex + 1) % photos.length;
      updateLb();
    }
  });
})();
