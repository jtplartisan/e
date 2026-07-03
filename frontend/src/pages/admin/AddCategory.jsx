import { useEffect, useState } from "react";
import {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";

function AddCategory() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.categories || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return alert("Category name is required");
    }

    try {
      setLoading(true);

      if (editId) {
        await updateCategory(editId, { name });
        alert("Category updated successfully");
      } else {
        await addCategory({ name });
        alert("Category added successfully");
      }

      setName("");
      setEditId(null);
      fetchCategories();
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setName(category.name);
    setEditId(category._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await deleteCategory(id);
      alert("Category deleted successfully");

      if (editId === id) {
        setEditId(null);
        setName("");
      }

      fetchCategories();
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-linear-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold">
            {editId ? "Update Category" : "Category Management"}
          </h1>
          <p className="text-blue-100 mt-2">
            Add, edit ,delete and manage categories easily
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-700">
            {editId ? "Edit Category" : "Add New Category"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-4"
          >
            <input
              type="text"
              placeholder="Enter category name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-8 py-3 rounded-xl font-semibold"
            >
              {loading ? "Saving..." : editId ? "Update" : "Add"}
            </button>

            {editId && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setName("");
                }}
                className="bg-gray-500 hover:bg-gray-600 transition text-white px-8 py-3 rounded-xl font-semibold"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* Table Header */}
          <div className="flex justify-between items-center px-6 py-5 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-700">
              Categories
            </h2>

            <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-medium">
              {categories.length} Total
            </span>
          </div>

          {/* Empty State */}
          {categories.length === 0 ? (
            <div className="text-center py-14">
              <p className="text-gray-500 text-lg">
                No categories found
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-6 py-4 text-gray-600">#</th>
                    <th className="px-6 py-4 text-gray-600">Category Name</th>
                    <th className="px-6 py-4 text-center text-gray-600">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category, index) => (
                    <tr
                      key={category._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-gray-500 font-medium">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-800">
                        {category.name}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => handleEdit(category)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(category._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AddCategory;