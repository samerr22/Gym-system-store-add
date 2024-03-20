import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";

export default function CreatePost() {
  const [files, setFiles] = useState([null, null, null]); // State for three files
  const [imageUploadProgress, setImageUploadProgress] = useState([
    null,
    null,
    null,
  ]); // State for three upload progress
  const [imageUploadErrors, setImageUploadErrors] = useState([
    null,
    null,
    null,
  ]); // State for three upload errors
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  console.log(formData);

  const navigate = useNavigate();
  const { itemId } = useParams();

  useEffect(() => {
    try {
      const fetchStudents = async () => {
        const res = await fetch(`/api/items/getAllItems?itemId=${itemId}`);
        const data = await res.json();
        console.log("data", data);

        if (!res.ok) {
          console.log(data.message);
        }
        if (res.ok) {
          const selected = data.items.find((item) => item._id === itemId);
          if (selected) {
            setFormData(selected);
          }
        }
      };
      fetchStudents();
    } catch (error) {
      console.log(error.message);
    }
  }, [itemId]);

  const handleUploadImage = async (index) => {
    try {
      const file = files[index];
      if (!file) {
        setImageUploadErrors((prevErrors) => {
          const newErrors = [...prevErrors];
          newErrors[index] = "Please select an image";
          return newErrors;
        });
        return;
      }
      setImageUploadErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[index] = null;
        return newErrors;
      });
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress((prevProgress) => {
            const newProgress = [...prevProgress];
            newProgress[index] = progress.toFixed(0);
            return newProgress;
          });
        },
        (error) => {
          setImageUploadErrors((prevErrors) => {
            const newErrors = [...prevErrors];
            newErrors[index] = "Image upload failed";
            return newErrors;
          });
          setImageUploadProgress((prevProgress) => {
            const newProgress = [...prevProgress];
            newProgress[index] = null;
            return newProgress;
          });
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress((prevProgress) => {
              const newProgress = [...prevProgress];
              newProgress[index] = null;
              return newProgress;
            });
            setImageUploadErrors((prevErrors) => {
              const newErrors = [...prevErrors];
              newErrors[index] = null;
              return newErrors;
            });
            setFormData((prevData) => ({
              ...prevData,
              image: [
                ...(prevData.image || []),
                downloadURL, // Corrected line
              ],
              [`image${index + 1}`]: downloadURL,
            }));
          });
        }
      );
    } catch (error) {
      setImageUploadErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[index] = "Image upload failed";
        return newErrors;
      });
      setImageUploadProgress((prevProgress) => {
        const newProgress = [...prevProgress];
        newProgress[index] = null;
        return newProgress;
      });
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/items/updateitem/${formData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/`);
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

  const handleFileChange = (e, index) => {
    const newFiles = [...files];
    newFiles[index] = e.target.files[0];
    setFiles(newFiles);
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create Items</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3"
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, index)}
              className="border border-gray-300 bg-white rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              className="w-40 h-10 rounded-lg bg-gray-700 text-white hover:opacity-90"
              size="sm"
              onClick={() => handleUploadImage(index)}
              disabled={imageUploadProgress[index]}
            >
              {imageUploadProgress[index] ? (
                <div className="w-16 h-16">
                  <CircularProgressbar
                    value={imageUploadProgress[index]}
                    text={`${imageUploadProgress[index] || 0}%`}
                  />
                </div>
              ) : (
                "Upload Image"
              )}
            </button>
            {imageUploadErrors[index] && (
              <p className="mt-5 text-red-600 bg-red-300 w-300 h-7 rounded-lg text-center">
                {imageUploadErrors[index]}
              </p>
            )}
            {formData[`image${index + 1}`] && (
              <img
                src={formData[`image${index + 1}`]}
                alt={`upload-${index + 1}`}
                className="w-full h-72 object-cover"
              />
            )}
          </div>
        ))}

        {publishError && (
          <p className="mt-5 text-red-600 bg-red-300 w-300 h-7 rounded-lg text-center">
            {publishError}
          </p>
        )}

        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <input
            className=" flex-1 bg-slate-100 p-3 rounded-lg w-[460px] h-11"
            type="text"
            placeholder="Item Name"
            required
            id="ItemsN"
            onChange={(e) =>
              setFormData({ ...formData, ItemsN: e.target.value })
            }
            value={formData.ItemsN}
          />
          <input
            type="text"
            placeholder="Price"
            required
            id="price"
            className="flex-1 bg-slate-100 p-3 rounded-lg w-[460px] h-11"
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            value={formData.price}
          />
          <input
            type="text"
            placeholder="Quantity"
            required
            id="quantity"
            className="flex-1 bg-slate-100 p-3 rounded-lg w-[460px] h-11"
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            value={formData.quantity}
          />
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Description"
            required
            id="Description"
            className="flex-1 bg-slate-100 p-3 rounded-lg w-[460px] h-11"
            onChange={(e) =>
              setFormData({ ...formData, Description: e.target.value })
            }
            value={formData.Description}
          />
        </div>

        <button
          type="submit"
          className=" bg-gray-700 text-white p-3 rounded-lg w-[460px] h-11 hover:opacity-90 lg:w-full"
        >
          Add
        </button>

        {publishError && (
          <p className="mt-5 text-red-600 bg-red-300 w-300 h-7 rounded-lg text-center">
            {publishError}
          </p>
        )}

        {publishError && (
          <p className="mt-5 text-red-600 bg-red-300 w-300 h-7 rounded-lg text-center ">
            {publishError}
          </p>
        )}
      </form>
    </div>
  );
}
