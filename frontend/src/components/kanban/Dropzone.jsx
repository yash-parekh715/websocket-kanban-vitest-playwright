import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export const Dropzone = ({ onFileUpload, attachment }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);
      setError(null);

      // Simulate file upload delay
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = () => {
          // Create a simulated file object with URL
          const fileData = {
            name: file.name,
            type: file.type,
            size: file.size,
            // Store the data URL for preview
            dataUrl: reader.result,
            // Create a fake URL that simulates a backend storage path
            url: `/uploads/${Date.now()}-${file.name.replace(/\s+/g, "-")}`,
            lastModified: file.lastModified,
          };

          onFileUpload(fileData);
          setIsUploading(false);
        };

        reader.onerror = () => {
          setError("Error reading file");
          setIsUploading(false);
        };

        reader.readAsDataURL(file);
      }, 800); // Simulate network delay
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading,
  });

  const isImage = attachment?.type?.startsWith("image/");

  return (
    <div className="mt-4">
      {attachment ? (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
              {attachment.name}
            </span>
            <button
              type="button"
              onClick={() => onFileUpload(null)}
              className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-50"
            >
              Remove
            </button>
          </div>
          {isImage && (
            <div className="mt-2 relative">
              <img
                src={attachment.dataUrl}
                alt="Preview"
                className="max-h-48 rounded-md object-contain mx-auto border border-gray-200 bg-white p-1 shadow-sm"
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs py-1 px-2 rounded">
                Preview
              </div>
            </div>
          )}
          {!isImage && (
            <div className="flex items-center p-3 bg-white rounded-md shadow-sm border border-gray-100 mt-2">
              <div className="p-2 bg-indigo-50 rounded-md mr-3">
                {attachment.type.includes("pdf") ? (
                  <svg
                    className="h-8 w-8 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 4v3a1 1 0 001 1h3M10 14l2 2m0 0l2-2m-2 2V8"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-8 w-8 text-indigo-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 4v3a1 1 0 001 1h3"
                    />
                  </svg>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {attachment.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {(attachment.size / 1024).toFixed(1)} KB •{" "}
                  {attachment.type.split("/")[1].toUpperCase()}
                </p>
              </div>
            </div>
          )}
          <div className="mt-2 text-xs text-slate-500 flex items-center">
            <div className="flex items-center text-indigo-600">
              <svg
                className="h-3 w-3 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Stored locally (simulated backend storage)</span>
            </div>
          </div>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-all ${
            isDragActive
              ? "border-indigo-400 bg-indigo-50"
              : isUploading
              ? "border-gray-400 bg-gray-50 opacity-75"
              : "border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30"
          }`}
        >
          <div className="space-y-1 text-center">
            {isUploading ? (
              <div className="mx-auto flex flex-col items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
                <p className="mt-2 text-sm text-gray-600">Uploading file...</p>
              </div>
            ) : (
              <>
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none px-2 py-1"
                  >
                    <span>Upload a file</span>
                    <input
                      {...getInputProps()}
                      id="file-upload"
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1 pt-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF, PDF, DOC up to 10MB
                </p>
                {error && (
                  <p className="text-xs text-red-500 bg-red-50 p-1 rounded border border-red-100 mt-1">
                    {error}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
