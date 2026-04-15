export let transactions = [];

export const state = {
  editingId: null
};

export const categories = {
  ingreso: ["salario", "regalo", "extra"],
  gasto: ["comida", "transporte", "servicios", "ocio", "extra"]
};

export function calculateTotals(lista) {
  let income = 0;
  let expenses = 0;

  lista.forEach(mov => {
    if (mov.type === "ingreso") {
      income += mov.amount;
    } else {
      expenses += mov.amount;
    }
  });

  return {
    income,
    expenses,
    balance: income - expenses
  };
}