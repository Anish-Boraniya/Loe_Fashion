import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import {
  json,
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import logo from "../../assets/leo (1).png";
import { CgProfile } from "react-icons/cg";
import { FiSearch } from "react-icons/fi";




function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:grid lg:grid-cols-2 lg:gap-5  h-10 gap-8 ">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-md h-[85%] hover:text-zinc-700  font-medium cursor-pointer"
          key={menuItem.id}
          
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  console.log(cartItems, "leo");

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-[-10px] right-[2px] font-bold text-sm">
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      <DropdownMenu>
          <div className="w-10 h-10 -mr-3 flex items-center justify-center text-3xl">
            <CgProfile />
          </div>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const [show,setShow] = useState(false)
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [keyword,setKeyword] = useState('')
  const navigate = useNavigate();

  const handleSearch = () => {
    localStorage.removeItem("keyword");
    localStorage.setItem("keyword", JSON.stringify(keyword));
    navigate("/shop/search")
  }

  return (
    <header className={`fixed top-0 z-40 w-full drop-shadow-lg  border-b backdrop-blur bg-white/95 animate-slide-down opacity-0 `}>
      <div className="flex h-[11.3vh] items-center justify-between px-4 md:px-6">
        <Link to="/shop/home"
        style={{animationDelay:"1500ms"}}
         className="flex items-center opacity-0 animate-slide-down-child  gap-2">
          <div className="h-[9vh] w-[9vh] overflow-hidden rounded-full ">
            <img
              className="h-[200%] w-[200%]  -mt-7 rounded-full object-cover"
              src={logo}
              alt="Leo Fashion"
            />
          </div>
          <span className="font-bold text-lg font-nunito">Leo Fashion</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        <div
        style={{animationDelay: '1800ms'}}
         className="hidden  animate-slide-down-child opacity-0 lg:block">
         <div className="flex gap-10 text-lg">
         <Link className=" ml-20 h-9 hover:border-b-2 hover:border-black hover:border-solid" to="/shop/home">Home</Link>
         <div
              className="relative h-9 hover:border-b-2 hover:border-black hover:border-solid cursor-pointer"
              onMouseEnter={() => setShow(true)}
              onMouseLeave={() => setShow(false)}
            >
              <Link onClick={()=>setShow(false)} to="/shop/listing">Products</Link> 
              {show && (  
                <div
                  className="absolute z-[50] top-8 left-0 w-[25vw] h-[30vw] "
                >
                  <div className="p-10 rounded-lg mt-10 drop-shadow-xl w-[25vw] h-[35vh] bg-white"><MenuItems /></div>
                  
                </div>
              )}
            </div>
          <Link to="/shop/about" className="h-9 hover:border-b-2 hover:border-black hover:border-solid" >About Us</Link>
          <Link to="/shop/contect"className="h-9 hover:border-b-2 hover:border-black hover:border-solid">Contact Us</Link>
          <div>
            <input
             onChange={(e)=>setKeyword(e.target.value)}
             className="ml-[8vw] border-black border rounded-full px-2" type="text" placeholder="search..." />
            <Button
             onClick={handleSearch}
             className="ml-3 p-2 h-fit rounded-full"><FiSearch /></Button>
          </div>
         </div>
        </div>
        <div
        style={{animationDelay:"2000ms"}}
         className="hidden animate-slide-down-child opacity-0 lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
