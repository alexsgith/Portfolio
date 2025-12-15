document.addEventListener('DOMContentLoaded', () => {
    const scanButtons = document.querySelectorAll('.scan-btn');
    const missionCards = document.querySelectorAll('.mission-card');

    // Video Overlay Elements
    const videoOverlay = document.getElementById('video-overlay');
    const video = document.getElementById('overlay-video');
    const closeVideoBtn = document.getElementById('close-video-btn');

    // Image Overlay Elements
    const imageOverlay = document.getElementById('image-overlay');
    const overlayImage = document.getElementById('overlay-image');
    const closeImageBtn = document.getElementById('close-image-btn');

    // --- Image Overlay Logic ---

    // Handle card clicks (for image overlay)
    missionCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // If the click originated from the scan button, do nothing here (handled by scan button listener)
            if (e.target.classList.contains('scan-btn')) return;

            e.preventDefault();
            const imageSrc = card.getAttribute('href');
            if (imageSrc) {
                openImageOverlay(imageSrc);
            }
        });
    });

    function openImageOverlay(src) {
        overlayImage.src = src;
        imageOverlay.classList.add('active');
    }

    function closeImageOverlay() {
        imageOverlay.classList.remove('active');
        setTimeout(() => {
            overlayImage.src = "";
        }, 300); // Clear after transition
    }

    closeImageBtn.addEventListener('click', closeImageOverlay);

    imageOverlay.addEventListener('click', (e) => {
        if (e.target === imageOverlay || e.target.classList.contains('image-container')) {
            closeImageOverlay();
        }
    });

    // --- Video Overlay Logic ---

    // Video files mapping - assuming order matches the DOM order
    scanButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent bubbling to parent card link

            // Determine video source
            // Index 0 -> Demo.mp4
            // Index 1 -> Demo2.mp4
            // etc.
            const videoIndex = index === 0 ? '' : index + 1;
            const videoSrc = `Assets/Demo${videoIndex}.mp4`;

            // Check if video exists
            checkVideoExists(videoSrc)
                .then(exists => {
                    if (exists) {
                        openVideoOverlay(videoSrc);
                    } else {
                        // Fallback: Open Image Overlay
                        const card = btn.closest('.mission-card');
                        if (card && card.href) {
                            openImageOverlay(card.href);
                        }
                    }
                });
        });
    });

    function checkVideoExists(url) {
        return fetch(url, { method: 'HEAD' })
            .then(response => response.ok)
            .catch(() => false);
    }

    function openVideoOverlay(src) {
        video.src = src;
        videoOverlay.classList.add('active');
        video.play().catch(err => console.log("Video play error:", err));
    }

    function closeVideoOverlay() {
        videoOverlay.classList.remove('active');
        video.pause();
        video.currentTime = 0;
        video.src = ""; // Clear source
    }

    closeVideoBtn.addEventListener('click', closeVideoOverlay);

    // Close on click outside video container
    videoOverlay.addEventListener('click', (e) => {
        if (e.target === videoOverlay) {
            closeVideoOverlay();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (videoOverlay.classList.contains('active')) closeVideoOverlay();
            if (imageOverlay.classList.contains('active')) closeImageOverlay();
        }
    });
});
