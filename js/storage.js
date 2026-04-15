import { transactions } from "./state.js";

export function saveData() {
  localStorage.setItem("movimientos", JSON.stringify(transactions));
}

export function loadData() {
  const data = localStorage.getItem("movimientos");

  if (data) {
    let parsed = JSON.parse(data);

    parsed = parsed.map(mov => {
      let updatedTransaction = { ...mov };

      if (mov.monto && !mov.amount) {
        updatedTransaction.amount = mov.monto;
      }

      if (mov.tipo && !mov.type) {
        updatedTransaction.type = mov.tipo;
      }

      if (mov.categoria && !mov.category) {
        updatedTransaction.category = mov.categoria;
      }

      if (!mov.id) {
        updatedTransaction.id = Date.now() + Math.random();
      }

      if (!mov.fecha) {
        updatedTransaction.fecha = Date.now();
      }

      // 🔧 category normalization (your custom fixes)
      if (updatedTransaction.category === "alimentos") {
        updatedTransaction.category = "comida";
      }

      if (updatedTransaction.category === "impuestos") {
        updatedTransaction.category = "servicios";
      }

      if (updatedTransaction.category === "extras") {
        updatedTransaction.category = "extra";
      }

      return updatedTransaction;
    });

    // 🔥 CRITICAL: mutate, don't reassign
    transactions.length = 0;
    transactions.push(...parsed);
  }
}