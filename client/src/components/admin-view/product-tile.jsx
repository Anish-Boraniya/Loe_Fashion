import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { BiRupee } from "react-icons/bi";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  const discountPercentage = product?.price && product?.salePrice 
    ? Math.round(((product.price - product.salePrice) / product.price) * 100) 
    : 0;
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>
        <CardContent>
          <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
          <div className="w-full overflow-hidden h-[8vh] flex justify-between">
           <p className="text-muted-foreground  text-lg ">
              {product?.description}
            </p>
          </div>
          <div className="flex justify-between items-center -mb-2 mt-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold flex items-center text-primary`}
            >
              <BiRupee />{product?.price}
              
            </span>
            <span className="-ml-12 text-sm text-red-500">
                  ({discountPercentage}% off)
                </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg flex items-center font-bold"><BiRupee />{product?.salePrice}</span>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
            className="w-[48%]"
          >
            Edit
          </Button>
          <Button className="w-[48%]" onClick={() => handleDelete(product?._id)}>Delete</Button>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;
