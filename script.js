const TICKET_PRICE = 49.99;
const EVENT_EMAIL = "YOUR-EMAIL@example.com";

const ticketForm = document.getElementById("ticketForm");
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

function generateReference(name = "") {
  const cleanName = name
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 3)
    .toUpperCase()
    .padEnd(3, "X");

  const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BP-${cleanName}-${randomCode}`;
}

function money(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP"
  }).format(value);
}

function buildEmailLink(order) {
  const subject = encodeURIComponent(`Boat Party Reservation ${order.reference}`);
  const body = encodeURIComponent(
    `New boat party reservation\n\n` +
    `Name: ${order.name}\n` +
    `Email: ${order.email}\n` +
    `Phone: ${order.phone}\n` +
    `Tickets: ${order.quantity}\n` +
    `Total: ${money(order.total)}\n` +
    `Reference: ${order.reference}\n` +
    `Notes: ${order.notes || "None"}\n\n` +
    `Customer must pay by bank transfer using the reference above.`
  );

  return `mailto:${EVENT_EMAIL}?subject=${subject}&body=${body}`;
}

ticketForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const quantity = Number(document.getElementById("ticketQty").value);
  const notes = document.getElementById("notes").value.trim();
  const total = quantity * TICKET_PRICE;

  currentReference = generateReference(name);

  const order = {
    name,
    email,
    phone,
    quantity,
    notes,
    total,
    reference: currentReference
  };

  referenceOutput.textContent = currentReference;
  bankReference.textContent = currentReference;
  summaryName.textContent = name;
  summaryEmail.textContent = email;
  summaryTickets.textContent = `${quantity} ticket${quantity === 1 ? "" : "s"}`;
  summaryTotal.textContent = money(total);
  emailOrder.href = buildEmailLink(order);

  confirmation.classList.remove("hidden");
  confirmation.scrollIntoView({ behavior: "smooth", block: "start" });
});

copyReference.addEventListener("click", async () => {
  if (!currentReference) return;

  try {
    await navigator.clipboard.writeText(currentReference);
    copyReference.textContent = "Copied";
    setTimeout(() => {
      copyReference.textContent = "Copy Reference";
    }, 1500);
  } catch (error) {
    alert(`Your reference is ${currentReference}`);
  }
});
