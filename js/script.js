/* =========================================================
   STARFIELD + SHOOTING STARS
========================================================= */

(function initStarfield() {

    const canvas = document.getElementById("starfield");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let width, height, stars, shootingStars;

    const STAR_COLORS = [
        "255, 255, 255",
        "180, 210, 255",
        "125, 211, 252",
        "167, 139, 250"
    ];

    function resize() {

        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;

        const divisor = width <= 768 ? 48000 : 14000;
        const count = Math.floor((width * height) / divisor);

        stars = Array.from({ length: count }, () => createStar());

    }

    function createStar() {

        return {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.4 + 0.3,
            color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
            baseAlpha: Math.random() * 0.6 + 0.3,
            twinkleSpeed: (Math.random() * 0.02 + 0.005) * (width <= 768 ? 0.55 : 1),
            twinklePhase: Math.random() * Math.PI * 2
        };

    }

    function createShootingStar() {

        const startX = Math.random() * width * 0.7 + width * 0.15;
        const startY = Math.random() * height * 0.35;
        const angle = (Math.random() * 20 + 25) * (Math.PI / 180);
        const speed = Math.random() * 9 + 9;

        return {
            x: startX,
            y: startY,
            length: Math.random() * 110 + 90,
            speed,
            angle,
            life: 1,
            decay: Math.random() * 0.012 + 0.01
        };

    }

    shootingStars = [];

    function scheduleShootingStar() {

        const delay = window.innerWidth <= 768
            ? Math.random() * 6500 + 4500
            : Math.random() * 4200 + 2200;

        setTimeout(() => {

            if (!document.hidden) shootingStars.push(createShootingStar());

            scheduleShootingStar();

        }, delay);

    }

    function draw() {

        ctx.clearRect(0, 0, width, height);

        /* Stars */

        stars.forEach(star => {

            star.twinklePhase += star.twinkleSpeed;

            const alpha =
                star.baseAlpha +
                Math.sin(star.twinklePhase) * (width <= 768 ? 0.20 : 0.35);

            ctx.beginPath();

            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

            ctx.fillStyle =
                `rgba(${star.color}, ${Math.max(0, Math.min(1, alpha))})`;

            ctx.fill();

        });

        /* Shooting Stars */

        shootingStars.forEach(shot => {

            const dx = Math.cos(shot.angle);
            const dy = Math.sin(shot.angle);

            const tailX = shot.x - dx * shot.length;
            const tailY = shot.y - dy * shot.length;

            const gradient = ctx.createLinearGradient(
                shot.x, shot.y, tailX, tailY
            );

            gradient.addColorStop(0, `rgba(255, 255, 255, ${shot.life})`);
            gradient.addColorStop(0.4, `rgba(125, 211, 252, ${shot.life * 0.6})`);
            gradient.addColorStop(1, "rgba(139, 92, 246, 0)");

            ctx.beginPath();

            ctx.moveTo(shot.x, shot.y);
            ctx.lineTo(tailX, tailY);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.lineCap = "round";

            ctx.stroke();

            shot.x += dx * shot.speed;
            shot.y += dy * shot.speed;
            shot.life -= shot.decay;

        });

        shootingStars = shootingStars.filter(
            shot => shot.life > 0 && shot.y < height + 100 && shot.x < width + 100
        );

        requestAnimationFrame(draw);

    }

    resize();

    window.addEventListener("resize", resize);

    scheduleShootingStar();

    draw();

})();


/* =========================================================
   ELEMENTS
========================================================= */

const header =
    document.querySelector(".header");

const menuButton =
    document.getElementById("menuButton");

const navLinksContainer =
    document.getElementById("navLinks");

const navLinks =
    document.querySelectorAll(".nav-link");

const backToTop =
    document.getElementById("backToTop");

const scrollProgress =
    document.getElementById("scrollProgress");

const cursorGlow =
    document.querySelector(".cursor-glow");

const revealElements =
    document.querySelectorAll(".reveal");

const statNumbers =
    document.querySelectorAll(".stat-number:not(.stats-grid .stat-number)");

const pageSections = document.querySelectorAll("section[id]");


/* =========================================================
   MOBILE MENU
========================================================= */

menuButton.addEventListener(
    "click",
    () => {

        navLinksContainer
            .classList
            .toggle("open");


        const icon =
            menuButton.querySelector("i");


        icon.classList.toggle(
            "fa-bars"
        );


        icon.classList.toggle(
            "fa-xmark"
        );

    }
);


navLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            () => {

                navLinksContainer
                    .classList
                    .remove("open");


                const icon =
                    menuButton.querySelector("i");


                icon.classList.add(
                    "fa-bars"
                );


                icon.classList.remove(
                    "fa-xmark"
                );

            }
        );

    }
);


/* =========================================================
   SCROLL EVENTS
========================================================= */

window.addEventListener(
    "scroll",
    () => {


        /* Header */

        if (
            window.scrollY > 30
        ) {

            header.classList.add(
                "scrolled"
            );

        } else {

            header.classList.remove(
                "scrolled"
            );

        }


        /* Back To Top */

        if (
            window.scrollY > 600
        ) {

            backToTop.classList.add(
                "show"
            );

        } else {

            backToTop.classList.remove(
                "show"
            );

        }


        /* Scroll Progress */

        const scrollTop =
            window.scrollY;

        const documentHeight =
            document.documentElement
                .scrollHeight
            -
            window.innerHeight;


        const progress =
            documentHeight > 0
                ?
                (
                    scrollTop /
                    documentHeight
                ) * 100
                :
                0;


        scrollProgress.style.width =
            progress + "%";


        updateActiveNavigation();

    }
);


/* =========================================================
   BACK TO TOP
========================================================= */

backToTop.addEventListener(
    "click",
    () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }
);


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

function updateActiveNavigation() {

    const sections = pageSections;


    let currentSection =
        "home";


    sections.forEach(
        section => {

            const sectionTop =
                section.offsetTop - 180;


            if (
                window.scrollY >=
                sectionTop
            ) {

                currentSection =
                    section.id;

            }

        }
    );


    navLinks.forEach(
        link => {

            link.classList.remove(
                "active"
            );


            if (
                link.getAttribute(
                    "href"
                ) ===
                "#" + currentSection
            ) {

                link.classList.add(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   REVEAL ON SCROLL
========================================================= */

const revealObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target
                            .classList
                            .add(
                                "active"
                            );


                        revealObserver
                            .unobserve(
                                entry.target
                            );

                    }

                }
            );

        },

        {

            threshold: 0.12

        }

    );


revealElements.forEach(
    element => {

        revealObserver.observe(
            element
        );

    }
);


/* =========================================================
   ANIMATED COUNTERS
========================================================= */

const counterObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        animateCounter(
                            entry.target
                        );


                        counterObserver
                            .unobserve(
                                entry.target
                            );

                    }

                }
            );

        },

        {

            threshold: 0.7

        }

    );


statNumbers.forEach(
    number => {

        counterObserver.observe(
            number
        );

    }
);


function animateCounter(
    element
) {

    const target =
        Number(
            element.dataset.target
        );


    let current = 0;


    const duration =
        1300;


    const increment =
        target /
        (
            duration / 16
        );


    function updateCounter() {

        current += increment;


        if (
            current < target
        ) {

            element.textContent =
                Math.floor(
                    current
                );


            requestAnimationFrame(
                updateCounter
            );

        } else {

            element.textContent =
                target;

        }

    }


    updateCounter();

}


/* =========================================================
   CURSOR GLOW
========================================================= */

if (
    cursorGlow
) {

    window.addEventListener(
        "mousemove",
        event => {

            cursorGlow.style.left =
                event.clientX +
                "px";


            cursorGlow.style.top =
                event.clientY +
                "px";

        }
    );

}


/* =========================================================
   PROJECT CARD MOUSE EFFECT
========================================================= */

const interactiveCards =
    document.querySelectorAll(
        ".quality-card"
    );


if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
interactiveCards.forEach(
    card => {

        const is3dTilt =
            card.classList.contains("project-card") ||
            card.classList.contains("tilt-card");

        card.addEventListener(
            "mousemove",
            event => {

                const rect =
                    card.getBoundingClientRect();


                const x =
                    event.clientX -
                    rect.left;


                const y =
                    event.clientY -
                    rect.top;


                card.style.background =
                    `
                    radial-gradient(
                        400px circle
                        at ${x}px ${y}px,
                        rgba(
                            139,
                            92,
                            246,
                            0.10
                        ),
                        transparent 40%
                    ),
                    rgba(
                        18,
                        18,
                        29,
                        0.72
                    )
                    `;


                if (is3dTilt) {

                    const px =
                        x / rect.width - 0.5;

                    const py =
                        y / rect.height - 0.5;

                    card.style.transform =
                        `translateY(-10px) rotateX(${py * -10}deg) rotateY(${px * 10}deg)`;

                }

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.style.background =
                    "";


                if (is3dTilt) {

                    card.style.transform =
                        "";

                }

            }
        );

    }
);
}


/* =========================================================
   INITIAL STATE
========================================================= */

updateActiveNavigation();

/* Mobile project screenshot flip: scroll-driven only (no tap/click). */
if (window.matchMedia("(max-width: 768px)").matches) {
    const projectScenes = document.querySelectorAll("#projects .flip-scene");

    // Remove any legacy card flip state so taps cannot leave a preview flipped.
    document.querySelectorAll("#projects .project-card, #projects .featured-project")
        .forEach(card => card.classList.remove("is-flipped"));

    const projectFlipObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            // Flip while the screenshot is meaningfully in view; restore as it leaves.
            entry.target.classList.toggle("is-scroll-flipped", entry.isIntersecting);
        });
    }, { root: null, rootMargin: "-18% 0px -18% 0px", threshold: 0.38 });

    projectScenes.forEach(scene => {
        scene.removeAttribute("role");
        scene.removeAttribute("tabindex");
        scene.removeAttribute("aria-label");
        projectFlipObserver.observe(scene);
    });
}
