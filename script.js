const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const copyEmailButton = document.querySelector(".copy-email");

if (window.lucide) {
  window.lucide.createIcons();
}

navToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    siteNav.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      card.classList.toggle("is-hidden", filter !== "all" && !categories.includes(filter));
    });
  });
});

copyEmailButton?.addEventListener("click", async () => {
  const email = copyEmailButton.dataset.email;
  const original = copyEmailButton.innerHTML;

  try {
    await navigator.clipboard.writeText(email);
    copyEmailButton.innerHTML = '<i data-lucide="check"></i> Email copied';
    window.lucide?.createIcons();
    setTimeout(() => {
      copyEmailButton.innerHTML = original;
      window.lucide?.createIcons();
    }, 1800);
  } catch {
    window.location.href = `mailto:${email}`;
  }
});
