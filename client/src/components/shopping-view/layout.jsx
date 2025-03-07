import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
      {/* common header */}
      
      <main className="flex flex-col w-full">
      <ShoppingHeader />
        <Outlet />
      </main>
    </div>
  );
}

export default ShoppingLayout;
