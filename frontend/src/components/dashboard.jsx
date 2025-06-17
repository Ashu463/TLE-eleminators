import { useTheme, useState } from 'react';
import axios from 'axios';
import { StudentsTable } from './studentTable';

const Modal = ({ isOpen, onClose, title, children }) => {
  const { isDark } = useTheme();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-md`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
          <button
            onClick={onClose}
            className={`text-gray-500 hover:text-gray-700 ${isDark ? 'hover:text-gray-300' : ''}`}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
export const Dashboard = () => {
    const [currentView, setCurrentView] = useState('dashboard');
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    const handleAddStudent = (studentData) => {
    const newStudent = {
      ...studentData,
      id: Date.now(),
      current_rating: 0,
      max_rating: 0,
      last_updated: new Date().toISOString(),
      email_reminders_sent: 0,
      email_reminders_disabled: false
    };
    setStudents([...students, newStudent]);
    setShowAddModal(false);
  };
  
  const handleEditStudent = (studentData) => {
    setStudents(students.map(student => 
      student.id === editingStudent.id 
        ? { ...student, ...studentData }
        : student
    ));
    setShowEditModal(false);
    setEditingStudent(null);
  };
  
  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      axios.delete(`http://localhost:3000/api/students/${studentId}`)
    }
  };
  
  const handleViewDetails = (student) => {
    setSelectedStudent(student);
  };
  
  const handleBack = () => {
    setSelectedStudent(null);
  };

    return (
        <div>
            <main className="container mx-auto px-6 py-8">
        {currentView === 'dashboard' && !selectedStudent && (
          <StudentsTable
            students={students}
            onAdd={() => {
              setShowAddModal(true)

            }}
            onEdit={(student) => {
              setEditingStudent(student);
              setShowEditModal(true);
            }}
            onDelete={handleDeleteStudent}
            onViewDetails={handleViewDetails}
          />
        )}
        
        {currentView === 'dashboard' && selectedStudent && (
          <StudentProfile
            student={selectedStudent}
            onBack={handleBack}
          />
        )}
        
        {currentView === 'settings' && <Settings />}
      </main>
      
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Student"
      >
        <StudentForm
          onSubmit={handleAddStudent}
          onCancel={() => setShowAddModal(false)}
        />
      </Modal>
      
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingStudent(null);
        }}
        title="Edit Student"
      >
        <StudentForm
          student={editingStudent}
          onSubmit={handleEditStudent}
          onCancel={() => {
            setShowEditModal(false);
            setEditingStudent(null);
          }}
        />
      </Modal>
        </div>
    )
}