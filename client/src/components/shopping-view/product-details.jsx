import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { BiRupee } from "react-icons/bi";


function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [select,setSelect] = useState("")
  const [category, setCategory] = useState("")
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const { toast } = useToast();

  const clothing =  [ 
    { id: "s", label: "S" },
    { id: "m", label: "M" },
    { id: "l", label: "L" },
    { id: "XL", label: "XL" },
    { id: "2XL", label: "2XL" },
    { id: "3XL", label: "3XL" },
  ] 
  const footwear =  [
    { id: "6", label: "6" },
    { id: "7", label: "7" },
    { id: "8", label: "8" },
    { id: "9", label: "9" },
    { id: "10", label: "10" },
  ]


  function handleRatingChange(getRating) {
    console.log(getRating, "getRating");

    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
     
    if(productDetails?.category === "men" || productDetails?.category === "women" || productDetails?.category === "kids") {
      setCategory("clothing")
    }else if(productDetails?.category === "footwear"){
      setCategory("footwear")
    }else if(productDetails?.category === "accessories"){
      setCategory("accessories")
    }

    setSelect("")
    console.log("clothing" , productDetails?.size)
  }, [productDetails , setOpen]);

  console.log(reviews, "reviews");

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={()=>handleDialogClose()}>
      <DialogContent className=" grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] ">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square h-[90%] w-full object-cover"
          />
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-[28vw] ml-8 bottom-5 rounded-full fixed opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-[25vw] ml-8 bottom-5 rounded-full fixed"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
        <div style={ {scrollbarWidth : "none"}} className="h-[80vh] overflow-y-auto ">
          <div>
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-2xl mb-5 mt-4">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between my-10">
            <p
              className={`text-xl flex items-center text-muted-foreground gap-1 font-bold  ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              <BiRupee />{productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p
              
               className="text-3xl flex items-center gap-1 font-bold text-primary"
               >
                <BiRupee />{productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 my-10">
            <div className="flex items-center gap-0.5">
              <StarRatingComponent rating={averageReview} />
            </div>
            <span className="text-muted-foreground">
              ({averageReview.toFixed(2)})
            </span>
          </div>

          <div className="my-[10vh] mb-10 flex items-start gap-5">
            <div>
              <img 
              className="w-[4vw] h-[8vh] object-cover"
              src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-returns._CB562506492_.png" alt="" />
               <div className="w-20 text-xs text-blue-600">
              10 days return & exchange
            </div>
            </div>
            <div>
              <img 
              className="w-[4vw] h-[8vh]   object-cover"
              src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/trust_icon_free_shipping_81px._CB562549966_.png" alt="" />
               <div className="w-20 text-xs text-blue-600">
              free delivery
            </div>
            </div>
            <div>
              <img 
              className="w-[4vw] h-[8vh] object-cover"
              src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-top-brand._CB562506657_.png" alt="" />
               <div className="w-20 text-xs text-blue-600">
              top brand
            </div>
            </div>
            <div>
              <img 
              className="w-[4vw] h-[8vh] object-cover"
              src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/icon-amazon-delivered._CB562550117_.png" alt="" />
               <div className="w-20 text-xs text-blue-600">
               Lio Fashion delivered
            </div>
            </div>
            <div>
              <img 
              className="w-[4vw] h-[8vh] object-cover"
              src="https://m.media-amazon.com/images/G/31/A2I-Convert/mobile/IconFarm/Secure-payment._CB650126890_.png" alt="" />
               <div className="w-20 text-xs text-blue-600 text-center -ml-2 ">
              secure transaction
            </div>
            </div>
          </div>

          <div className="my-[10vh] flex gap-5 items-center">
            <h1 className="text-xl font-bold">Size : </h1>
            {
              category === "clothing" && clothing.map((size, index) =>(
              <div 
              key={index}
              onClick={()=>setSelect(size.label)}
              className={`bg-zinc-100   w-11 h-11 text-lg flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 ${select === size.label && "bg-zinc-900 text-white scale-103"} `}>{size.label}</div>
            ))}
             {
              category === "footwear" && footwear.map((size, index) =>(
              <div 
              key={index}
              onClick={()=>setSelect(size.label)}
              className={`bg-zinc-100   w-11 h-11 text-lg flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 ${select === size.label && "bg-zinc-900 text-white scale-103"} `}>{size.label}</div>
            ))}
            {
              category === "accessories" && 
              <div 
              className={`text-lg flex items-center justify-center `}>free size</div>
            }
          </div>

          <div className="my-[10vh] flex flex-col  gap-2">
            <label className=" text-xl font-bold"> Product Details</label>

            <div className="mt-5  flex items-center gap-10">
              <label className="font-bold w-40  text-lg">Material</label>
              <div className="text-md">{productDetails?.material || category === "clothing" ? "cotton" : category === "footwear" ? "rubbar" : "NA"}</div>
            </div>

            <div className="flex items-center gap-10">
              <label className="font-bold w-40 text-lg">Fit Type</label>
              <div className="text-md">{productDetails?.fit || "regular"}</div>
            </div>

            <div className=" flex items-center gap-10">
            <label className="font-bold w-40 text-lg">Pattern</label>
              <div className="text-md">{productDetails?.pattern || "solid"}</div>
            </div>

            <div className=" flex items-center gap-10">
            <label className="font-bold w-40 text-lg">Color</label>
              <div className="text-md">{productDetails?.color || "NA"}</div>
            </div>

            <div className=" flex  items-center gap-10">
            <label className="font-bold w-40  text-lg">Country of origin</label>
              <div className="text-md">{productDetails?.country || "india"}</div>
            </div>

          </div>

          <div className="my-[10vh] flex flex-col  gap-2">
            <label className=" text-xl font-bold"> Additional Information</label>

            <div className="mt-5  flex items-center gap-10">
              <label className="font-bold w-40  text-lg">Manufacturer</label>
              <div className="text-md">Lio fashion</div>
            </div>

            <div className="flex items-center gap-10">
              <label className="font-bold w-40  text-lg">packer</label>
              <div className="text-md">Lio fashion</div>
            </div>

            <div className="flex items-center gap-10">
              <label className="font-bold w-40  text-lg">Net Quantity</label>
              <div className="text-md">1 Count</div>
            </div>

          </div>
          
          <Separator />
          <div className="max-h-[300px] mt-5 ">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Reviews</h1>
              )}
            </div>
            <div className="mt-10 flex-col flex gap-2">
              <Label>Write a review</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Write a review..."
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === ""}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
