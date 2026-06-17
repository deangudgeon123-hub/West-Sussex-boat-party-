const EVENT_EMAIL = "YOUR-EMAIL@example.com";

const TICKETS = {
  "general-self": { label: "General Admission (Self Travel)", shortCode: "GA", price: 49.99, people: 1, transport: "Transport not included" },
  "general-coach": { label: "General Admission (Coach Included)", shortCode: "COACH", price: 59.99, people: 1, transport: "Return coach travel from Bognor Regis included" },
  "group3-self": { label: "Group of 3 (Self Travel)", shortCode: "G3", price: 130, people: 3, transport: "Transport not included" },
  "group3-coach": { label: "Group of 3 (Coach Included)", shortCode: "G3C", price: 165, people: 3, transport: "Return coach travel from Bognor Regis included" }
};

const ticketForm = document.getElementById("ticketForm");
const ticketType = document.getElementById("ticketType");
const ticketPreview = document.getElementById("ticketPreview");

function generateReference(name, ticket) {
  const cleanName = name.replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase().padEnd(3, "X");
  const timeCode = Date.now().toString(36).toUpperCase();
  const randomBytes = new Uint32Array(2);
  crypto.getRandomValues(randomBytes);
  const randomCode = Array.from(randomBytes).map((number) => number.toString(36).toUpperCase()).join("").slice(0, 10);
  return `BP-${ticket.shortCode}-${cleanName}-${timeCode}-${randomCode}`;
}

function money(value) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(value);
}

function updateTicketPreview() {
  const selectedTicket = TICKETS[ticketType.value];
  ticketPreview.innerHTML = `<strong>${selectedTicket.label}</strong><span>${money(selectedTicket.price)} • ${selectedTicket.people} ${selectedTicket.people === 1 ? "person" : "people"}</span><em>${selectedTicket.transport}</em>`;
}

document.querySelectorAll("[data-ticket-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    ticketType.value = button.dataset.ticketJump;
    updateTicketPreview();
  });
});

ticketType.addEventListener("change", updateTicketPreview);
updateTicketPreview();

ticketForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const selectedTicket = TICKETS[ticketType.value];
  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const notes = document.getElementById("notes").value.trim();
  const reference = generateReference(name, selectedTicket);

  const order = {
    reference,
    name,
    email,
    phone,
    notes,
    ticket: selectedTicket,
    createdAt: new Date().toISOString()
  };

  sessionStorage.setItem("boatPartyOrder", JSON.stringify(order));
  window.location.href = "confirmation.html";
});
