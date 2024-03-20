import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

export default function ItemDetails() {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);

  const { itemId } = useParams();
  console.log(itemId);

  const [items, setItems] = useState("");
  console.log(items);
  const [quantity, setquantity] = useState(1);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  // one items want to buy items increase
  const increment = () => {
    if (quantity < 3) {
      setquantity(quantity + 1);
    }
  };
  //one itme. want to buy items decrease
  const decrement = () => {
    if (quantity > 1) {
      setquantity(quantity - 1);
    }
  };

  //after go to home page inside items add to cart
  const addToCart = async () => {
    try {
      const response = await fetch("/api/items/Cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ItemId: items._id,
          CurrentuserId: currentUser._id,
          ItemsN: items.ItemsN,
          quantity: quantity,
          price: items.price,
          image: items.image,
          Description: items.Description,
        }),
      });

      if (response.ok) {
        setNotification("Item added");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setNotification("Out of stock");
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  //home page click in the items list one item go to inside and display data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/items/getItem/${itemId}`);
        const data = await response.json();

        if (response.ok) {
          setItems(data.items[0]);
        } else {
          console.log("no data");
        }
      } catch (error) {
        console.error("Error fetching bid data:", error);
      }
    };

    fetchData();

    // Add event listener to remove notification on click anywhere on the page
    const handleClick = () => {
      setNotification(null);
    };
    document.body.addEventListener("click", handleClick);

    // Cleanup function to remove event listener memori leack and unexpect behavioous
    return () => {
      document.body.removeEventListener("click", handleClick);
    };
  }, [itemId]);

  //if current user have a user id then he can add data and he not a currentuser(not log) and he click the add to cart button  go to sigin page
  const handleAddToCart = () => {
    if (currentUser) {
      addToCart();
    } else {
      navigate("/sign-in");
    }
  };

  return (
    <div>
      {items ? (
        <>
          <div className="flex justify-center ">
            <div>
              <img className="w-[400px]  " src={items.image} alt="" />
            </div>

            <div className="ml-10">
              <h1 className="max-w-xs break-words font-serif text-slate-700 text-xl">
                {items.ItemsN}
              </h1>
              <hr className="h-10" />

              <div className="flex">
                {items.image.map((image, index) => (
                  <img className="w-[70px]   " key={index} src={image} alt="" />
                ))}
              </div>

              <h1 className="mt-5 text-2xl font-semibold text-slate-700">
                Rs {items.price}
              </h1>
              <div className="flex mt-10">
                <div
                  className="w-[30px] border flex justify-center items-center  "
                  onClick={decrement}
                >
                  <FaMinus />
                </div>
                <div className="text-[20px] w-[30px]  flex justify-center items-center ">
                  {quantity}
                </div>

                <div
                  className="w-[30px] border   flex justify-center items-center "
                  onClick={increment}
                >
                  <FaPlus />
                </div>
              </div>
              {currentUser ? (
                <button
                  className="bg-slate-400 hover:bg-blue-700 text-white font-bold py-2 px-12 mt-5 rounded"
                  onClick={addToCart}
                >
                  Add to Cart
                </button>
              ) : (
                <button
                  className="bg-slate-400 hover:bg-blue-700 text-white font-bold py-2 px-12 mt-5 rounded"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              )}
              {notification && (
                <>
                  <div className="fixed top-0 left-0 w-full h-full bg-gray-900 opacity-50 z-50"></div>
                  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                    <div>
                      <div>
                        <h1 className="text-white flex justify-center items-cente text-center py-[40%] font-serif text-3xl">
                          {notification}
                        </h1>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-5 mb-5 ml-10">
            <h1 className="text-xl font-serif text-slate-700 ">Description</h1>
            <hr className="h-[10px] mt-2" />
            <h1 className="max-w-[1200px] break-words text-sm ">
              {items.Description}
            </h1>
          </div>
        </>
      ) : (
        <>
          <p>Loading</p>
        </>
      )}
    </div>
  );
}
