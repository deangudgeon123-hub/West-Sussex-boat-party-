const order = JSON.parse(sessionStorage.getItem("boatPartyOrder") || "null");

const referenceOutput = document.getElementById("referenceOutput");
const bankReference = document.getElementById("bankReference");
const summaryName = document.getElementById("summaryName");
const summaryEmail = document.getElementById("summaryEmail");
const summaryTicket = document.getElementById("summaryTicket");
const summaryTotal = document.getElementById("summaryTotal");
const copyReference = document.getElementById("copyReference");

function money(value) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(value);
}

if (!order) {
  referenceOutput.textContent = "No reservation found";
  bankReference.textContent = "No reference";
  summaryName.textContent = "Please return to the ticket form";
  summaryEmail.textContent = "-";
  summaryTicket.textContent = "-";
  summaryTotal.textContent = "-";
} else {
  referenceOutput.textContent = order.reference;
  bankReference.textContent = order.reference;
  summaryName.textContent = order.name;
  summaryEmail.textContent = order.email;
  summaryTicket.textContent = order.ticket.label;
  summaryTotal.textContent = money(order.ticket.price);
}

copyReference.addEventListener("click", async () => {
  if (!order?.reference) return;

  try {
    await navigator.clipboard.writeText(order.reference);
    copyReference.textContent = "Copied";
    setTimeout(() => { copyReference.textContent = "Copy Reference"; }, 1500);
  } catch (error) {
    alert(`Your reference is ${order.reference}`);
  }
});
