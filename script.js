// Simple calculator logic: addition, subtraction, multiplication, division.

const currentEl = document.getElementById("current");
const previousEl = document.getElementById("previous");
const keys = document.querySelector(".keys");

let currentValue = "0";   // number being typed
let previousValue = "";   // first number, saved when an operator is chosen
let operator = "";        // + − × ÷
let justEvaluated = false; // true right after pressing "="

function calculate(a, b, op) {
  const x = parseFloat(a);
  const y = parseFloat(b);
  let result;

  if (op === "+") result = x + y;
  else if (op === "−") result = x - y;
  else if (op === "×") result = x * y;
  else if (op === "÷") {
    if (y === 0) return "Cannot divide by 0";
    result = x / y;
  } else return b;

  // Remove tiny floating point errors such as 0.1 + 0.2 = 0.30000000000000004
  return String(parseFloat(result.toFixed(10)));
}

function updateDisplay() {
  currentEl.textContent = currentValue;
  previousEl.textContent = operator ? previousValue + " " + operator : "";

  document.querySelectorAll(".operator").forEach(function (btn) {
    btn.classList.toggle("active", btn.dataset.operator === operator && currentValue === "0" && previousValue !== "");
  });
}

function isError() {
  return currentValue === "Cannot divide by 0";
}

function appendNumber(num) {
  if (isError() || justEvaluated) {
    currentValue = num;
    previousValue = "";
    operator = "";
    justEvaluated = false;
  } else if (currentValue === "0") {
    currentValue = num;
  } else if (currentValue.length < 15) {
    currentValue += num;
  }
  updateDisplay();
}

function appendDecimal() {
  if (isError() || justEvaluated) {
    currentValue = "0.";
    previousValue = "";
    operator = "";
    justEvaluated = false;
  } else if (!currentValue.includes(".")) {
    currentValue += ".";
  }
  updateDisplay();
}

function chooseOperator(op) {
  if (isError()) return;

  // Chain calculations: 2 + 3 + 4
  if (operator && !justEvaluated && previousValue !== "" && currentValue !== "0") {
    currentValue = calculate(previousValue, currentValue, operator);
    if (isError()) {
      previousValue = "";
      operator = "";
      updateDisplay();
      return;
    }
  }

  previousValue = currentValue;
  operator = op;
  currentValue = "0";
  justEvaluated = false;
  updateDisplay();
}

function evaluate() {
  if (!operator || previousValue === "" || isError()) return;

  const result = calculate(previousValue, currentValue, operator);
  previousEl.textContent = previousValue + " " + operator + " " + currentValue + " =";
  currentValue = result;
  previousValue = "";
  operator = "";
  justEvaluated = true;
  currentEl.textContent = currentValue;
}

function clearAll() {
  currentValue = "0";
  previousValue = "";
  operator = "";
  justEvaluated = false;
  updateDisplay();
}

function deleteLast() {
  if (isError() || justEvaluated) {
    clearAll();
    return;
  }
  currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
  updateDisplay();
}

function percent() {
  if (isError()) return;
  currentValue = String(parseFloat(currentValue) / 100);
  updateDisplay();
}

// Mouse / touch clicks
keys.addEventListener("click", function (e) {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.dataset.number !== undefined) appendNumber(btn.dataset.number);
  else if (btn.dataset.operator) chooseOperator(btn.dataset.operator);
  else if (btn.dataset.action === "decimal") appendDecimal();
  else if (btn.dataset.action === "equals") evaluate();
  else if (btn.dataset.action === "clear") clearAll();
  else if (btn.dataset.action === "delete") deleteLast();
  else if (btn.dataset.action === "percent") percent();
});

// Keyboard support
document.addEventListener("keydown", function (e) {
  const k = e.key;
  if (k >= "0" && k <= "9") appendNumber(k);
  else if (k === ".") appendDecimal();
  else if (k === "+") chooseOperator("+");
  else if (k === "-") chooseOperator("−");
  else if (k === "*") chooseOperator("×");
  else if (k === "/") { e.preventDefault(); chooseOperator("÷"); }
  else if (k === "Enter" || k === "=") { e.preventDefault(); evaluate(); }
  else if (k === "Backspace") deleteLast();
  else if (k === "Escape") clearAll();
  else if (k === "%") percent();
});

updateDisplay();
