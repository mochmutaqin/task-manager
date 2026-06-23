const pool = require('../db');

// Get semua tasks milik user
const getTasks = async (req, res) => {
  try {
    const tasks = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(tasks.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tambah task baru
const createTask = async (req, res) => {
  const { title, description, deadline } = req.body;
  try {
    const newTask = await pool.query(
      'INSERT INTO tasks (user_id, title, description, deadline) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, title, description, deadline]
    );
    res.status(201).json(newTask.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update task
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, deadline } = req.body;
  try {
    const updatedTask = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, status = $3, deadline = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
      [title, description, status, deadline, id, req.user.id]
    );
    if (updatedTask.rows.length === 0) {
      return res.status(404).json({ message: 'Task tidak ditemukan' });
    }
    res.json(updatedTask.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Hapus task
const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTask = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );
    if (deletedTask.rows.length === 0) {
      return res.status(404).json({ message: 'Task tidak ditemukan' });
    }
    res.json({ message: 'Task berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };