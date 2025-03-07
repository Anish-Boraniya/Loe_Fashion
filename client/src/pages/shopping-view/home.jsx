import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import home from "./hero.svg";
import { Link } from "react-router-dom";
import Footer from "@/components/shopping-view/Footer";

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon ,image:"https://img.freepik.com/free-photo/elegant-young-handsome-man_1301-5870.jpg?ga=GA1.1.2063178488.1736256701&semt=ais_hybrid"},
  { id: "women", label: "Women", icon: CloudLightning  ,image:"https://images.pexels.com/photos/19590895/pexels-photo-19590895/free-photo-of-woman-posing-in-black-bra.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"},
  { id: "kids", label: "Kids", icon: BabyIcon ,image:"https://images.pexels.com/photos/1493108/pexels-photo-1493108.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: "accessories", label: "Accessories", icon: WatchIcon ,image:"https://img.freepik.com/free-photo/flatlay-outfit-travel_53876-138233.jpg?ga=GA1.1.2063178488.1736256701&semt=ais_hybrid" },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon  ,image:"https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2hvZXxlbnwwfHwwfHx8MA%3D%3D"},
];

const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt,image:"https://i.pinimg.com/474x/8e/60/08/8e60085f984cd478f4d192e327af39b5.jpg" },
  { id: "adidas", label: "Adidas", icon: WashingMachine,image:"https://cdn.iconscout.com/icon/free/png-512/free-adidas-logo-icon-download-in-svg-png-gif-file-formats--brand-fashion-pack-logos-icons-2854297.png?f=webp&w=512" },
  { id: "puma", label: "Puma", icon: ShoppingBasket,image:"https://i.pinimg.com/736x/d6/ce/3e/d6ce3eb7e52927984086b87d2246f01b.jpg" },
  { id: "levi", label: "Levi's", icon: Airplay,image:"https://i.pinimg.com/474x/3a/2a/97/3a2a979ee06c68907450795bbe66d32c.jpg" },
  { id: "zara", label: "Zara", icon: Images ,image:"https://i.pinimg.com/474x/af/84/6e/af846e8b9c2f4ecec25e6a13e0faa07e.jpg"},
  { id: "h&m", label: "H&M", icon: Heater, image:"https://i.pinimg.com/474x/f7/a3/b0/f7a3b0830f227d22add62f549556bd01.jpg" },
];

const bg = "https://img.freepik.com/premium-photo/black-wall-with-black-background_337384-104337.jpg?w=1380"
function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
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

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  console.log(productList, "productList");

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  const cardRef = useRef(null);
  const card = useRef(null);
  const card2= useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [vis, setVis] = useState(false);
  const [vis2, setVis2] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(cardRef.current); // Stop observing once visible
        }
      },
      {
        threshold: 0.5, // Adjust threshold as needed (0.5 means 50% visible)
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { 
          setVis2(true);
          observer.unobserve(card2.current); // Stop observing once visibl // Stop observing once visible
        }
      },
      {
        threshold: 0.5, // Adjust threshold as needed (0.5 means 50% visible)
      }
    );

    if (card2.current) {
      observer.observe(card2.current);
    }

    return () => {
      if (card2.current) {
        observer.unobserve(card2.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { 
          setVis(true);
          observer.unobserve(card.current); // Stop observing once visibl // Stop observing once visible
        }
      },
      {
        threshold: 0.5, // Adjust threshold as needed (0.5 means 50% visible)
      }
    );

    if (card.current) {
      observer.observe(card.current);
    }

    return () => {
      if (card.current) {
        observer.unobserve(card.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
        <div className="w-[100vw] flex mt-8 items-center justify-center relative  h-[calc(100vh)]">
         <div
          style={{animationDuration: "1500ms"}}
          className="w-[90%] animate-scale-up h-[100%]">
         <img className="w-[100%] object-cover h-[100%]" src={home} alt="" />
         </div>
        </div>
      <div className="relative mt-10 animate-scale-up  w-full h-[700px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <div className={`${
                index === currentSlide ? "opacity-100" : "opacity-0"
              } absolute top-0 left-0 px-[12vh] py-[7vh] w-full h-full object-cover transition-opacity duration-1000`}>
                <img
                src={slide?.image}
                key={index}
                className="w-full rounded-xl h-full object-cover"
                /*className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 rounded-xl px-[12vh] py-[7vh] w-full h-full object-cover transition-opacity duration-1000`}*/
              />
              </div>
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <section ref={cardRef} className="py-12 bg-gray-50">
        <div className="container py-10  mb-18 mx-auto px-4">
          <h2 className="text-3xl font-bold text-center  mb-[10vh]">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                style={{ 
                  backgroundImage: `url(${categoryItem.image})`,
                  animationDuration:"1500ms"
               }}
                className={`cursor-pointer p-5 bg-cover rounded-xl  hover:w-[102%] hover:h-[103%]  hover:shadow-xl transition-shadow transition-transform ${
                isVisible ? 'animate-scale-up' : 'scale-0 opacity-0' 
                }   ease-in-out`}
              >
                <CardContent className="flex h-[20vh] flex-col items-start justify-start">
                  
                  <span className="font-bold text-zinc-800">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section 
      ref={card}
      className="py-12 mt-10 bg-gray-50">
        <div
         style={{ 
          backgroundImage: `url(${bg})`,
          animationDuration:"1300ms",
          animationDelay: "100ms"
         }}
         className={`container bg-cover rounded-xl py-[10vh] ${vis? 'animate-slide-left' : ''} opacity-0 mx-auto px-4`}>
          <h2 className="text-3xl text-white font-bold text-center mb-[10vh]">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
              
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                 style={{ 
                  backgroundImage: `url(${brandItem.image})`,
                  animationDuration:"1500ms"
                 }}
                 key={brandItem.id}
                 className={`cursor-pointer p-5 bg-cover bg-white  rounded-xl hover:w-[102%] hover:h-[103%]  hover:shadow-xl transition-shadow  ${vis? 'animate-slide-down' : ''} opacity-0 `}
              >
                <CardContent
                 className="flex h-[20vh] flex-col  items-start justify-start">
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
      ref={card2} 
      className="py-12 mt-20 ">
        <div
         className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mt-10 mb-[10vh]">
            Feature Products
          </h2>
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    className={`${vis2?"animate-fade-in":"opacity-0"}`}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
      <Footer />
    </div>
  );
}

export default ShoppingHome;
