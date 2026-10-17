import { useEffect, useState } from "react";
import "./App.css";

// Sample student records.
// Strings, numbers, and booleans demonstrate JavaScript data types.
const initialStudents = [
  {
    id: "STU001",
    fullName: "Thabang nkatane",
    age: 21,
    email: "nkatanethabang@gmail.com",
    course: "Diploma in Information Technology",
    status: "Enrolled",
    active: true,
  },
  {
    id: "STU002",
    fullName: "Tankiso Mokebe ",
    age: 22,
    email: "mokebetankiso@gmail.com",
    course: "Diploma in Business IT",
    status: "Enrolled",
    active: true,
  },
  {
    id: "STU003",
    fullName: "Pule Nkalai",
    age: 20,
    email: "nkalaipule@gmail.com",
    course: "Diploma in Information Technology",
    status: "Pending",
    active: false,
  },
];

const emptyForm = {
  fullName: "",
  age: "",
  email: "",
  course: "",
  status: "Enrolled",
};

// Reusable student form component.
function StudentForm({ student, onSave, onCancel }) {
  const [form, setForm] = useState(() =>
    student
      ? {
          fullName: student.fullName,
          age: String(student.age),
          email: student.email,
          course: student.course,
          status: student.status,
        }
      : { ...emptyForm }
  );

  const [errors, setErrors] = useState({});

  // Update one form field when the user types.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const age = Number(form.age);

    if (!form.fullName.trim()) {
      newErrors.fullName = "Please enter the student's full name.";
    }

    if (
      !form.age.trim() ||
      !Number.isInteger(age) ||
      age < 16 ||
      age > 100
    ) {
      newErrors.age = "Enter a whole-number age between 16 and 100.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.course) {
      newErrors.course = "Please select a course.";
    }

    if (!["Enrolled", "Pending", "Graduated"].includes(form.status)) {
      newErrors.status = "Select a valid enrollment status.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    onSave({
      ...(student ? { id: student.id } : {}),
      fullName: form.fullName.trim(),
      age: Number(form.age),
      email: form.email.trim(),
      course: form.course,
      status: form.status,
      active: form.status === "Enrolled",
    });
  };

  return (
    <form className="student-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <div className="form-field full-width">
          <label htmlFor="fullName">Full name *</label>
          <input
            id="fullName"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter full name"
          />
          {errors.fullName && (
            <span className="error">{errors.fullName}</span>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="age">Age *</label>
          <input
            id="age"
            name="age"
            type="number"
            min="16"
            max="100"
            value={form.age}
            onChange={handleChange}
            placeholder="Enter age"
          />
          {errors.age && <span className="error">{errors.age}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="email">Email address *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="student@example.com"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-field full-width">
          <label htmlFor="course">Course of study *</label>
          <select
            id="course"
            name="course"
            value={form.course}
            onChange={handleChange}
          >
            <option value="">Select a course</option>
            <option value="Diploma in Information Technology">
              Diploma in Information Technology
            </option>
            <option value="Diploma in Business IT">
              Diploma in Business IT
            </option>
          </select>
          {errors.course && <span className="error">{errors.course}</span>}
        </div>

        <div className="form-field full-width">
          <label htmlFor="status">Enrollment status *</label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Enrolled">Enrolled</option>
            <option value="Pending">Pending</option>
            <option value="Graduated">Graduated</option>
          </select>
          {errors.status && <span className="error">{errors.status}</span>}
        </div>
      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="btn btn-light"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button type="submit" className="btn btn-primary">
          {student ? "Save Changes" : "Add Student"}
        </button>
      </div>
    </form>
  );
}

// Reusable modal component.
function Modal({ title, onClose, children }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">STUDENT MANAGEMENT</p>
            <h2>{title}</h2>
          </div>

          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        {children}
      </section>
    </div>
  );
}

// Reusable summary card.
function StatCard({ label, value, icon, description }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className="stat-icon" aria-hidden="true">
          {icon}
        </span>
      </div>

      <p className="stat-value">{value}</p>
      <p className="stat-description">{description}</p>
    </article>
  );
}

// Reusable enrollment status badge.
function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${status.toLowerCase()}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}

function StudentRow({ student, onEdit, onDelete }) {
  const initials = student.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <tr>
      <td>
        <span className="student-id">{student.id}</span>
      </td>

      <td>
        <div className="student-cell">
          <div className="avatar">{initials}</div>

          <div>
            <strong>{student.fullName}</strong>
            <span className="student-email">{student.email}</span>
          </div>
        </div>
      </td>

      <td>{student.age}</td>
      <td className="course-cell">{student.course}</td>

      <td>
        <StatusBadge status={student.status} />
      </td>

      <td>
        <div className="row-actions">
          <button
            type="button"
            className="icon-btn edit-btn"
            onClick={() => onEdit(student)}
            aria-label={`Edit ${student.fullName}`}
            title="Edit student"
          >
            ✎
          </button>

          <button
            type="button"
            className="icon-btn delete-btn"
            onClick={() => onDelete(student)}
            aria-label={`Delete ${student.fullName}`}
            title="Delete student"
          >
            ×
          </button>
        </div>
      </td>
    </tr>
  );
}

function App() {
  // Array of student objects. Read saved data when available.
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem("student-manager-records");

      if (saved !== null) {
        const parsed = JSON.parse(saved);

        if (
          Array.isArray(parsed) &&
          parsed.every(
            (student) =>
              student &&
              typeof student.id === "string" &&
              typeof student.fullName === "string" &&
              typeof student.age === "number" &&
              typeof student.email === "string" &&
              typeof student.course === "string" &&
              ["Enrolled", "Pending", "Graduated"].includes(student.status)
          )
        ) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Could not load saved students:", error);
    }

    return initialStudents;
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState("");

  // Save records when the student array changes.
  useEffect(() => {
    try {
      localStorage.setItem(
        "student-manager-records",
        JSON.stringify(students)
      );
    } catch (error) {
      console.error("Could not save student records:", error);
      setNotice("Could not save changes in this browser.");
    }
  }, [students]);

  // Generate a unique student ID.
  const generateId = () => {
    let nextNumber =
      students.reduce((maximum, student) => {
        const match = student.id.match(/^STU(\d+)$/);

        return match
          ? Math.max(maximum, Number(match[1]))
          : maximum;
      }, 0) + 1;

    let id = `STU${String(nextNumber).padStart(3, "0")}`;

    while (students.some((student) => student.id === id)) {
      nextNumber += 1;
      id = `STU${String(nextNumber).padStart(3, "0")}`;
    }

    return id;
  };

  // Add a new student.
  const addStudent = (studentData) => {
    const newStudent = {
      ...studentData,
      id: generateId(),
    };

    setStudents((previous) => [...previous, newStudent]);
    setModal(null);
    setNotice("Student added successfully.");
  };

  // Edit an existing student.
  const editStudent = (studentData) => {
    setStudents((previous) =>
      previous.map((student) =>
        student.id === studentData.id ? studentData : student
      )
    );

    setModal(null);
    setNotice("Student details updated successfully.");
  };

  // Delete a student after confirmation.
  const deleteStudent = () => {
    if (!modal?.student) return;

    setStudents((previous) =>
      previous.filter((student) => student.id !== modal.student.id)
    );

    setModal(null);
    setNotice("Student deleted successfully.");
  };

  // Derived array using filter and includes.
  const filteredStudents = students.filter((student) => {
    const query = search.trim().toLowerCase();

    const matchesSearch = [
      student.id,
      student.fullName,
      student.email,
      student.course,
    ].some((value) => value.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === "All" || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const enrolledCount = students.filter(
    (student) => student.status === "Enrolled"
  ).length;

  const pendingCount = students.filter(
    (student) => student.status === "Pending"
  ).length;

  const graduatedCount = students.filter(
    (student) => student.status === "Graduated"
  ).length;

  const openAddModal = () => {
    setNotice("");
    setModal({ type: "add" });
  };

  const openEditModal = (student) => {
    setNotice("");
    setModal({ type: "edit", student });
  };

  const openDeleteModal = (student) => {
    setNotice("");
    setModal({ type: "delete", student });
  };

  const closeModal = () => setModal(null);

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <a
          className="brand"
          href="#dashboard"
          aria-label="Student Manager home"
        >
          <span className="brand-mark">SM</span>

          <span>
            <strong>Student</strong>
            <small>MANAGEMENT SYSTEM</small>
          </span>
        </a>

        <p className="sidebar-label">WORKSPACE</p>

        <a className="nav-link active" href="#dashboard">
          <span>▦</span> Dashboard
        </a>

        <a className="nav-link" href="#student-records">
          <span>♙</span> Student Records
        </a>

        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon">i</span>
            <strong>Student Portal</strong>
            <p>Manage student records in one simple place.</p>
          </div>

          <p className="sidebar-footer">
            DIWA2110 · WEB DEVELOPMENT
          </p>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div>
            <p className="breadcrumb">Workspace / Dashboard</p>
            <p className="topbar-subtitle">Academic administration</p>
          </div>

          <div className="profile">
            <div className="profile-avatar">SM</div>

            <div>
              <strong>Administrator</strong>
              <span>Student records</span>
            </div>
          </div>
        </header>

        <section className="page-heading">
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h1>Student Dashboard</h1>
            <p className="page-description">
              Manage student information and enrollment records.
            </p>
          </div>

          <button
            className="btn btn-primary add-main-btn"
            onClick={openAddModal}
          >
            <span>＋</span> Add New Student
          </button>
        </section>

        {notice && (
          <div className="notice" role="status">
            <span>✓</span> {notice}

            <button
              onClick={() => setNotice("")}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        <section className="stats-grid" aria-label="Student statistics">
          <StatCard
            label="Total Students"
            value={students.length}
            icon="♙"
            description="All registered records"
          />

          <StatCard
            label="Enrolled Students"
            value={enrolledCount}
            icon="✓"
            description="Currently enrolled"
          />

          <StatCard
            label="Pending Enrollment"
            value={pendingCount}
            icon="◷"
            description="Awaiting confirmation"
          />

          <StatCard
            label="Graduated Students"
            value={graduatedCount}
            icon="⌑"
            description="Completed their studies"
          />
        </section>

        <section className="records-card" id="student-records">
          <div className="records-heading">
            <div>
              <h2>Student Records</h2>
              <p>View, search, and manage all student information.</p>
            </div>

            <span className="record-count">
              {filteredStudents.length} records
            </span>
          </div>

          <div className="toolbar">
            <div className="search-box">
              <span aria-hidden="true">⌕</span>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, ID, email or course..."
                aria-label="Search student records"
              />
            </div>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by enrollment status"
            >
              <option value="All">All statuses</option>
              <option value="Enrolled">Enrolled</option>
              <option value="Pending">Pending</option>
              <option value="Graduated">Graduated</option>
            </select>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>STUDENT ID</th>
                  <th>STUDENT</th>
                  <th>AGE</th>
                  <th>COURSE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student) => (
                  <StudentRow
                    key={student.id}
                    student={student}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                  />
                ))}
              </tbody>
            </table>

            {filteredStudents.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">⌕</div>
                <h3>No students found</h3>

                <p>
                  {students.length === 0
                    ? "Add your first student to get started."
                    : "Try changing your search or status filter."}
                </p>

                {students.length === 0 && (
                  <button
                    className="btn btn-primary"
                    onClick={openAddModal}
                  >
                    Add First Student
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="table-footer">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </section>

        <footer className="main-footer">
          <span>Student Management System</span>
          <span>DIWA2110 · React & JavaScript</span>
        </footer>
      </main>

      {modal?.type === "add" && (
        <Modal title="Add New Student" onClose={closeModal}>
          <p className="modal-description">
            Enter the student's details below. Fields marked * are required.
          </p>

          <StudentForm
            onSave={addStudent}
            onCancel={closeModal}
          />
        </Modal>
      )}

      {modal?.type === "edit" && (
        <Modal title="Edit Student" onClose={closeModal}>
          <p className="modal-description">
            Update the information for {modal.student.fullName}.
          </p>

          <StudentForm
            key={modal.student.id}
            student={modal.student}
            onSave={editStudent}
            onCancel={closeModal}
          />
        </Modal>
      )}

      {modal?.type === "delete" && (
        <Modal title="Delete Student" onClose={closeModal}>
          <div className="delete-content">
            <div className="delete-warning">!</div>

            <h3>Are you sure you want to delete this student?</h3>

            <p>
              You are about to remove{" "}
              <strong>{modal.student.fullName}</strong> (
              {modal.student.id}). This action cannot be undone.
            </p>
          </div>

          <div className="modal-actions">
            <button
              className="btn btn-light"
              onClick={closeModal}
            >
              Cancel
            </button>

            <button
              className="btn btn-danger"
              onClick={deleteStudent}
            >
              Delete Student
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default App;
