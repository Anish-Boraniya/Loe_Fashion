import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Link } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { RiUploadCloud2Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { FiLogOut } from "react-icons/fi";
import { logoutUser } from "@/store/auth-slice";


const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "image",
    label: "image",
    path: "/admin/image",
    icon: <RiUploadCloud2Line />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  

  return (
    <nav className=" mt-[8vh] border-b-2 border-zinc-200 pb-8  flex flex-col gap-5 w-full ">
      {adminSidebarMenuItems.map((menuItem) => (
        <div
          key={menuItem.id}
          onClick={() => {
            navigate(menuItem.path);
            setOpen ? setOpen(false) : null;
          }}
          className="
          
          flex gap-2 p-3 pl-5 hover:bg-black hover:text-white rounded-lg bg-zinc-100 items-center text-xl"
        >
          {menuItem.icon}
          <span>{menuItem.label}</span>
        </div>
      ))}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  function handleLogout() {
      dispatch(logoutUser());
    }

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full ">
            <SheetHeader className="border-b ">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <ChartNoAxesCombined size={30} />
                <h1 className="text-2xl font-extrabold">Admin Panel</h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-[18vw] flex-col border-r bg-background p-6 lg:flex  ">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2 "
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-2xl font-extrabold ">Admin Panel</h1>
        </div>
        <MenuItems />
          <div
          onClick={()=>handleLogout()}
           className='mt-8 flex flex-col gap-2 px-1'>
            <Link className=' w-full flex gap-2 p-3 pl-5 hover:bg-black hover:text-white rounded-lg bg-zinc-100 items-center text-xl'><FiLogOut /> Log Out</Link>
          </div>
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
