document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/expenses?userId=1', { // Replace with actual user ID
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('#expenses-table tbody');
        data.forEach(expense => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${expense.name}</td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>${expense.date}</td>
                <td>${expense.category}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error:', error));
});
