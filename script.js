const EVENT_EMAIL = "YOUR-EMAIL@example.com";

const TICKETS = {
  "general-self": { label: "General Admission (Self Travel)", shortCode: "GA", originalPrice: 49.99, price: 44.99, people: 1, transport: "Transport not included" },
  "general-coach": { label: "General Admission (Coach Included)", shortCode: "GC", originalPrice: 59.99, price: 53.99, people: 1, transport: "Return coach travel from Bognor Regis included" },
  "group3-self": { label: "Group of 3 (Self Travel)", shortCode: "G3", originalPrice: 130, price: 117, people: 3, transport: "Transport not included" },
  "group3-coach": { label: "Group of 3 (Coach Included)", shortCode: "G3C", originalPrice: 165, price: 148.5, people: 3, transport: "Return coach travel from Bognor Regis included" }
};

const ticketForm = document.getElementById("ticketForm");
const ticketType = document.getElementById("ticketType");
const ticketPreview = document.getElementById("ticketPreview");

function generateReference(name, ticket) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);

  let randomCode = "";
  bytes.forEach(byte => {
    randomCode += chars[byte % chars.length];
  });

  return `BP-${ticket.shortCode}-${randomCode}`;
}

function money(value) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(value);
}

function updateTicketPreview() {
  const selectedTicket = TICKETS[ticketType.value];
  ticketPreview.innerHTML = `<strong>${selectedTicket.label}</strong><span>Bank transfer price: ${money(selectedTicket.price)} <s>${money(selectedTicket.originalPrice)}</s> • ${selectedTicket.people} ${selectedTicket.people === 1 ? "person" : "people"}</span><em>10% discount applied • ${selectedTicket.transport}</em>`;
}

function encodeFormData(data) {
  return new URLSearchParams(data).toString();
}

document.querySelectorAll("[data-ticket-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    ticketType.value = button.dataset.ticketJump;
    updateTicketPreview();
  });
});

ticketType.addEventListener("change", updateTicketPreview);
updateTicketPreview();

ticketForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const honeypot = document.getElementById("website").value.trim();
  if (honeypot) return;

  const selectedTicket = TICKETS[ticketType.value];
  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const notes = document.getElementById("notes").value.trim();
  const reference = generateReference(name, selectedTicket);
  const createdAt = new Date().toISOString();

  const order = {
    reference,
    name,
    email,
    phone,
    notes,
    ticket: selectedTicket,
    createdAt
  };

  document.getElementById("netlifyReference").value = reference;
  document.getElementById("netlifyTicketLabel").value = `${selectedTicket.label} — 10% off bank transfer`;
  document.getElementById("netlifyTicketPrice").value = money(selectedTicket.price);
  document.getElementById("netlifyPeople").value = selectedTicket.people;
  document.getElementById("netlifyCreatedAt").value = createdAt;

  sessionStorage.setItem("boatPartyOrder", JSON.stringify(order));

  const formData = new FormData(ticketForm);

  try {
    const response = await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encodeFormData(formData)
    });

    if (!response.ok) {
      throw new Error("Form submission failed");
    }

    window.location.href = "confirmation.html";
  } catch (error) {
    alert("There was a problem saving your reservation. Please try again or message us directly.");
  }
});
