import { useEffect, useState } from "react";

function App() {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");

  const [stats, setStats] = useState({
    totalHabits: 0,
    completedHabits: 0,
    longestStreak: 0,
  });

  useEffect(() => {
    fetchHabits();
    fetchStats();
  }, []);

  const fetchHabits = async () => {
    const res = await fetch(
      "http://localhost:5000/api/habits"
    );

    const data = await res.json();

    setHabits(data);
  };

  const fetchStats = async () => {
    const res = await fetch(
      "http://localhost:5000/api/habits/stats"
    );

    const data = await res.json();

    setStats(data);
  };

  const addHabit = async () => {
    if (!title.trim()) return;

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

    fetchStats();
  };

  const completeHabit = async (id) => {
    const res = await fetch(
      `http://localhost:5000/api/habits/${id}/complete`,
      {
        method: "PUT",
      }
    );

    const updated = await res.json();

    setHabits(
      habits.map((habit) =>
        habit._id === id ? updated : habit
      )
    );

    fetchStats();
  };

  const deleteHabit = async (id) => {
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

    fetchStats();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Habit Tracker</h1>

      {/* Dashboard */}
      <h2>Statistics</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h3>{stats.totalHabits}</h3>
          <p>Total Habits</p>
        </div>

        <div>
          <h3>{stats.completedHabits}</h3>
          <p>Completed Habits</p>
        </div>

        <div>
          <h3>{stats.longestStreak}</h3>
          <p>Longest Streak</p>
        </div>
      </div>

      {/* Add Habit */}
      <input
        type="text"
        value={title}
        placeholder="Enter habit"
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <button onClick={addHabit}>
        Add Habit
      </button>

      <hr />

      {/* Habit List */}
      {habits.map((habit) => (
        <div
          key={habit._id}
          style={{
            border: "1px solid #ccc",
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
      ))}
    </div>
  );
}

export default App;