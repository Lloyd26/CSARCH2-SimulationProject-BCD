document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".ripple").forEach(r => {
        r.addEventListener("mousedown", ripple);
        r.addEventListener("focus", ripple);
    });
});

function ripple(e) {
    const el = e.target;
    if (!el.hasAttribute("data-ripple-trigger-cause")) {
        el.setAttribute("data-ripple-trigger-cause", e.type);
    } else if (e.type !== el.getAttribute("data-ripple-trigger-cause")) {
        return;
    }

    const radius = parseInt(getComputedStyle(el).getPropertyValue("border-radius"), 10);

    const width = el.offsetWidth;
    const height = el.offsetHeight;
    const size = Math.max(width, height);

    const mouseX = e.pageX;
    const mouseY = e.pageY;

    const rect = el.getBoundingClientRect();
    const top = rect.top;
    const left = rect.left;

    let duration = getComputedStyle(el).getPropertyValue("--ripple-duration");

    let theme = el.getAttribute("data-ripple-theme");
    let theme_light = getComputedStyle(el).getPropertyValue("--ripple-theme-light");
    let theme_dark = getComputedStyle(el).getPropertyValue("--ripple-theme-dark");
    let ease = getComputedStyle(el).getPropertyValue("--ripple-ease");

    let ripple_el = document.createElement("div");
    ripple_el.classList.add("ripple-inner");
    ripple_el.style.backgroundColor = theme === "light" ? "rgba(255, 255, 255, 0.5)" : (theme === "dark" ? "rgba(0, 0, 0, 0.15)" : theme);
    ripple_el.style.width = size * 2 + radius + "px";
    ripple_el.style.height = size * 2 + radius + "px";
    ripple_el.style.top = mouseY - top - size + "px";
    ripple_el.style.left = mouseX - left - size + "px";
    ripple_el.style.animation = "ripple-scale " + duration + "ms " + ease + " forwards";

    if (mouseX === undefined && mouseY === undefined) {
        ripple_el.style.width = size + (radius * 2) + "px";
        ripple_el.style.height = size + (radius * 2) + "px";
        ripple_el.style.top = ((height / 2) - (size / 2) - radius) + "px";
        ripple_el.style.left = ((width / 2) - (size / 2) - radius) + "px";
        ripple_el.style.animation = "ripple-scale " + (parseInt(duration) + 150) + "ms cubic-bezier(0.4, 0, 0.2, 1) forwards";
    }

    el.prepend(ripple_el);

    el.addEventListener("mouseup", fadeOut);
    el.addEventListener("mouseleave", fadeOut);
    el.addEventListener("blur", fadeOut);

    function fadeOut() {
        let fadeEffect = setInterval(function() {
            if (!ripple_el.style.opacity) {
                ripple_el.style.opacity = "1";
            }
            if (ripple_el.style.opacity > 0) {
                ripple_el.style.opacity -= "0.05";
            } else {
                ripple_el.remove();
                el.removeAttribute("data-ripple-trigger-cause");
                clearInterval(fadeEffect);
            }
        }, 25);
    }
}