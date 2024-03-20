import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [items, setItems] = useState([]);
  const [ItemDelete, setItemToDelete] = useState("");
  console.log("sameea", items);

  useEffect(() => {
    const fetchitems = async () => {
      try {
        const res = await fetch(`/api/items/getAllItems`);
        const data = await res.json();

        if (res.ok) {
          setItems(data.items);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchitems();
  }, [currentUser._id]);

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`/api/items/deleteitem/${ItemDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item._id !== ItemDelete));
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isStoreManger ? (
        <>
          <table className="w-full divide-y divide-gray-200 shadow-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Items name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Edit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr
                  key={item._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{item.ItemsN}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={item.image}
                      className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.quantity}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/update/${item._id}`}
                      className="text-teal-500 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      onClick={() => {
                        setItemToDelete(item._id);
                        handleDeleteUser();
                      }}
                      className="text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>You have no users yet!</p>
      )}
    </div>
  );
}
