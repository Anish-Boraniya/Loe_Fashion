import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { BiRupee } from "react-icons/bi";


function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const discountPercentage = product?.price && product?.salePrice 
  ? Math.round(((product.price - product.salePrice) / product.price) * 100) 
  : 0;
  return (
    <Card className=" w-70 h-90 drop-shadow-lg relative rounded-xl overflow-hidden bg-white ">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              {`Only ${product?.totalStock} items left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className=" font-bold mb-1">{product?.title}</h2>
          <div className="flex h-[8vh] ">
            <span className="text-sm text-muted-foreground">
              {product?.description}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold flex items-center text-primary`}
            >
              <BiRupee />{product?.price}
            </span>
            <span className="-ml-[5vw] text-sm text-red-500">
                  ({discountPercentage}% off)
                </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg flex items-center font-semibold text-primary">
                <BiRupee />{product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full rounded-full cursor-pointer"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
