document.addEventListener("DOMContentLoaded", () => {
  
  // -------------------------------------------------------------
  // 1. Products Filter & Details Modal (products.html)
  // -------------------------------------------------------------
  const filterBtns = document.querySelectorAll(".filter-btn");
  const productCards = document.querySelectorAll(".product-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      productCards.forEach(card => {
        if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Product View Details Button Handling + GA4 Event Tracking
  const viewDetailBtns = document.querySelectorAll(".view-details-btn");
  const modal = document.getElementById("productModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalPrice = document.getElementById("modalPrice");
  const closeModalBtn = document.querySelector(".close-modal");

  viewDetailBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const productName = btn.getAttribute("data-product");
      const productPrice = btn.getAttribute("data-price");

      if (modalTitle && modalPrice && modal) {
        modalTitle.textContent = productName;
        modalPrice.textContent = `$${productPrice}`;
        modal.style.display = "flex";
      }

      // GA4 Event Tracking (select_item)
      if (typeof gtag === "function") {
        gtag("event", "select_item", {
          item_name: productName,
          price: productPrice,
          currency: "USD"
        });
        console.log(`GA4 Event Sent: select_item (${productName})`);
      }
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => closeModal());
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // -------------------------------------------------------------
  // 2. Contact Form Validation & Event (contact.html)
  // -------------------------------------------------------------
  const contactForm = document.getElementById("contactForm");
  const contactAlert = document.getElementById("contactAlert");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("fullName").value.trim();
      const email = document.getElementById("email").value.trim();
      const subject = document.getElementById("subject").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !subject || !message) {
        showAlert(contactAlert, "Please fill in all input fields.", "error");
        return;
      }

      if (!validateEmail(email)) {
        showAlert(contactAlert, "Please enter a valid email address.", "error");
        return;
      }

      // Form validation passed (Demonstration form alert)
      showAlert(contactAlert, "Thank you! Your inquiry was successfully validated.", "success");
      contactForm.reset();

      // GA4 Demonstration Form Submit Event Tracking
      if (typeof gtag === "function") {
        gtag("event", "demo_form_submit", {
          form_name: "contact_enquiry_demo",
          lead_name: name
        });
        console.log("GA4 Event Sent: demo_form_submit");
      }
    });
  }

  // -------------------------------------------------------------
  // 3. Newsletter Form Validation & Event (contact.html)
  // -------------------------------------------------------------
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterAlert = document.getElementById("newsletterAlert");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("newsletterEmail").value.trim();

      if (!emailInput || !validateEmail(emailInput)) {
        showAlert(newsletterAlert, "Please enter a valid email.", "error");
        return;
      }

      showAlert(newsletterAlert, "Subscribed successfully to VIP drops!", "success");
      newsletterForm.reset();

      // GA4 Sign Up Event Tracking
      if (typeof gtag === "function") {
        gtag("event", "sign_up", {
          method: "newsletter_footer"
        });
        console.log("GA4 Event Sent: sign_up");
      }
    });
  }
});

// Utility Functions
function closeModal() {
  const modal = document.getElementById("productModal");
  if (modal) modal.style.display = "none";
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showAlert(element, message, type) {
  if (!element) return;
  element.textContent = message;
  element.className = `alert ${type === "success" ? "alert-success" : "alert-error"}`;
  element.classList.remove("hidden");
}
