import { useEffect, useState } from "react";

function App() {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/habits"
      );

      const data = await res.json();

      setHabits(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addHabit = async () => {
    if (!title.trim()) return;

    try {
      const res = await fetch(
        "http://localhost:5000/api/habits",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title }),
        }
      );

      const newHabit = await res.json();

      setHabits([...habits, newHabit]);

      setTitle("");
    } catch (err) {
      console.error(err);
    }
  };

  const completeHabit = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/habits/${id}/complete`,
        {
          method: "PUT",
        }
      );

      const updatedHabit = await res.json();

      setHabits(
        habits.map((habit) =>
          habit._id === id
            ? updatedHabit
            : habit
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const deleteHabit = async (id) => {
    try {
      await fetch(
        `http://localhost:5000/api/habits/${id}`,
        {
          method: "DELETE",
        }
      );

      setHabits(
        habits.filter(
          (habit) => habit._id !== id
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Habit Tracker</h1>

      <div>
        <input
          type="text"
          placeholder="Enter habit..."
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <button onClick={addHabit}>
          Add Habit
        </button>
      </div>

      <hr />

      {habits.length === 0 ? (
        <p>No habits found.</p>
      ) : (
        habits.map((habit) => (
          <div
            key={habit._id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{habit.title}</h3>

            <p>
              🔥 Streak: {habit.streak}
            </p>

            <p>
              Last Completed:
              {" "}
              {habit.lastCompleted
                ? new Date(
                    habit.lastCompleted
                  ).toLocaleDateString()
                : " Never"}
            </p>

            <button
              onClick={() =>
                completeHabit(habit._id)
              }
            >
              Complete Today
            </button>

            <button
              onClick={() =>
                deleteHabit(habit._id)
              }
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;