
import { useState, useTheme } from "react";
import axios from "axios";
export const StudentForm = ({ student, onSubmit, onCancel }) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    phone: student?.phone || '',
    codeforces_handle: student?.codeforces_handle || ''
  });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
          Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
          }`}
        />
      </div>
      
      <div>
        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
          }`}
        />
      </div>
      
      <div>
        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
          }`}
        />
      </div>
      
      <div>
        <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
          Codeforces Handle
        </label>
        <input
          type="text"
          name="codeforces_handle"
          value={formData.codeforces_handle}
          onChange={handleChange}
          required
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
          }`}
        />
      </div>
      
      <div className="flex space-x-2 pt-4" onClick={async()=>{
        if (!student) {
          // Add new student
          console.log("Post request is gonna sent for creating new user")
          try{
            await axios.post('http://localhost:3000/api/students', {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              codeforces_handle: formData.codeforces_handle
            })
            alert("Student added successfully");
          }catch(error){
            alert("Error adding student: codeforces handle does not exist" + error.message);
          }
        } else {
          // Update existing student
          try{
            axios.put('http://localhost:3000/api/students/' + student._id, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          codeforces_handle: formData.codeforces_handle
        }).then(response => {
          console.log("Student updated successfully", response.data);
        }).catch(error => {
          console.error("Error updating student", error);
        });
          }catch(error){
            alert("Error adding student: " + error.message);
          }
      }
      }}>
        <button
          type="submit"
          className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          {student ? 'Update' : 'Add'} Student
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};