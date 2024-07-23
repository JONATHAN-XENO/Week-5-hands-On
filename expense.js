document.getElementById('transactionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/expenses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            userId: 1, // Replace with actual user ID
            name: formData.get('expense-name'),
            amount: formData.get('amount'),
            date: formData.get('date'),
            category: formData.get('category')
        })
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        window.location.href = 'view-expenses.html';
    })
    .catch(error => console.error('Error:', error));
});

