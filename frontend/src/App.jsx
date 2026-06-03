import { useEffect, useState } from "react";

function App() {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    const res = await fetch(
      "http://localhost:5000/api/habits"
    );

    const data = await res.json();

    setHabits(data);
  };

  const addHabit = async () => {
    const res = await fetch(
      "http://localhost:5000/api/habits",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
      }
    );

    const newHabit = await res.json();

    setHabits([...habits, newHabit]);

    setTitle("");
  };

  const completeHabit = async (id) => {
    const res = await fetch(
      `http://localhost:5000/api/habits/${id}/complete`,
      {
        method: "PUT"
      }
    );

    const updated = await res.json();

    setHabits(
      habits.map(h =>
        h._id === id ? updated : h
      )
    );
  };

  const deleteHabit = async (id) => {
    await fetch(
      `http://localhost:5000/api/habits/${id}`,
      {
        method: "DELETE"
      }
    );

    setHabits(
      habits.filter(h => h._id !== id)
    );
  };

  return (
    <div>
      <h1>Habit Tracker</h1>

      <input
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <button onClick={addHabit}>
        Add
      </button>

      {habits.map(habit => (
        <div key={habit._id}>
          <span>
            {habit.title}
          </span>

          {habit.completed ? (
            " ✅"
          ) : (
            <button
              onClick={() =>
                completeHabit(habit._id)
              }
            >
              Complete
            </button>
          )}

          <button
            onClick={() =>
              deleteHabit(habit._id)
            }
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;