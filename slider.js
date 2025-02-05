function popupGallery() {
    const gallery = document.querySelector('[data-gallery]');
    const images = document.querySelectorAll('[data-gallery-slide] img');
    const closeBtn = document.querySelector('[data-lightbox-close-btn]');
    const btnPrev = document.querySelector('[data-lightbox-prev-btn]');
    const btnNext = document.querySelector('[data-lightbox-next-btn]');
    const lightbox = document.querySelector('[data-lightbox]');
    const zoomInBtn = document.querySelector('[data-lightbox-zoom-in]');
    const zoomOutBtn = document.querySelector('[data-lightbox-zoom-out]');
    const thumbnailsInnerWrapper = document.querySelector("[data-lightbox-thumbnails-container]");
    const thumbnailsWrapper = document.querySelector('[data-lightbox-thumbnails-wrapper]');
    const lightboxImg = document.querySelector('[data-lightbox-main-img]');
    const currentImageNumber = document.querySelector('[data-lightbox-image-current]');
    const totalImageNumber = document.querySelector('[data-lightbox-image-total]');


    if (images.length === 0
        || !gallery
        || !closeBtn
        || !btnPrev
        || !lightbox
        || !btnNext
        || !zoomInBtn
        || !zoomOutBtn
        || !thumbnailsInnerWrapper
        || !lightboxImg
        || !currentImageNumber
        || !thumbnailsWrapper
        || !totalImageNumber) return;


    let currentScale = 1;
    const scaleSteps = [1, 1.25, 1.5, 1.75, 2];
    let currentIndex = 0;
    const totalImages = images.length;

    const getPropertyValue = (prop) =>
        parseInt(
            getComputedStyle(document.documentElement).getPropertyValue(prop)
        );

    const cardSize = getPropertyValue("--card-size");
    const cardGap = getPropertyValue("--card-gap");

    totalImageNumber.textContent = String(images.length);
    currentImageNumber.textContent = String(currentIndex + 1);

    function getWidth() {
        const thumbnailsWrapperWidth = thumbnailsWrapper.getBoundingClientRect().width;
        const thumbnailsInnerWrapperWidth = thumbnailsInnerWrapper.scrollWidth;

        return {
            wrapperWidth: thumbnailsWrapperWidth,
            innerWidth: thumbnailsInnerWrapperWidth
        };
    }

    gallery.addEventListener('click', (e) => {
        openLightbox(e);
        document.body.style.overflow = 'hidden';
    });

    function openLightbox(event) {
        if (event.target.tagName === 'IMG') {
            const clickedIndex = Array.from(images).indexOf(event.target);
            currentIndex = clickedIndex;
            updateLightboxImage();
            lightbox.style.display = 'flex';
        }
    }

    closeBtn.addEventListener('click', () => {
        closeLightbox();
        document.body.style.overflow = 'auto';
    });

    function closeLightbox() {
        lightbox.style.display = 'none';
        resetZoom();
    }

    btnPrev.addEventListener('click', () => {
        changeImage(-1);
    });

    btnNext.addEventListener('click', () => {
        changeImage(1);
    });

    zoomInBtn.addEventListener('click', () => {
        zoomImage(1);
    });

    zoomOutBtn.addEventListener('click', () => {
        zoomImage(-1);
    });

    function changeImage(direction) {
        currentIndex = (currentIndex + direction + totalImages) % totalImages;
        updateLightboxImage();
        slide();
    }

    function updateLightboxImage() {
        lightboxImg.classList.remove('show');


        setTimeout(() => {
            if (thumbnailsInnerWrapper.children.length === 0) {
                for (let i = 0; i < totalImages; i++) {
                    const gallerySlide = document.createElement('div');
                    const thumbnail = document.createElement('img');
                    gallerySlide.appendChild(thumbnail);
                    thumbnail.src = images[i].src;
                    thumbnail.alt = `Thumbnail ${i + 1}`;
                    gallerySlide.classList.add('thumbnail');
                    thumbnailsInnerWrapper.appendChild(gallerySlide);
                }

                const thumbnailsArray = document.querySelectorAll('.thumbnail');
                thumbnailsArray.forEach((thumbnail, index) => {
                    thumbnail.addEventListener('click', () => {
                        updateMainImage(index);
                    });
                });
            }

            const thumbnailsArray = document.querySelectorAll('.thumbnail');
            thumbnailsArray.forEach(thumbnail => thumbnail.classList.remove('active-thumbnail'));
            thumbnailsArray[currentIndex].classList.add('active-thumbnail');

            lightboxImg.src = images[currentIndex].src;
            currentImageNumber.textContent = String(currentIndex + 1);
            slide();

            lightboxImg.classList.add('show');
        }, 200); // Effect for opacity transition
    }

    function slide() {
        const { wrapperWidth, innerWidth } = getWidth();

        if (innerWidth <= wrapperWidth) {
            thumbnailsInnerWrapper.style.transform = `translateX(0px)`;
            thumbnailsInnerWrapper.classList.add('is-narrow');
        } else {
            thumbnailsInnerWrapper.classList.remove('is-narrow');
            const translate = Math.max(0, (cardSize + cardGap) * (currentIndex - 1) - cardSize / 2);
            const maxTranslate = Math.max(0, (cardSize + cardGap) * (totalImages - 1) - cardSize);
            thumbnailsInnerWrapper.style.transition = 'transform 0.3s ease';
            thumbnailsInnerWrapper.style.transform = `translateX(-${Math.min(translate, maxTranslate)}px)`;
        }
    }

    function updateMainImage(index) {
        currentIndex = index;
        updateLightboxImage();
        slide();
    }

    function zoomImage(direction) {
        const currentStepIndex = scaleSteps.indexOf(currentScale);
        if (direction === 1 && currentStepIndex < scaleSteps.length - 1) {
            currentScale = scaleSteps[currentStepIndex + 1];
        } else if (direction === -1 && currentStepIndex > 0) {
            currentScale = scaleSteps[currentStepIndex - 1];
        }
        lightboxImg.style.transform = `scale(${currentScale})`;
    }

    function resetZoom() {
        currentScale = 1;
        lightboxImg.style.transform = `scale(${currentScale})`;
    }

    updateLightboxImage();

    document.addEventListener('keydown', function (e) {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                changeImage(-1);
            } else if (e.key === 'ArrowRight') {
                changeImage(1);
            }
        }
    });

    let startX;
    let endX;

    lightbox.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
    });

    lightbox.addEventListener('touchmove', function (e) {
        endX = e.touches[0].clientX;
    });

    lightbox.addEventListener('touchend', function () {
        if (startX > endX + 50) {
            changeImage(1);
        } else if (startX < endX - 50) {
            changeImage(-1);
        }
    });
}

popupGallery();
