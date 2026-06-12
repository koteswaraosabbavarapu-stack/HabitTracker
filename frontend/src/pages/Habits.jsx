import { useEffect, useState } from "react"
import api from "../api/axios"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Habits = () => {
  const [habits, setHabits] = useState([])
  const [title, setTitle] = useState("")
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedHabits: 0,
    longestStreak: 0,
  })

  const { accessToken, user } = useAuth()
  const navigate = useNavigate()

  // auth headers — attach token to every request
  const authHeaders = {
    headers: { Authorization: `Bearer ${accessToken}` }
  }

  useEffect(() => {
    // if not logged in → redirect to login
    if (!accessToken) {
      navigate('/login')
      return
    }
    fetchHabits()
    fetchStats()
  }, [accessToken])

  const fetchHabits = async () => {
    try {
      const res = await api.get('/habits', authHeaders)
      setHabits(res.data)
    } catch (err) {
      console.error('fetch habits error:', err)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await api.get('/habits/stats', authHeaders)
      setStats(res.data)
    } catch (err) {
      console.error('fetch stats error:', err)
    }
  }

  const addHabit = async () => {
    if (!title.trim()) return
    try {
      const res = await api.post('/habits', { title }, authHeaders)
      setHabits([...habits, res.data])
      setTitle("")
      fetchStats()
    } catch (err) {
      console.error('add habit error:', err)
    }
  }

  const completeHabit = async (id) => {
    try {
      const res = await api.put(`/habits/${id}/complete`, {}, authHeaders)
      setHabits(habits.map((habit) => habit._id === id ? res.data : habit))
      fetchStats()
    } catch (err) {
      console.error('complete habit error:', err)
    }
  }

  const deleteHabit = async (id) => {
    try {
      await api.delete(`/habits/${id}`, authHeaders)
      setHabits(habits.filter((habit) => habit._id !== id))
      fetchStats()
    } catch (err) {
      console.error('delete habit error:', err)
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Habit Tracker</h1>
      <p>Welcome, {user?.name}!</p>

      {/* Stats */}
      <h2>Statistics</h2>
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div><h3>{stats.totalHabits}</h3><p>Total Habits</p></div>
        <div><h3>{stats.completedHabits}</h3><p>Completed Habits</p></div>
        <div><h3>{stats.longestStreak}</h3><p>Longest Streak</p></div>
      </div>

      {/* Add Habit */}
      <input
        type="text"
        value={title}
        placeholder="Enter habit"
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={addHabit}>Add Habit</button>

      <hr />

      {/* Habit List */}
      {habits.map((habit) => (
        <div key={habit._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <h3>{habit.title}</h3>
          <p>🔥 Streak: {habit.streak}</p>
          <p>Last Completed: {habit.lastCompleted ? new Date(habit.lastCompleted).toLocaleDateString() : "Never"}</p>
          <button onClick={() => completeHabit(habit._id)}>Complete Today</button>
          <button onClick={() => deleteHabit(habit._id)} style={{ marginLeft: "10px" }}>Delete</button>
        </div>
      ))}
    </div>
  )
}

export default Habits