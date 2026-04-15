import { transactions, categories, calculateTotals, state } from './state.js';
import { getFilteredTransactions } from './filters.js';
import { loadData, saveData } from './storage.js'


    function agregarMovimiento() {
        const amount = parseFloat(document.getElementById("amount").value);
        const type = document.getElementById("type").value;
        const category = document.getElementById("category").value;

        if (!amount || !category) {      
            alert("Completá los datos");
            return;
        }

        if (state.editingId) {      
            const updated = transactions.map(mov =>
                mov.id === state.editingId
                ? { ...mov, amount, type, category }
                : mov
            );

        transactions.length = 0;
        transactions.push(...updated);
      
        } else {
      
            const movimiento = {
            id: Date.now(),
            amount,
            type,
            category,
            fecha: Date.now()
            };
            transactions.push(movimiento);
        
        };

        document.getElementById("amount").value = "";
      
        saveData();
        render();
    };
    window.agregarMovimiento = agregarMovimiento;

    function deleteTransaction(id) {
      const updated = transactions.filter(mov => mov.id !== id);
      transactions.length = 0;
      transactions.push(...updated);
      saveData();
      render();
    }

    function updateCategoryOptions(type){
      const categorySelect = document.getElementById("category");
      categorySelect.innerHTML = "";

      categories[type].forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
      });
    }

    function editTransaction(id) {

      const transaction = transactions.find(t => t.id === id);

      document.getElementById("amount").value = transaction.amount;
      document.getElementById("type").value = transaction.type;
      document.getElementById("category").value = transaction.category;

      state.state.editingId = id;
    }


    function updateFilterCategories(type) {
      console.log("UPDATING FILTER CATEGORIES WITH: ", type);
      const categoryFilter = document.getElementById("categoryFilter");
      categoryFilter.innerHTML = "";

      const defaultOption = document.createElement("option");
      defaultOption.value = "todas";
      defaultOption.textContent = "Todas";
      categoryFilter.appendChild(defaultOption);

      if (type === "todos") {
        const allCategories = [...new Set([...categories.ingreso, ...categories.gasto])];

        allCategories.forEach(cat => {
          const option = document.createElement("option");
          option.value = cat;
          option.textContent = cat;
          categoryFilter.appendChild(option);
        });
      } else {
        categories[type].forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
        });
      }
    }

    function groupByMonth(lista) {
        const grupos = {};

        lista.forEach(mov => {
            const fecha = mov.fecha ? new Date(mov.fecha) : new Date();

            const year = fecha.getFullYear();
            const month = (fecha.getMonth() + 1).toString().padStart(2, "0");

            const key = `${year}-${month}`;

            if (!grupos[key]) {
                grupos[key] = [];
            }

            grupos[key].push(mov);
        });

    return grupos;
    }

    function render() {
      //console.log("render ejecutado");
      const lista = document.getElementById("lista");
      lista.innerHTML = "";
      
      const typeFilter = document.getElementById("typeFilter").value;
      const categoryFilter = document.getElementById("categoryFilter").value;
      const filtrados = getFilteredTransactions(transactions, categoryFilter, typeFilter);
      filtrados.sort((a, b) => b.fecha - a.fecha);
      
      const globalTotals = calculateTotals(transactions);
      const filteredTotals = calculateTotals(filtrados);

      const grupos = groupByMonth(filtrados);

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = (now.getMonth() + 1).toString().padStart(2, "0");
      const currentKey = currentYear + "-" + currentMonth;

      for (let clave in grupos) {
        const titulo = document.createElement("h3");
        const isCurrentMonth = clave === currentKey;
        titulo.textContent = (isCurrentMonth ? "▼ " : "▶ ") + clave;
        titulo.style.cursor = "pointer";
        lista.appendChild(titulo);

        const container = document.createElement("div");
        titulo.onclick = () => {
          if (container.style.display === "none") {
            container.style.display = "block";
            titulo.textContent = "▼ " + clave;
          } else {
            container.style.display = "none";
            titulo.textContent = "▶ " + clave;
          }
        };

        if (clave !== currentKey) {
          container.style.display = "none";
        }

        grupos[clave].forEach(mov => {
          const li = document.createElement("li");
          li.innerHTML = `
            ${mov.type} - $${mov.amount} (${mov.category})
            <button onclick="editTransaction(${mov.id})">✏️</button>
            <button onclick="deleteTransaction(${mov.id})">❌</button>
          `;
          li.className = mov.type;

          container.appendChild(li);
        });

        lista.appendChild(container);
      }

      

      document.getElementById("ingresos").textContent = filteredTotals.income;
      document.getElementById("gastos").textContent = filteredTotals.expenses;
      document.getElementById("balance").textContent = filteredTotals.balance;

      document.getElementById("totalIncome").textContent = globalTotals.income;
      document.getElementById("totalExpenses").textContent = globalTotals.expenses;
      document.getElementById("balanceGlobal").textContent = globalTotals.balance;
      
    }

    

    

   

    document.getElementById("typeFilter").addEventListener("change", (e) => {
      console.log("TYPE FILTER VALUE:", e.target.value);
      const type = e.target.value;
      document.getElementById("categoryFilter").value = "todas";
      updateFilterCategories(type);
      render()
    });

    

    
    loadData();
    updateFilterCategories("todos");
    render();
    
    document.getElementById("type").addEventListener("change", (e) => {
      updateCategoryOptions(e.target.value);
    });
    updateCategoryOptions(document.getElementById("type").value);

    window.agregarMovimiento = agregarMovimiento;
    window.editTransaction = editTransaction;
    window.deleteTransaction = deleteTransaction;
    window.render = render;