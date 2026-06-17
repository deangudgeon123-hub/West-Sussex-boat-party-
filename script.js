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
const confirmation = document.getElementById("confirmation");
const referenceOutput = document.getElementById("referenceOutput");
const bankReference = document.getElementById("bankReference");
const summaryName = document.getElementById("summaryName");
const summaryEmail = document.getElementById("summaryEmail");
const summaryTickets = document.getElementById("summaryTickets");
const summaryTotal = document.getElementById("summaryTotal");
const copyReference = document.getElementById("copyReference");
const emailOrder = document.getElementById("emailOrder");

let currentReference = "";

function generateReference(name, ticket) {
  const cleanName = name.replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase().padEnd(3, "X");
  const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `BP-${ticket.shortCode}-${cleanName}-${randomCode}`;
}

function money(value) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(value);
}

function updateTicketPreview() {
  const selectedTicket = TICKETS[ticketType.value];
  ticketPreview.innerHTML = `<strong>${selectedTicket.label}</strong><span>${money(selectedTicket.price)} • ${selectedTicket.people} ${selectedTicket.people === 1 ? "person" : "people"}</span><em>${selectedTicket.transport}</em>`;
}

function buildEmailLink(order) {
  const subject = encodeURIComponent(`Boat Party Reservation ${order.reference}`);
  const body = encodeURIComponent(`New boat party reservation\n\nName: ${order.name}\nEmail: ${order.email}\nPhone: ${order.phone}\nTicket type: ${order.ticket.label}\nPeople covered: ${order.ticket.people}\nTransport: ${order.ticket.transport}\nTotal: ${money(order.ticket.price)}\nReference: ${order.reference}\nNotes: ${order.notes || "None"}`);
  return `mailto:${EVENT_EMAIL}?subject=${subject}&body=${body}`;
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

  currentReference = generateReference(name, selectedTicket);
  const order = { name, email, phone, notes, ticket: selectedTicket, reference: currentReference };

  referenceOutput.textContent = currentReference;
  bankReference.textContent = currentReference;
  summaryName.textContent = name;
  summaryEmail.textContent = email;
  summaryTickets.textContent = selectedTicket.label;
  summaryTotal.textContent = money(selectedTicket.price);
  emailOrder.href = buildEmailLink(order);

  confirmation.classList.remove("hidden");
  confirmation.scrollIntoView({ behavior: "smooth", block: "start" });
});

copyReference.addEventListener("click", async () => {
  if (!currentReference) return;
  try {
    await navigator.clipboard.writeText(currentReference);
    copyReference.textContent = "Copied";
    setTimeout(() => { copyReference.textContent = "Copy Reference"; }, 1500);
  } catch (error) {
    alert(`Your reference is ${currentReference}`);
  }
});
