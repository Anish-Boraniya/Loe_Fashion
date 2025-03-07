import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BiRupee } from "react-icons/bi";
import { jsPDF } from "jspdf";

function FakePaymentForm() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.shopCart);
  const { us} = useSelector((state) => state);


  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  const [cardType, setCardType] = useState("");

  const cardLogos = {
    Visa: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg",
    MasterCard:
      "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
    "American Express":
      "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg",
    Discover:
      "https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg",
    Unknown: "", // No logo for unknown card types
  };

  const handleCardNumberChange = (e) => {
    const number = e.target.value;
    setCardNumber(number);
    setCardType(detectCardType(number));
  };

  const detectCardType = (cardNumber) => {
    if (/^4/.test(cardNumber)) {
      return "Visa";
    } else if (
      /^5[1-5]/.test(cardNumber) ||
      /^222[1-9]|22[3-9]|2[3-6]|27[01]|2720/.test(cardNumber)
    ) {
      return "MasterCard";
    } else if (/^3[47]/.test(cardNumber)) {
      return "American Express";
    } else if (/^6011|^65|^64[4-9]/.test(cardNumber)) {
      return "Discover";
    } else {
      return "Unknown";
    }
  };
  const generatePDFInvoice = (cartItems, totalCartAmount, us) => {
    const doc = new jsPDF();

    // Company Name Heading
    doc.setFontSize(20);
    doc.text("Leo Fashion", 10, 20);

    // Order Details Section
    doc.setFontSize(14);
    doc.text("Order Details", 10, 40);
    doc.setFontSize(12);

    let y = 50;
    doc.text(`Order ID: ${Math.floor(Math.random() * 1000000)}`, 10, y);
    y += 10;
    doc.text(`Order Date: ${new Date().toISOString().split("T")[0]}`, 10, y);
    y += 10;
    doc.text(`Order Price: ${totalCartAmount}`, 10, y);
    y += 10;
    doc.text("Payment method: Card", 10, y); // Assuming card payment
    y += 10;
    doc.text("Payment Status: Paid", 10, y); // Assuming paid
    y += 10;
    doc.text("Order Status: Processing", 10, y); // Assuming processing
    y += 20;

    // Order Items Section
    doc.setFontSize(14);
    doc.text("Order Items", 10, y);
    y += 10;
    doc.setFontSize(12);
    cartItems.items.forEach((item) => {
      doc.text(
        `Id: ${item._id}, Quantity: ${item.quantity}, Price: ${
          item.salePrice > 0 ? item.salePrice : item.price
        }`,
        10,
        y
      );
      y += 10;
    });
    y += 20;

    /*// Shipping Info Section
    doc.setFontSize(14);
    doc.text("Shipping Info", 10, y);
    y += 10;
    doc.setFontSize(12);
    //doc.text(`Name: ${us.userName}`, 10, y);
    //y += 10;
    /*doc.text(`Address: ${orderDetails?.addressInfo?.address || "N/A"}`, 10, y);
    y += 10;
    doc.text(`City: ${orderDetails?.addressInfo?.city || "N/A"}`, 10, y);
    y += 10;
    doc.text(`Pincode: ${orderDetails?.addressInfo?.pincode || "N/A"}`, 10, y);
    y += 10;
    doc.text(`Phone: ${orderDetails?.addressInfo?.phone || "N/A"}`, 10, y);
    y += 10;
    doc.text(`Notes: ${orderDetails?.addressInfo?.notes || "N/A"}`, 10, y);
*/
    const pdfBase64 = doc.output("datauristring");
    return pdfBase64;
  };

  const formatMobileNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,5})(\d{0,5})$/);
    if (!match) return value;
    const part1 = match[1];
    const part2 = match[2];
    return part2 ? `${part1} ${part2}` : part1;
  };
  const formateCard = (value)=>{
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/);
    if (!match) return value;
    const part1 = match[1];
    const part2 = match[2];
    const part3 = match[3];
    const part4 = match[4];
    return part2 ? `${part1} ${part2} ${part3} ${part4}` : part1;
  }
  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,2})(\d{0,2})$/);
    if (!match) return value;
    const part1 = match[1];
    const part2 = match[2];
    return part2 ? `${part1} / ${part2}` : part1;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate payment processing
    setTimeout(async () => {
      setLoading(false);

      // Fake validation
      if (
        cardNumber.length === 19 &&
        expiryDate.length === 7 &&
        cvv.length === 3
      ) {
        try {
          // Generate PDF invoice
          const pdfBase64 = generatePDFInvoice(cartItems, totalCartAmount);

          // Download the PDF
          const link = document.createElement("a");
          link.href = pdfBase64;
          link.download = "invoice.pdf";
          link.click();
          
          navigate("/shop/paymentSuccess"); // Redirect to success page
        } catch (error) {
          setError("Failed to generate or download the invoice. Please try again.");
        }
      } else {
        setError("Invalid payment details. Please check your inputs.");
      }
    }, 2000); // Simulate a 2-second delay
  };
  return (
    <div className="mt-[10vh] w-[80vw] relative mx-auto p-6 bg-white flex flex-col items-center shadow-xl rounded-lg">
      <div className="w-[10vw] h-[10vh] ">
        <img
          className="w-full h-full object-cover"
          src="https://cdn-icons-png.freepik.com/512/196/196566.png?ga=GA1.1.2063178488.1736256701"
          alt=""
        />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 mt-10 flex items-start justify-between gap-[15vw]">
        <div className="flex flex-col gap-5 w-[50%]">
        <div>
          <label className="block md font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter Your Name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block md font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter Your Email Address"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block md font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            value={formatMobileNumber(mobileNumber)}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Enter Your Phone Number"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block md font-medium text-gray-700">
            City
          </label>
          <input
            type="texy"
            placeholder="Enter Your City"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
          </div>
          <div>

          <label className="block md font-medium text-gray-700">
            Zip Code 
          </label>
          <input
            type="text"
            placeholder="Enter Your Zip Code"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        </div>
        <div className="flex flex-col gap-7  w-[50%]">
        <div className="relative mt-10">
          <label className="block text-md font-medium text-gray-700">
            Card Number
          </label>
          <input
            type="text"
            value={formateCard(cardNumber)}
            onChange={handleCardNumberChange}
            placeholder="Card Number"
            className="mt-1 block h-[7vh] w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
          {cardType && cardLogos[cardType] && (
            <img
              src={cardLogos[cardType]}
              alt={cardType}
              className="absolute  right-3 mt-1 w-10 h-5 top-12 transform -translate-y-1/2 h-6"
            />
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block  md font-medium text-gray-700">
              Expiry Date
            </label>
            <input
              type="text"
              value={formatExpiryDate(expiryDate)}
              onChange={(e) => setExpiryDate(e.target.value)}
              placeholder="MM/YY"
              className="mt-1 block h-[7vh] w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block md font-medium text-gray-700">
              CVV
            </label>
            <input
              type="text"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              className="mt-1 block h-[7vh] w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        {error && <p className="text-red-500 md">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
        <div className="w-full text-center flex justify-center">
          <img
            className="w-30 h-20 text-center "
            src="https://www.paypalobjects.com/webstatic/mktg/logo/AM_mc_vs_dc_ae.jpg"
            alt=""
          />
        </div>
        </div>
      </form>
      <div className=" top-[7vh] right-[12vw] text-2xl font-bold text-blue-500 absolute flex items-center">
        <BiRupee />
        {totalCartAmount}
      </div>
    </div>
  );
}

export default FakePaymentForm;