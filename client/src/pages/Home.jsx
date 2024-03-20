import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const { currentUser } = useSelector((state) => state.user);
  const [Items, setItems] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
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

    fetchItems();
  }, []);

  const handleAddToCart = async (itemId) => {
    try {
      const selectItem = Items.find((item) => item._id === itemId);
      if (!selectItem) {
        throw new Error("Item not found");
      }

      const response = await fetch(`/api/items/Cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ItemId: selectItem._id,
          CurrentuserId: currentUser._id,
          ItemsN: selectItem.ItemsN,
          image: selectItem.image,
          price: selectItem.price,
          quantity: selectItem.quantity,
          Description: selectItem.Description,
        }),
      });

      if (!response.ok) {
        setNotification("Out of stock");
      } else {
        setNotification("Item added");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCart = () => {
    if (currentUser) {
      handleAddToCart();
    } else {
      window.scrollTo(0, 0);
      navigate("/sign-in");
    }
  };

  return (
    <div>
      <div className="mt-10 mb-[-40px]">
        <h className="text-[30px] ml-20 font-medium text-gray-500 ">Store</h>
      </div>

      <div className="flex justify-center">
        <div className="flex flex-wrap justify-center">
          {Items && Items.length > 0 ? (
            <>
              {Items.slice(0, showMore ? Items.length : 7).map((item) => (
                <div
                  key={item._id}
                  className="w-[200px] h-[200px]  mt-10 mb-40 rounded  shadow-xl "
                >
                  <Link to={`/item/${item._id}`}>
                    <img
                      className="w-[100px] h-[100px]"
                      src={item.image[0]}
                      alt={item.ItemsN}
                    />
                  </Link>
                  <div className="px-6 py-4">
                    <Link to={`/item/${item._id}`}>
                      <div className="font-bold text-xl mb-2 truncate w-32">
                        {item.ItemsN}
                      </div>
                      <p className="text-gray-700 text-base">Rs.{item.price}</p>

                      <p className="text-gray-700 text-base">
                        {item.quantity}-Item
                      </p>
                    </Link>
                  </div>
                  <div className="px-6 pt-4 pb-2">
                    {currentUser ? (
                      <button
                        className="bg-slate-400 hover:bg-blue-700 text-white font-bold py-2 px-4  rounded"
                        onClick={() => handleAddToCart(item._id)}
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <button
                        className="bg-slate-400 hover:bg-blue-700 text-white font-bold py-2 px-4    rounded"
                        onClick={handleCart}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {notification && (
                <>
                  <div className="fixed top-0 left-0 w-full h-full bg-gray-900 opacity-50 z-50"></div>
                  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                    <div>
                      <div className="     ">
                        <h className="text-white flex justify-center  items-cente text-center py-[40%] font-serif text-3xl">
                          {notification}
                        </h>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {!showMore && Items.length > 7 && (
                <div className="mt-8 md:hidden sm:hidden lg:block mb-4 ml-[60px]">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
                    onClick={() => setShowMore(true)}
                  >
                    Show More
                  </button>
                </div>
              )}
            </>
          ) : (
            <p>You have no items yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
