import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { BiRupee } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData: formData,
          })
        ).then((data) => {
          console.log(data, "edit");

        try{
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
          }else {
            console.log(data?.error)
            toast({
              title: "Failed to update product",
              description: data?.error?.message || "Unknown error occurred",
              variant: "destructive"
            });
          }
        }catch(e){
          console.error("error is edit",e);
          toast({
            title: "Failed to update product",
            description: e.message || "Unknown error occurred",
            variant: "destructive"
          });
        }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast({
              title: "Product add successfully",
            });
          }
        });
  }

  function handleDelete(getCurrentProductId) {
    const userConfirmed = confirm("are you sure you want to delete this product?");
    if(userConfirmed ){
      dispatch(deleteProduct(getCurrentProductId)).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
        }
      });
    }
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  console.log(formData, "productList");

  const discountPercentage = productList?.price && productList?.salePrice 
  ? Math.round(((productList.price - productList.salePrice) / productList.price) * 100) 
  : 0;

  return (
    <Fragment>
      <div className="mb-7 w-full flex justify-between">
      <div>
      <h1 className=" ml-2 text-3xl font-bold"> All Products</h1>
      </div>
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((e,i) => (
            <div className='w-70 h-90 relative rounded-xl overflow-hidden bg-white'>
            <div className='w-full h-[50%] bg-[#e0e5e9]'>
                <img className='w-full h-full z-[0]' src={e.image} alt="" />
            </div>
            <div className='text-black  h-[50%] flex flex-col gap-1  px-5 py-2'>
                <h2 className='text-s font-semibold '>{e.title}</h2>
                <h2 className='text-xs w-full h-8 overflow-hidden'>{e.description}</h2>
                <div className='flex justify-between items-center px-3'>
                <h2 className='text-md line-through w-9 overflow-hidden mt-2'>{e.price}</h2>
                <span className="-ml-[4vw] mt-2 text-sm text-red-500">
                  ({discountPercentage}% off)
                </span>
                <h2 className='text-lg mt-2 ml-2 w-[4vw] font-semibold'><span className="flex items-center"><BiRupee /> {e.salePrice}</span></h2>
                </div>
                <div>
                <button
                 onClick={()=>{
                  setOpenCreateProductsDialog(true);
                  setCurrentEditedId(e._id);
                  setFormData(e);
                 }}
                className='w-[48%] mt-3 p-2 rounded-full text-[#D4E8F5] bg-[#000] hover:bg-black/85 cursor-pointer'>Edit</button>
                <button 
                onClick={handleDelete}
                className='w-[48%] ml-2 mt-3 p-2 rounded-full text-[#D4E8F5] bg-[#000] hover:bg-black/85 cursor-pointer'>Delete</button>
                </div>
            </div>
        </div>

            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
