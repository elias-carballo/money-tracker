export function getFilteredTransactions(transactions, categoryFilter, typeFilter) {
  let resultado = transactions;

  if (categoryFilter !== "todas") {
    resultado = resultado.filter(mov => mov.category === categoryFilter);
  }

  if (typeFilter !== "todos") {
    resultado = resultado.filter(mov => mov.type === typeFilter);
  }

  return resultado;
}