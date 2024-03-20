import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";

const CheckoutDetails = ({ items, totalPrice, onClose }) => {

  const [formData, setFormData] = useState({});
  console.log(formData)
  const [errorMessage, setErrorMessage] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const CurrentuserId = currentUser ? currentUser._id : null;




  //get chang every input valu
  const handlchange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  //save report in th data base
  const handleSubmit = async (e) => {
    e.preventDefault();


    try {

      setErrorMessage(null);

      for (const item of items) {
        if (!item.ItemsN || !item.price || !item.quantity) {
          return setErrorMessage("Items are missing required fields");
        }
      }

      const formDataWithItems = {
        ...formData,
        CurrentuserId: currentUser._id,
        items: items.map((item) => ({

          ItemsN: item.ItemsN,
          price: item.price,
          quantity: item.quantity
        })),
        length: items.length,
        totalPrice: totalPrice

      };

      console.log("dataaa", formDataWithItems);

      const res = await fetch("/api/items/Checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataWithItems),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }

      if (res.ok) {
        console.log(formDataWithItems);


        handleDeleteUser();
        generatePDF()
        navigate('/order');
        window.location.reload();



      }
    } catch (error) {
      setErrorMessage(error.message);

    }
  };

  //if submite is success clear the cart details
  const handleDeleteUser = async () => {

    try {

      const res = await fetch(`/api/items/deletCurretId/${CurrentuserId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log("fail")
      } else {
        console.log("success")
      }
    } catch (error) {
      console.log(error);
    }
  };

  //gneratePdf and downlaod
  const generatePDF = () => {

    const doc = new jsPDF();


    doc.setFont("helvetica");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);


    doc.text("User Details", 40, 5);

   

   

    

    doc.text("Phone Number:", 10, 40);
    doc.text(formData.PNumber, 50, 40);
    doc.line(10, 45, 100, 45);

    doc.text("Total Items:", 10, 50);
    doc.text(items.length.toString(), 40, 50);


    doc.text("Total Price:", 10, 60);
    doc.text(`Rs. ${totalPrice}`, 40, 60);
    doc.line(10, 55, 100, 55);

    doc.text("Items Details", 40, 70);
    let yPos = 65;


    items.forEach((item, index) => {
      yPos += 10;
      doc.text(`Item ${index + 1}: ${item.ItemsN}, Price: Rs.${item.price}, Quantity: ${item.quantity}`, 10, yPos);
      doc.line(10, yPos + 5, 100, yPos + 5);
    });


    doc.save("order_details.pdf");
  };











  return (
    <div>
      <div className="fixed top-0 left-0 w-full h-full bg-gray-900 opacity-50 z-40"></div>


      <form onSubmit={handleSubmit}>
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-600 shadow-lg rounded-lg p-4 text-white  z-50">
          <div className="overflow-y-auto max-h-[350px]">
            <div className="mb-4">
              {items.map((item, index) => (
                <div key={index}>
                  <p className='font-serif'>{item.ItemsN}</p>
                  <div className='flex gap-6 text-sm'>
                    <p>Price: Rs.{item.price}</p>
                    <p>Quantity: {item.quantity}</p>


                  </div>
                  <hr className=' bg-white w-full' />




                </div>
              ))}

              <div className='mt-4  '>

                <input
                  className=" bg-slate-100  text-black p-3 rounded-lg w-[460px] h-11 mb-4"
                  type="text"
                  placeholder="CardNumber"
                  id="CNumber"
                  onChange={handlchange}

                />
                <input
                  className=" bg-slate-100 text-black p-3 rounded-lg w-[460px] h-11 mb-4"
                  type="text"
                  placeholder="Card Date"
                  id="Cdate"
                  onChange={handlchange}

                />
                <input
                  className=" bg-slate-100 text-black p-3 rounded-lg w-[460px] h-11 mb-4"
                  type="text"
                  placeholder="CVC"
                  id="Cvc"
                  onChange={handlchange}

                />
                <input
                  className=" bg-slate-100 text-black p-3 rounded-lg w-[460px] h-11 mb-4"
                  type="text"
                  placeholder="Phone Number"
                  id="PNumber"
                  onChange={handlchange}

                />



              </div>

            </div>
          </div>

          <div className=' text-center'>


            <p>Total Items: {items.length}</p>
            <p>Total Price: Rs.{totalPrice}</p>
            <div className='flex justify-center items-center gap-6 '>
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                submit
              </button>

              <button onClick={onClose} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                Close
              </button>

            </div>
            {errorMessage && (
              <p className="mt-5 text-red-600 bg-red-300 w-300 h-7 rounded-lg text-center " >
                {errorMessage}
              </p>
            )}

          </div>

        </div>
      </form>

    </div>
  );
};

export default CheckoutDetails;