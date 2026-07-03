import React, { useState } from "react";
import { createBulkProducts } from "../../services/productService";

const BulkProducts = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      setLoading(true);

      const res = await createBulkProducts(file);

      alert(
        `Upload Done!\nCreated: ${res.created}\nFailed: ${res.failed.length}`
      );

      setFile(null);
    } catch (error) {
      console.log(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">

        <h2 className="text-xl font-bold text-center text-gray-800">
           Bulk Product Upload
        </h2>

        <p className="text-sm text-gray-500 text-center mt-2 mb-6">
          Upload CSV or Excel file to add multiple products
        </p>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-4">
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-sm"
          />

          {file && (
            <p className="text-sm text-green-600 mt-2 font-medium">
              Selected: {file.name}
            </p>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`w-full py-2 rounded-lg font-semibold text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload Products"}
        </button>

      </div>
    </div>
  );
};

export default BulkProducts;