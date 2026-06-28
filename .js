(() => {
    "use strict";

    const STORAGE_KEYS = {
        savedPhotos: "romanceSavedPhotos",
        player: "romancePlayerState",
        notes: "romanceNotes"
    };

    const HEART_EMPTY = "\u2661";
    const HEART_FILLED = "\u2665";
    const DEFAULT_VOLUME = 0.76;
    const MAX_ZOOM = 3.5;
    const ZOOM_STEP = 0.35;

    let toastTimer = null;
    let favoritePhotos = readSavedPhotos();

    const photoCatalog = [
        photo("image/foto1.jpg", "El comienzo bonito", "Una foto que me hace sentirte cerca, incluso desde lejos.", "Recuerdo"),
        photo("image/foto2.jpg", "Un instante tuyo", "De esos momentos tuyos que no necesitan explicacion.", "Tuyo"),
        photo("image/foto3.jpg", "Luz suave", "Todo se siente mas lindo cuando apareces tu.", "Luz"),
        photo("image/foto4.jpg", "Mirarte asi", "La prueba de que algunas fotos tambien abrazan a distancia.", "Carino"),
        photo("image/foto5.jpg", "Dia bonito", "Un pedacito de ti guardado para volver a sonreir.", "Magia"),
        photo("image/foto6.jpg", "Para imaginar", "Porque hay lugares y planes que todavia quiero vivir a tu lado.", "Sueno"),
        photo("image/foto7.jpg", "Tu vibra", "Esa forma tuya de hacer que la distancia pese menos.", "Tuyo"),
        photo("image/foto8.jpg", "Sonrisa guardada", "Una razon sencilla para querer mirar otra vez.", "Dulce"),
        photo("image/foto9.jpg", "Cerquita de ti", "Lo simple tambien puede sentirse enorme cuando se trata de ti.", "Calma"),
        photo("image/foto10.jpg", "Tu color", "Una foto con brillo propio, como tu.", "Brillo"),
        photo("image/foto11.jpg", "Siempre tu", "La foto cambia, lo que siento se queda.", "Amor"),
        photo("image/superfavorita1.jpg", "Mi super favorita", "La que miro y pienso: si, ella es mi persona.", "Top 1", true),
        photo("image/superfavorita2.jpg", "Imposible no sonreir", "Tiene algo tuyo que ilumina todo.", "Especial", true),
        photo("image/favorita1.jpg", "Foto de pelicula", "Bonita, natural y completamente tu.", "Favorita"),
        photo("image/favorita2.jpg", "Ese brillo", "Como si la luz tambien supiera quererte.", "Brillo"),
        photo("image/favorita3.jpg", "Mi debilidad", "Una foto que se siente demasiado linda.", "Linda"),
        photo("image/favorita4.jpg", "Momento perfecto", "Casi parece que la distancia se queda quieta un ratito.", "Perfecta"),
        photo("image/favorita5.jpg", "Toda bonita", "La elegancia de ser tu sin intentarlo.", "Wow"),
        photo("image/favorita6.jpg", "Para presumirte", "De esas que uno guarda con orgullo.", "Bella"),
        photo("image/tierna.jpg", "Ternura pura", "La foto que baja el ruido del mundo.", "Suave", true),
        photo("image/tierna1.jpg", "Mi parte tranquila", "Hay una paz muy tuya en esta imagen.", "Calma", true),
        photo("image/tierna2.jpg", "Demasiado linda", "No hay forma seria de mirar esto y no derretirse.", "Tierna", true),
        photo("image/tierna3.jpg", "La mas dulce", "Un recuerdo chiquito con un sentimiento enorme.", "Dulce", true)
    ];

    const photoBySource = new Map(photoCatalog.map((item) => [item.src, item]));

    const tracks = [
        {
            title: "My Favorite Part",
            artist: "Mac Miller & Ariana Grande",
            src: "music/MMAG-My_Favorite_Part.mp3",
            cover: "image/superfavorita1.jpg"
        },
        {
            title: "Die With A Smile",
            artist: "Lady Gaga & Bruno Mars",
            src: "music/Die-With-A-Smile.mp3",
            cover: "image/favorita1.jpg"
        },
        {
            title: "Reina Pepiada",
            artist: "Alvaro Diaz",
            src: "music/\u00c1lvaroD\u00edaz-ReinaPepiada.mp3",
            cover: "image/foto11.jpg"
        },
        {
            title: "Chinita Linda",
            artist: "Rawayana",
            src: "music/Chinita-Linda.mp3",
            cover: "image/tierna3.jpg"
        },
        {
            title: "Dutty Love",
            artist: "Don Omar & Natti Natasha",
            src: "music/Dutty Love.mp3",
            cover: "image/favorita4.jpg"
        },
        {
            title: "Die For You",
            artist: "The Weeknd",
            src: "music/Die-For-You.mp3",
            cover: "image/foto5.jpg"
        },
        {
            title: "Seven",
            artist: "Jungkook",
            src: "music/Jungkook-Seven.mp3",
            cover: "image/foto8.jpg"
        },
        {
            title: "Forever Young",
            artist: "Alphaville",
            src: "music/Forever-Young.mp3",
            cover: "image/foto10.jpg"
        },
        {
            title: "Baby I",
            artist: "Ariana Grande",
            src: "music/Baby-I.mp3",
            cover: "image/tierna1.jpg"
        },
        {
            title: "A Mi",
            artist: "Rels B",
            src: "music/A-M\u00ed.mp3",
            cover: "image/superfavorita2.jpg"
        },
        {
            title: "Take Two",
            artist: "BTS",
            src: "music/BTS-TDNKBU.mp3",
            cover: "image/foto3.jpg"
        }
    ];

    document.addEventListener("DOMContentLoaded", () => {
        renderAllGalleries();
        setupRevealAnimations();
        setupGalleryLightbox();
        setupMusicPlayer();
        setupExperienceActions();
        setupNotes();
        updateSavedCounter();
        preloadInitialImages();
    });

    function photo(src, title, subtitle, badge, special = false) {
        return {
            id: src.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase(),
            src,
            title,
            subtitle,
            badge,
            special
        };
    }

    function renderAllGalleries() {
        renderGallery("memories", photoCatalog, {
            emptyTitle: "Aun no hay recuerdos para mostrar.",
            emptyText: "Agrega imagenes al catalogo para llenar esta galeria."
        });
        renderFavoritesGallery();
        renderSpecialGallery();
    }

    function renderFavoritesGallery() {
        const savedPhotos = photoCatalog.filter((item) => favoritePhotos.has(item.src));

        renderGallery("favorites", savedPhotos, {
            emptyTitle: "Todavia no hay fotos guardadas.",
            emptyText: "Toca el corazon de cualquier foto y aparecera automaticamente aqui."
        });
    }

    function renderSpecialGallery() {
        renderGallery("tender", photoCatalog.filter((item) => item.special), {
            emptyTitle: "No hay fotos especiales marcadas.",
            emptyText: "Cuando una imagen del catalogo sea especial, aparecera en esta seccion."
        });
    }

    function renderGallery(groupName, photos, emptyState) {
        const grid = document.querySelector(`[data-gallery-grid="${groupName}"]`);

        if (!grid) return;

        if (!photos.length) {
            grid.replaceChildren(createEmptyState(emptyState));
            return;
        }

        const fragment = document.createDocumentFragment();

        photos.forEach((item, index) => {
            fragment.append(createGalleryCard(item, index, groupName));
        });

        grid.replaceChildren(fragment);
    }

    function createGalleryCard(item, index, groupName) {
        const card = document.createElement("article");
        card.className = "gallery-card";
        card.tabIndex = 0;
        card.setAttribute("role", "button");
        card.dataset.galleryItem = "";
        card.dataset.photoId = item.id;
        card.dataset.src = item.src;
        card.dataset.title = item.title;
        card.dataset.subtitle = item.subtitle;
        card.dataset.galleryGroup = groupName;
        card.style.setProperty("--delay", `${Math.min(index * 45, 420)}ms`);
        card.setAttribute("aria-label", `Abrir foto: ${item.title}`);

        if (item.special) {
            card.dataset.specialPhoto = "true";
        }

        const image = document.createElement("img");
        image.className = "gallery-image";
        image.src = item.src;
        image.alt = item.title;
        image.loading = groupName === "memories" && index < 3 ? "eager" : "lazy";
        image.decoding = "async";
        image.draggable = false;

        if (groupName === "memories" && index < 3) {
            image.fetchPriority = "high";
        }

        const badge = document.createElement("span");
        badge.className = "gallery-card-badge";
        badge.textContent = item.badge;

        const saveButton = document.createElement("button");
        saveButton.className = "gallery-save";
        saveButton.type = "button";
        saveButton.dataset.savePhoto = item.src;
        saveButton.setAttribute("aria-label", `Guardar foto: ${item.title}`);
        saveButton.title = "Guardar como favorita";
        applyFavoriteButtonState(saveButton);

        const overlay = document.createElement("div");
        overlay.className = "gallery-overlay";

        const title = document.createElement("h4");
        title.className = "gallery-card-title";
        title.textContent = item.title;

        const subtitle = document.createElement("p");
        subtitle.className = "gallery-card-subtitle";
        subtitle.textContent = item.subtitle;

        const shine = document.createElement("span");
        shine.className = "gallery-shine";
        shine.setAttribute("aria-hidden", "true");

        overlay.append(title, subtitle);
        card.append(image, badge, saveButton, overlay, shine);

        return card;
    }

    function createEmptyState({ emptyTitle, emptyText }) {
        const empty = document.createElement("div");
        empty.className = "gallery-empty";

        const title = document.createElement("h4");
        title.textContent = emptyTitle;

        const text = document.createElement("p");
        text.textContent = emptyText;

        empty.append(title, text);
        return empty;
    }

    function setupGalleryLightbox() {
        const lightbox = document.querySelector("[data-gallery-lightbox]");
        const preview = document.querySelector("[data-gallery-preview]");
        const previewWrapper = document.querySelector("[data-gallery-swipe]");
        const closeButtons = document.querySelectorAll("[data-gallery-close]");
        const previousButton = document.querySelector("[data-gallery-prev]");
        const nextButton = document.querySelector("[data-gallery-next]");
        const counter = document.querySelector("[data-gallery-counter]");
        const title = document.querySelector("[data-gallery-title]");
        const description = document.querySelector("[data-gallery-description]");
        const progress = document.querySelector("[data-gallery-progress]");
        const progressWrap = document.querySelector("[data-gallery-progress-wrap]");
        const zoomInButton = document.querySelector("[data-gallery-zoom-in]");
        const zoomOutButton = document.querySelector("[data-gallery-zoom-out]");
        const zoomResetButton = document.querySelector("[data-gallery-zoom-reset]");
        const zoomLabel = document.querySelector("[data-gallery-zoom-label]");

        if (!lightbox || !preview || !previewWrapper) return;

        let currentIndex = 0;
        let activeItems = [];
        let lastFocusedElement = null;
        let zoom = 1;
        let panX = 0;
        let panY = 0;
        let pointerState = null;

        window.openRomancePhoto = (index = 0) => {
            openGallery(normalizeIndex(Number(index) || 0, collectGalleryItems().length));
        };

        document.addEventListener("click", (event) => {
            const card = event.target.closest("[data-gallery-item]");

            if (!card || event.target.closest("[data-save-photo]")) return;

            const cards = collectGalleryCards();
            const index = cards.indexOf(card);

            if (index >= 0) openGallery(index);
        });

        document.addEventListener("keydown", (event) => {
            if (!lightbox.hidden) {
                handleLightboxKeys(event);
                return;
            }

            const card = event.target.closest("[data-gallery-item]");

            if (!card || event.target.closest("[data-save-photo]")) return;
            if (event.key !== "Enter" && event.key !== " ") return;

            event.preventDefault();
            const cards = collectGalleryCards();
            const index = cards.indexOf(card);

            if (index >= 0) openGallery(index);
        });

        closeButtons.forEach((button) => {
            button.addEventListener("click", closeGallery);
        });

        nextButton?.addEventListener("click", () => nextImage("next"));
        previousButton?.addEventListener("click", () => previousImage("previous"));
        zoomInButton?.addEventListener("click", () => setZoom(zoom + ZOOM_STEP));
        zoomOutButton?.addEventListener("click", () => setZoom(zoom - ZOOM_STEP));
        zoomResetButton?.addEventListener("click", resetZoom);

        preview.addEventListener("dragstart", (event) => event.preventDefault());
        preview.addEventListener("dblclick", () => setZoom(zoom > 1 ? 1 : 2));
        previewWrapper.addEventListener("pointerdown", startPointer);
        previewWrapper.addEventListener("pointermove", movePointer);
        previewWrapper.addEventListener("pointerup", endPointer);
        previewWrapper.addEventListener("pointercancel", endPointer);

        function openGallery(index) {
            activeItems = collectGalleryItems();

            if (!activeItems.length) return;

            currentIndex = normalizeIndex(index, activeItems.length);
            lastFocusedElement = document.activeElement;
            lightbox.hidden = false;
            document.body.style.overflow = "hidden";
            updateViewer("next");

            const closeButton = lightbox.querySelector("[data-gallery-close]");
            closeButton?.focus({ preventScroll: true });
        }

        function closeGallery() {
            lightbox.hidden = true;
            document.body.style.overflow = "";
            resetZoom();

            if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
                lastFocusedElement.focus({ preventScroll: true });
            }
        }

        function updateViewer(direction) {
            const item = activeItems[currentIndex];

            if (!item) return;

            resetZoom();
            animatePreview(direction);
            preview.src = item.src;
            preview.alt = item.title || "";

            if (title) title.textContent = item.title || "";
            if (description) description.textContent = item.subtitle || "";
            if (counter) counter.textContent = `${currentIndex + 1} / ${activeItems.length}`;

            if (progress) {
                progress.style.width = `${((currentIndex + 1) / activeItems.length) * 100}%`;
            }

            if (progressWrap) {
                progressWrap.setAttribute("aria-valuemax", String(activeItems.length));
                progressWrap.setAttribute("aria-valuenow", String(currentIndex + 1));
            }

            preloadNearbyImages(currentIndex, activeItems);
        }

        function nextImage(direction = "next") {
            currentIndex = normalizeIndex(currentIndex + 1, activeItems.length);
            updateViewer(direction);
        }

        function previousImage(direction = "previous") {
            currentIndex = normalizeIndex(currentIndex - 1, activeItems.length);
            updateViewer(direction);
        }

        function handleLightboxKeys(event) {
            if (event.key === "Tab") {
                trapFocus(event);
                return;
            }

            switch (event.key) {
                case "Escape":
                    event.preventDefault();
                    closeGallery();
                    break;
                case "ArrowRight":
                    event.preventDefault();
                    nextImage("next");
                    break;
                case "ArrowLeft":
                    event.preventDefault();
                    previousImage("previous");
                    break;
                case "+":
                case "=":
                    event.preventDefault();
                    setZoom(zoom + ZOOM_STEP);
                    break;
                case "-":
                case "_":
                    event.preventDefault();
                    setZoom(zoom - ZOOM_STEP);
                    break;
                case "0":
                    event.preventDefault();
                    resetZoom();
                    break;
                default:
                    break;
            }
        }

        function trapFocus(event) {
            const focusable = [...lightbox.querySelectorAll("button, [href], input, textarea, select, [tabindex]:not([tabindex='-1'])")]
                .filter((element) => !element.disabled && element.offsetParent !== null);

            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }

        function setZoom(value) {
            zoom = clamp(value, 1, MAX_ZOOM);

            if (zoom === 1) {
                panX = 0;
                panY = 0;
            }

            updateZoomStyles();
        }

        function resetZoom() {
            zoom = 1;
            panX = 0;
            panY = 0;
            updateZoomStyles();
        }

        function updateZoomStyles() {
            preview.style.setProperty("--zoom", zoom.toFixed(2));
            preview.style.setProperty("--pan-x", `${panX}px`);
            preview.style.setProperty("--pan-y", `${panY}px`);
            previewWrapper.classList.toggle("is-zoomed", zoom > 1);

            if (zoomLabel) {
                zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
            }
        }

        function startPointer(event) {
            if (event.button && event.pointerType === "mouse") return;

            pointerState = {
                id: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                lastX: event.clientX,
                lastY: event.clientY,
                mode: zoom > 1 ? "pan" : "swipe"
            };

            previewWrapper.setPointerCapture?.(event.pointerId);

            if (pointerState.mode === "pan") {
                event.preventDefault();
            }
        }

        function movePointer(event) {
            if (!pointerState || pointerState.id !== event.pointerId) return;

            const dx = event.clientX - pointerState.lastX;
            const dy = event.clientY - pointerState.lastY;

            pointerState.lastX = event.clientX;
            pointerState.lastY = event.clientY;

            if (pointerState.mode === "pan") {
                panX += dx;
                panY += dy;
                updateZoomStyles();
                event.preventDefault();
            }
        }

        function endPointer(event) {
            if (!pointerState || pointerState.id !== event.pointerId) return;

            const totalX = event.clientX - pointerState.startX;
            const totalY = event.clientY - pointerState.startY;
            const isSwipe = pointerState.mode === "swipe" && Math.abs(totalX) > 54 && Math.abs(totalX) > Math.abs(totalY) * 1.2;

            previewWrapper.releasePointerCapture?.(event.pointerId);
            pointerState = null;

            if (!isSwipe) return;

            if (totalX < 0) {
                nextImage("next");
            } else {
                previousImage("previous");
            }
        }

        function animatePreview(direction) {
            previewWrapper.dataset.direction = direction;
            previewWrapper.classList.remove("is-switching");
            window.requestAnimationFrame(() => {
                previewWrapper.classList.add("is-switching");
                window.setTimeout(() => previewWrapper.classList.remove("is-switching"), 260);
            });
        }
    }

    function setupMusicPlayer() {
        const player = document.querySelector("[data-player]");
        const audio = document.querySelector("[data-audio]");

        if (!player || !audio || !tracks.length) return;

        const cover = document.querySelector("[data-player-cover]");
        const title = document.querySelector("[data-player-title]");
        const artist = document.querySelector("[data-player-artist]");
        const playButton = document.querySelector("[data-play-toggle]");
        const playIcon = document.querySelector("[data-play-icon]");
        const prevButton = document.querySelector("[data-prev-track]");
        const nextButton = document.querySelector("[data-next-track]");
        const progress = document.querySelector("[data-player-progress]");
        const currentTime = document.querySelector("[data-current-time]");
        const duration = document.querySelector("[data-duration]");
        const status = document.querySelector("[data-player-status]");
        const volume = document.querySelector("[data-volume]");
        const muteButton = document.querySelector("[data-mute-toggle]");
        const muteIcon = document.querySelector("[data-mute-icon]");
        const shuffleButton = document.querySelector("[data-shuffle-toggle]");
        const repeatOneButton = document.querySelector("[data-repeat-one]");
        const repeatListButton = document.querySelector("[data-repeat-list]");
        const playlist = document.querySelector("[data-playlist]");

        const savedState = readPlayerState();
        let trackIndex = normalizeIndex(Number(savedState.trackIndex) || 0, tracks.length);
        let repeatMode = ["off", "one", "all"].includes(savedState.repeatMode) ? savedState.repeatMode : "all";
        let shuffleEnabled = Boolean(savedState.shuffle);
        let isSeeking = false;
        let pendingRestoreTime = clamp(Number(savedState.currentTime) || 0, 0, Number.MAX_SAFE_INTEGER);
        let resumeAfterMetadata = Boolean(savedState.wasPlaying);
        let saveTimer = null;
        let progressFrame = null;
        let shuffleHistory = [];
        let shufflePlayed = new Set([trackIndex]);
        const preloadedTracks = new Map();

        audio.preload = "auto";
        audio.volume = clamp(Number(savedState.volume ?? DEFAULT_VOLUME), 0, 1);
        audio.muted = Boolean(savedState.muted);

        if (volume) {
            volume.value = audio.volume.toFixed(2);
            setRangeFill(volume, audio.volume, 1);
        }

        renderPlaylist();
        syncModeControls();
        syncMuteControls();
        loadTrack(trackIndex, {
            restoreTime: pendingRestoreTime,
            resumeAfterReady: resumeAfterMetadata
        });

        playButton?.addEventListener("click", () => {
            if (audio.paused) {
                playCurrent();
            } else {
                audio.pause();
            }
        });

        prevButton?.addEventListener("click", previousTrack);
        nextButton?.addEventListener("click", () => nextTrack({ shouldPlay: !audio.paused, manual: true }));

        shuffleButton?.addEventListener("click", () => {
            shuffleEnabled = !shuffleEnabled;
            shufflePlayed = new Set([trackIndex]);
            syncModeControls();
            savePlayerState();
            showToast(shuffleEnabled ? "Aleatorio activado." : "Aleatorio desactivado.");
        });

        repeatOneButton?.addEventListener("click", () => {
            repeatMode = repeatMode === "one" ? "off" : "one";
            syncModeControls();
            savePlayerState();
        });

        repeatListButton?.addEventListener("click", () => {
            repeatMode = repeatMode === "all" ? "off" : "all";
            syncModeControls();
            savePlayerState();
        });

        progress?.addEventListener("input", () => {
            isSeeking = true;
            setRangeFill(progress, progress.value, 100);

            if (currentTime && Number.isFinite(audio.duration)) {
                currentTime.textContent = formatTime((Number(progress.value) / 100) * audio.duration);
            }
        });

        progress?.addEventListener("change", () => {
            if (Number.isFinite(audio.duration)) {
                audio.currentTime = (Number(progress.value) / 100) * audio.duration;
            }

            isSeeking = false;
            updateProgress();
            savePlayerState();
        });

        volume?.addEventListener("input", () => {
            const nextVolume = clamp(Number(volume.value), 0, 1);
            audio.volume = nextVolume;
            audio.muted = nextVolume === 0 ? true : false;
            setRangeFill(volume, nextVolume, 1);
            syncMuteControls();
            savePlayerState();
        });

        muteButton?.addEventListener("click", () => {
            if (audio.muted && audio.volume === 0) {
                audio.volume = DEFAULT_VOLUME;
                if (volume) {
                    volume.value = DEFAULT_VOLUME.toFixed(2);
                    setRangeFill(volume, DEFAULT_VOLUME, 1);
                }
            }

            audio.muted = !audio.muted;
            syncMuteControls();
            savePlayerState();
        });

        audio.addEventListener("play", () => {
            setPlayingState(true);
            savePlayerState({ wasPlaying: true });
        });

        audio.addEventListener("pause", () => {
            setPlayingState(false);
            savePlayerState({ wasPlaying: false });
        });

        audio.addEventListener("ended", handleTrackEnd);

        audio.addEventListener("loadedmetadata", () => {
            if (Number.isFinite(pendingRestoreTime) && pendingRestoreTime > 0 && Number.isFinite(audio.duration)) {
                audio.currentTime = Math.min(pendingRestoreTime, Math.max(audio.duration - 1, 0));
            }

            pendingRestoreTime = 0;
            if (duration) duration.textContent = formatTime(audio.duration);
            updateProgress();

            if (resumeAfterMetadata) {
                resumeAfterMetadata = false;
                playCurrent(true);
            }
        });

        audio.addEventListener("timeupdate", () => {
            if (isSeeking) return;

            requestProgressUpdate();
            schedulePlayerSave();
        });

        audio.addEventListener("volumechange", () => {
            if (volume && Number(volume.value) !== audio.volume) {
                volume.value = audio.volume.toFixed(2);
                setRangeFill(volume, audio.volume, 1);
            }

            syncMuteControls();
        });

        audio.addEventListener("waiting", () => {
            player.classList.add("is-loading");
            updateStatus("Cargando un pedacito bonito...");
        });

        audio.addEventListener("playing", () => {
            player.classList.remove("is-loading");
            updateStatus("Sonando suave");
        });

        audio.addEventListener("error", () => {
            player.classList.remove("is-loading", "is-playing");
            updateStatus("No pude cargar esta cancion");
        });

        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                savePlayerState();
            }
        });

        window.addEventListener("pagehide", () => savePlayerState());

        function loadTrack(index, options = {}) {
            const nextIndex = normalizeIndex(index, tracks.length);
            const track = tracks[nextIndex];

            if (!track) return;

            trackIndex = nextIndex;
            pendingRestoreTime = clamp(Number(options.restoreTime) || 0, 0, Number.MAX_SAFE_INTEGER);
            resumeAfterMetadata = Boolean(options.resumeAfterReady);
            player.classList.add("is-changing");
            audio.src = resolveAsset(track.src);
            audio.load();

            window.setTimeout(() => player.classList.remove("is-changing"), 260);

            if (cover) {
                cover.src = track.cover;
                cover.alt = `Portada de ${track.title}`;
            }

            if (title) title.textContent = track.title;
            if (artist) artist.textContent = track.artist;
            if (currentTime) currentTime.textContent = "0:00";
            if (duration) duration.textContent = "0:00";

            if (progress) {
                progress.value = 0;
                setRangeFill(progress, 0, 100);
            }

            syncPlaylistState();
            preloadNearbyTracks(trackIndex);
            updateStatus(options.resumeAfterReady ? "Intentando continuar..." : `Lista: ${track.title}`);
            savePlayerState();

            if (options.shouldPlay && !options.resumeAfterReady) {
                playCurrent();
            }
        }

        function playCurrent(isResumeAttempt = false) {
            player.classList.add("is-loading");

            audio.play()
                .then(() => {
                    player.classList.remove("is-loading");
                    updateStatus("Sonando suave");
                })
                .catch(() => {
                    player.classList.remove("is-loading");
                    setPlayingState(false);
                    updateStatus(isResumeAttempt ? "Toca play para continuar" : "Toca play para empezar");
                    savePlayerState({ wasPlaying: false });
                });
        }

        function previousTrack() {
            if (audio.currentTime > 3) {
                audio.currentTime = 0;
                updateProgress();
                savePlayerState();
                return;
            }

            const nextIndex = shuffleEnabled && shuffleHistory.length
                ? shuffleHistory.pop()
                : normalizeIndex(trackIndex - 1, tracks.length);

            loadTrack(nextIndex, { shouldPlay: !audio.paused });
        }

        function nextTrack({ shouldPlay = true, manual = false } = {}) {
            const nextIndex = getNextTrackIndex(manual);

            if (nextIndex === null) {
                audio.pause();
                audio.currentTime = 0;
                updateProgress();
                updateStatus("Lista terminada");
                savePlayerState({ wasPlaying: false });
                return;
            }

            shuffleHistory.push(trackIndex);
            loadTrack(nextIndex, { shouldPlay });
        }

        function handleTrackEnd() {
            if (repeatMode === "one") {
                audio.currentTime = 0;
                playCurrent();
                return;
            }

            nextTrack({ shouldPlay: true });
        }

        function getNextTrackIndex(manual) {
            if (!shuffleEnabled) {
                const isLastTrack = trackIndex >= tracks.length - 1;

                if (isLastTrack && repeatMode !== "all" && !manual) {
                    return null;
                }

                return normalizeIndex(trackIndex + 1, tracks.length);
            }

            shufflePlayed.add(trackIndex);
            let candidates = tracks
                .map((_, index) => index)
                .filter((index) => index !== trackIndex && !shufflePlayed.has(index));

            if (!candidates.length) {
                if (repeatMode !== "all" && !manual) return null;

                shufflePlayed = new Set([trackIndex]);
                candidates = tracks.map((_, index) => index).filter((index) => index !== trackIndex);
            }

            const nextIndex = candidates[Math.floor(Math.random() * candidates.length)];
            shufflePlayed.add(nextIndex);
            return nextIndex;
        }

        function setPlayingState(isPlaying) {
            player.classList.toggle("is-playing", isPlaying);

            if (playIcon) {
                playIcon.textContent = isPlaying ? "||" : "\u25b6";
            }

            if (playButton) {
                playButton.setAttribute("aria-label", isPlaying ? "Pausar" : "Reproducir");
            }

            if (!isPlaying && !player.classList.contains("is-loading")) {
                updateStatus("En pausa, esperando por ti");
            }
        }

        function updateProgress() {
            const current = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;
            const total = Number.isFinite(audio.duration) ? audio.duration : 0;
            const percent = total ? (current / total) * 100 : 0;

            if (currentTime) currentTime.textContent = formatTime(current);
            if (duration) duration.textContent = formatTime(total);

            if (progress) {
                progress.value = String(percent);
                setRangeFill(progress, percent, 100);
            }
        }

        function requestProgressUpdate() {
            if (progressFrame) return;

            progressFrame = window.requestAnimationFrame(() => {
                progressFrame = null;
                updateProgress();
            });
        }

        function updateStatus(message) {
            if (status) status.textContent = message;
        }

        function renderPlaylist() {
            if (!playlist) return;

            const fragment = document.createDocumentFragment();

            tracks.forEach((track, index) => {
                const button = document.createElement("button");
                button.className = "playlist-track";
                button.type = "button";
                button.dataset.trackIndex = String(index);
                button.setAttribute("aria-label", `Reproducir ${track.title}`);

                const trackTitle = document.createElement("span");
                trackTitle.className = "playlist-track-title";
                trackTitle.textContent = track.title;

                const trackArtist = document.createElement("span");
                trackArtist.className = "playlist-track-artist";
                trackArtist.textContent = track.artist;

                button.append(trackTitle, trackArtist);
                button.addEventListener("click", () => {
                    shuffleHistory.push(trackIndex);
                    trackIndex = index;
                    shufflePlayed.add(trackIndex);
                    loadTrack(trackIndex, { shouldPlay: true });
                    showToast(`Esta cancion es para ti: ${track.title}`);
                });

                fragment.append(button);
            });

            playlist.replaceChildren(fragment);
        }

        function syncPlaylistState() {
            if (!playlist) return;

            let activeTrack = null;

            playlist.querySelectorAll("[data-track-index]").forEach((button) => {
                const isActive = Number(button.dataset.trackIndex) === trackIndex;
                button.classList.toggle("is-active", isActive);
                button.setAttribute("aria-current", isActive ? "true" : "false");

                if (isActive) activeTrack = button;
            });

            activeTrack?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
        }

        function syncModeControls() {
            shuffleButton?.setAttribute("aria-pressed", String(shuffleEnabled));
            repeatOneButton?.setAttribute("aria-pressed", String(repeatMode === "one"));
            repeatListButton?.setAttribute("aria-pressed", String(repeatMode === "all"));
        }

        function syncMuteControls() {
            const isMuted = audio.muted || audio.volume === 0;
            muteButton?.setAttribute("aria-pressed", String(isMuted));
            muteButton?.setAttribute("aria-label", isMuted ? "Activar sonido" : "Silenciar");

            if (muteIcon) {
                muteIcon.textContent = isMuted ? "\ud83d\udd07" : "\ud83d\udd0a";
            }
        }

        function preloadNearbyTracks(index) {
            runWhenIdle(() => {
                [index, index + 1, index + 2, index - 1].forEach((candidate) => {
                    preloadTrack(normalizeIndex(candidate, tracks.length));
                });
            });
        }

        function preloadTrack(index) {
            const track = tracks[index];

            if (!track || preloadedTracks.has(track.src)) return;

            const buffered = new Audio();
            buffered.preload = "metadata";
            buffered.src = resolveAsset(track.src);
            preloadedTracks.set(track.src, buffered);
        }

        function schedulePlayerSave() {
            window.clearTimeout(saveTimer);
            saveTimer = window.setTimeout(() => savePlayerState(), 500);
        }

        function savePlayerState(overrides = {}) {
            writeJson(STORAGE_KEYS.player, {
                trackIndex,
                currentTime: Number.isFinite(audio.currentTime) ? audio.currentTime : 0,
                volume: audio.volume,
                muted: audio.muted,
                shuffle: shuffleEnabled,
                repeatMode,
                wasPlaying: !audio.paused,
                updatedAt: Date.now(),
                ...overrides
            });
        }
    }

    function setupExperienceActions() {
        document.querySelectorAll("[data-scroll-to]").forEach((button) => {
            button.addEventListener("click", () => {
                const target = document.getElementById(button.dataset.scrollTo);

                if (!target) return;

                target.scrollIntoView({ behavior: "smooth", block: "start" });
                showToast("Te llevo a un recuerdo bonito.");
            });
        });

        document.querySelectorAll("[data-random-photo]").forEach((button) => {
            button.addEventListener("click", () => {
                const items = collectGalleryCards();

                if (!items.length || typeof window.openRomancePhoto !== "function") return;

                const index = Math.floor(Math.random() * items.length);
                window.openRomancePhoto(index);
                showToast("Elegimos una foto tuya para sonreir desde aqui.");
            });
        });

        document.querySelectorAll("[data-player-focus]").forEach((button) => {
            button.addEventListener("click", () => {
                const player = document.querySelector("[data-player]");

                if (!player) return;

                player.scrollIntoView({ behavior: "smooth", block: "center" });
                player.classList.add("is-highlighted");
                window.setTimeout(() => player.classList.remove("is-highlighted"), 1100);
                showToast("Ponle play a este pedacito de lo que siento por ti.");
            });
        });

        document.addEventListener("click", (event) => {
            const button = event.target.closest("[data-save-photo]");

            if (!button) return;

            event.preventDefault();
            event.stopPropagation();
            toggleFavoritePhoto(button.dataset.savePhoto);
        });
    }

    function setupNotes() {
        const form = document.querySelector("[data-notes-form]");
        const input = document.querySelector("[data-note-input]");
        const list = document.querySelector("[data-notes-list]");
        const status = document.querySelector("[data-notes-status]");

        if (!form || !input || !list) return;

        renderNotes();

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const text = input.value.trim();

            if (!text) {
                input.focus();
                return;
            }

            const notes = readNotes();
            notes.unshift({
                id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
                text,
                createdAt: Date.now()
            });

            writeNotes(notes);
            input.value = "";
            renderNotes();

            if (status) status.textContent = "Nota guardada";
            showToast("Nota guardada para volver a leerla.");
        });

        input.addEventListener("input", () => {
            if (status) status.textContent = `${input.value.length}/420`;
        });

        list.addEventListener("click", (event) => {
            const button = event.target.closest("[data-delete-note]");

            if (!button) return;

            const notes = readNotes().filter((note) => note.id !== button.dataset.deleteNote);
            writeNotes(notes);
            renderNotes();
            showToast("Nota eliminada.");
        });

        function renderNotes() {
            const notes = readNotes();

            if (!notes.length) {
                const empty = document.createElement("div");
                empty.className = "notes-empty";
                empty.textContent = "Aun no hay notas guardadas.";
                list.replaceChildren(empty);
                return;
            }

            const fragment = document.createDocumentFragment();

            notes.forEach((note) => {
                const article = document.createElement("article");
                article.className = "note-card";

                const text = document.createElement("p");
                text.textContent = note.text;

                const footer = document.createElement("div");
                footer.className = "note-card-footer";

                const time = document.createElement("time");
                time.dateTime = new Date(note.createdAt).toISOString();
                time.textContent = formatDate(note.createdAt);

                const deleteButton = document.createElement("button");
                deleteButton.type = "button";
                deleteButton.dataset.deleteNote = note.id;
                deleteButton.setAttribute("aria-label", "Eliminar nota");
                deleteButton.title = "Eliminar nota";
                deleteButton.textContent = "\u00d7";

                footer.append(time, deleteButton);
                article.append(text, footer);
                fragment.append(article);
            });

            list.replaceChildren(fragment);
        }
    }

    function toggleFavoritePhoto(src) {
        if (!src || !photoBySource.has(src)) return;

        if (favoritePhotos.has(src)) {
            favoritePhotos.delete(src);
            showToast("La quite de tus fotos favoritas.");
        } else {
            favoritePhotos.add(src);
            showToast("Guardada en tus fotos favoritas.");
        }

        writeSavedPhotos(favoritePhotos);
        renderFavoritesGallery();
        syncFavoriteButtons();
        updateSavedCounter();
    }

    function updateSavedCounter() {
        const counter = document.querySelector("[data-saved-counter]");
        const count = favoritePhotos.size;

        syncFavoriteButtons();

        if (counter) {
            counter.textContent = count === 1 ? "1 foto guardada" : `${count} fotos guardadas`;
        }
    }

    function applyFavoriteButtonState(button) {
        const isSaved = favoritePhotos.has(button.dataset.savePhoto);
        button.setAttribute("aria-pressed", String(isSaved));
        button.textContent = isSaved ? HEART_FILLED : HEART_EMPTY;
    }

    function syncFavoriteButtons() {
        document.querySelectorAll("[data-save-photo]").forEach(applyFavoriteButtonState);
    }

    function setupRevealAnimations() {
        const revealElements = document.querySelectorAll("[data-reveal]");

        if (!revealElements.length) return;

        if (!("IntersectionObserver" in window)) {
            revealElements.forEach((element) => element.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: "0px 0px -6% 0px"
        });

        revealElements.forEach((element) => observer.observe(element));
    }

    function preloadInitialImages() {
        runWhenIdle(() => {
            photoCatalog.slice(0, 8).forEach((item) => preloadImage(item.src));
            photoCatalog.filter((item) => item.special).slice(0, 4).forEach((item) => preloadImage(item.src));
        });
    }

    const imageCache = new Map();

    function preloadNearbyImages(index, items) {
        runWhenIdle(() => {
            [-2, -1, 0, 1, 2].forEach((offset) => {
                const item = items[normalizeIndex(index + offset, items.length)];
                if (item) preloadImage(item.src);
            });
        });
    }

    function preloadImage(src) {
        if (!src || imageCache.has(src)) return;

        const img = new Image();
        img.decoding = "async";
        img.src = src;
        imageCache.set(src, img);
    }

    function collectGalleryCards() {
        return [...document.querySelectorAll("[data-gallery-item]")];
    }

    function collectGalleryItems() {
        return collectGalleryCards().map((card) => ({
            src: card.dataset.src,
            title: card.dataset.title,
            subtitle: card.dataset.subtitle
        }));
    }

    function readSavedPhotos() {
        const value = readJson(STORAGE_KEYS.savedPhotos, []);
        return new Set(Array.isArray(value) ? value : []);
    }

    function writeSavedPhotos(savedPhotos) {
        writeJson(STORAGE_KEYS.savedPhotos, [...savedPhotos]);
    }

    function readPlayerState() {
        const value = readJson(STORAGE_KEYS.player, {});
        return value && typeof value === "object" ? value : {};
    }

    function readNotes() {
        const value = readJson(STORAGE_KEYS.notes, []);
        return Array.isArray(value) ? value : [];
    }

    function writeNotes(notes) {
        writeJson(STORAGE_KEYS.notes, notes.slice(0, 80));
    }

    function readJson(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    }

    function writeJson(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            showToast("No pude guardar en este navegador.");
        }
    }

    function showToast(message) {
        const toast = document.querySelector("[data-toast]");

        if (!toast) return;

        window.clearTimeout(toastTimer);
        toast.textContent = message;
        toast.hidden = false;
        toast.classList.remove("is-leaving");
        toast.classList.add("is-visible");

        toastTimer = window.setTimeout(() => {
            toast.classList.add("is-leaving");
            toast.classList.remove("is-visible");
            window.setTimeout(() => {
                toast.hidden = true;
                toast.classList.remove("is-leaving");
            }, 260);
        }, 2400);
    }

    function setRangeFill(input, value, max) {
        const percent = max ? (Number(value) / Number(max)) * 100 : 0;
        input.style.setProperty("--progress", `${clamp(percent, 0, 100)}%`);
    }

    function formatTime(value) {
        if (!Number.isFinite(value) || value < 0) return "0:00";

        const minutes = Math.floor(value / 60);
        const seconds = Math.floor(value % 60).toString().padStart(2, "0");

        return `${minutes}:${seconds}`;
    }

    function formatDate(value) {
        try {
            return new Intl.DateTimeFormat("es", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }).format(new Date(value));
        } catch {
            return "Guardada";
        }
    }

    function normalizeIndex(index, length) {
        if (!length) return 0;
        return ((index % length) + length) % length;
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function resolveAsset(path) {
        return new URL(path, window.location.href).href;
    }

    function runWhenIdle(callback) {
        if ("requestIdleCallback" in window) {
            window.requestIdleCallback(callback, { timeout: 900 });
        } else {
            window.setTimeout(callback, 120);
        }
    }
})();
