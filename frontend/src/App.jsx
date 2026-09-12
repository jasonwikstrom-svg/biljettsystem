import { useState, useEffect } from "react";

function App() {
  const [tickets, setTickets] = useState([]);
  const [codeInput, setCodeInput] = useState('');
  
  useEffect(() => {
    fetch("http://localhost:3001/tickets")
      .then((response) => response.json())
      .then((data) => setTickets(data))
      .catch((error) => console.error("Error fetching tickets:", error));
  }, []);
  
  function createTicket() {
    fetch("http://localhost:3001/tickets", { method: "POST" })
        .then((response) => response.json())
        .then((data) => {
            setTickets((prevTickets) => [...prevTickets, data]); 
        })
        .catch((error) => console.error("Error creating ticket:", error));
  }
  
  function formatDate(sqliteDateString) {
      const isoString = sqliteDateString.replace(' ', 'T') + 'Z';
      return new Date (isoString).toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' });
  }
  
  function useTicket() {
      fetch (`http://localhost:3001/tickets/${codeInput}/use`, { method: "POST" })
          .then((response) => response.json())
          .then((data) => {
              setTickets((prevTickets) => prevTickets.map((ticket) => ticket.code === data.code ? data : ticket));
          })
            .catch((error) => console.error("Error using ticket:", error));
  }
  
  function deleteTicket(code) {
        fetch(`http://localhost:3001/tickets/${code}`, { method: "DELETE" })
            .then ((response) => {
                if (!response.ok) {
                    throw new Error('Failed to delete ticket');
                }
                setTickets((prevTickets) => prevTickets.filter((ticket) => ticket.code !== code)
                );
            })
            .catch((error) => console.error("Error deleting ticket:", error));
  }

    return (
        <div>
            <h1>Tickets</h1>
            <button onClick={createTicket}>Create Ticket</button>
            <div>
                <input
                    type="text"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="Ange biljettkod"
                />
                <button onClick={useTicket}>Use Ticket</button>
            </div>
            <div>
                <p> Status: {tickets.find((t) => t.code === codeInput)?.used ? 'Använd' : 'Oanvänd'}</p>
                <button onClick={() => deleteTicket(codeInput)}>Delete Ticket</button>
            </div>
            {
                tickets.map((ticket) => (
                    <div key={ticket.id}>
                        <p> Code: {ticket.code}</p>
                        <p> Created: {formatDate(ticket.created_at)}</p>
                        <p> Status: {ticket.used ? 'Använd' : 'Oanvänd'}</p>
                    </div>
                ))
            }
        </div>
    );
}

export default App;
