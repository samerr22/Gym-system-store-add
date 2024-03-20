import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';



export default function Order() {
  const { currentUser } = useSelector((state) => state.user);
  const CurrentuserId = currentUser ? currentUser._id : null;
  const [orderDetailsList, setOrderDetailsList] = useState([]);
  const [query, setQuery] = useState(" ");
  const [filteredOrderDetailsList, setFilteredOrderDetailsList] = useState([]);

  console.log(orderDetailsList)
  console.log(orderDetailsList.filter(order => order.totalPrice && order.totalPrice.toString().includes("44")));
  console.log(orderDetailsList.filter(order => order.items.some(item => item.ItemsN && item.ItemsN.toLowerCase().includes("ee"))));

  //after submit form display data order page
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/items/itemDetails/${CurrentuserId}`);
        const data = await response.json();

        if (data.length > 0) {
          setOrderDetailsList(data);
          setFilteredOrderDetailsList(data);
        } else {
          setOrderDetailsList([]);
          setFilteredOrderDetailsList([]);
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchData();
  }, [CurrentuserId]);


  //search the data in the order page usign item name
  const handleSearch = () => {
    const filteredData = orderDetailsList.filter(order =>
      order.items.some(item => item.ItemsN && item.ItemsN.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredOrderDetailsList(filteredData);
  };

  return (
    <div>
      <div className="ml-8 mt-7 flex justify-center items-center">
        <form>
          <input
            type='text'
            placeholder='Search... '
            className=" w-[200px=] h-6"
            onChange={(e) => setQuery(e.target.value)}

          />
        </form>
        <button onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>

      {filteredOrderDetailsList.length > 0 ? (
        filteredOrderDetailsList.map((order, index) => (
          <div key={index} className="ml-5 mb-32">
            <h2 className="text-xl font-serif">Order {index + 1} Details</h2>
           
           
            

            <div className="flex ">
              <p className="font-serif text-lg">Phone Number:</p>
              <p className="ml-5"> {order.PNumber}</p>
            </div>

            <div className="flex ">
              <p className="font-serif text-lg">Total Price: </p>
              <p className="ml-5"> Rs. {order.totalPrice}</p>
            </div>

            <div className="flex">
              <p className="font-serif text-lg">Number of Items: </p>
              <p className="ml-5"> {order.items.length}</p>
            </div>

            <div className="flex ">
              <p className="font-serif text-lg">User ID: </p>
              <p className="ml-5"> {order.CurrentuserId}</p>
            </div>



            <div className="flex ">
              <p className="font-serif text-lg">Date: </p>
              <p className="ml-5"> {moment(order.updatedAt).format("YYYY-MM-DD hh:mm:ss a")}</p>
            </div>







            <div>
              <h2 className="text-xl font-serif">Items</h2>
              {order.items.map((item, itemIndex) => (
                <div key={itemIndex} >
                  <div className="flex  gap-4">
                    <div className="font-extralight text-sm mb-2 truncate w-32">{item.ItemsN}</div>
                    <p className="text-gray-700 font-extralight text-sm">Rs.{item.price}</p>
                    <p className="text-gray-700 font-extralight text-sm">Order Items-{item.quantity}</p>

                  </div>
                  <hr className="h-1 bg-slate-600 w-full" />
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="flex justify-center items-center">No orders found.</p>
      )}

    </div>
  );
}
