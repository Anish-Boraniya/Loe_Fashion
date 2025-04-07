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
  size: [],
  material:"",
  pattern:"",
  fit:"",
  country:"",
  color:"",
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

  const [category,setCategory] = useState("")

  const sizeOptionMap = {

    clothing: [ 
      { id: "s", label: "S" },
      { id: "m", label: "M" },
      { id: "l", label: "L" },
      { id: "XL", label: "XL" },
      { id: "2XL", label: "2XL" },
      { id: "3XL", label: "3XL" },
    ],
    footwear: [
      { id: "6", label: "6" },
      { id: "7", label: "7" },
      { id: "8", label: "8" },
      { id: "9", label: "9" },
      { id: "10", label: "10" },
    ],
    
  }

  const aaddProductFormElements = [
    {
      label: "image",
      name: "image",
      componentType: "input",
      type: "text",
      placeholder: "Enter product url",
    },{
      label: "Title",
      name: "title",
      componentType: "input",
      type: "text",
      placeholder: "Enter product title",
    },
    {
      label: "Description",
      name: "description",
      componentType: "textarea",
      placeholder: "Enter product description",
    },
    {
      label: "Category",
      name: "category",
      componentType: "select",
      options: [
        { id: "men", label: "Men" },
        { id: "women", label: "Women" },
        { id: "kids", label: "Kids" },
        { id: "accessories", label: "Accessories" },
        { id: "footwear", label: "Footwear" },
        { id: "toys", label: "Toys" },
        {id: "other", label: "other" },
      ],
    },
    {
      label: "Brand",
      name: "brand",
      componentType: "select",
      options: [
        { id: "nike", label: "Nike" },
        { id: "adidas", label: "Adidas" },
        { id: "puma", label: "Puma" },
        { id: "levi", label: "Levi's" },
        { id: "zara", label: "Zara" },
        { id: "h&m", label: "H&M" },
        { id: "other", label: "Other" },
      ],
    },
    {
      label: "Size",
      name: "size",
      componentType: "select",
      options: sizeOptionMap[category] ,
    },
    {
      label: "Price",
      name: "price",
      componentType: "input",
      type: "number",
      placeholder: "Enter product price",
    },
    {
      label: "Sale Price",
      name: "salePrice",
      componentType: "input",
      type: "number",
      placeholder: "Enter sale price (optional)",
    },
    {
      label: "Total Stock",
      name: "totalStock",
      componentType: "input",
      type: "number",
      placeholder: "Enter total stock",
    },
  ];

  function onSubmit(event) {
    event.preventDefault();

    const clothing = [
      { id: "s", label: "S" },
      { id: "m", label: "M" },
      { id: "l", label: "L" },
      { id: "xl", label: "XL" },
      { id: "xxl", label: "XXL" },
    ];
    
    const footwear = [
      { id: "6", label: "6" },
      { id: "7", label: "7" },
      { id: "8", label: "8" },
      { id: "9", label: "9" },
      { id: "10", label: "10" },
      { id: "11", label: "11" },
    ];

    if(formData.category === "men" || formData.category === "women" || formData.category === "kids"){
      setFormData({...formData, size : clothing});
    }else if(formData.category === "footwear"){
      setFormData({...formData, size : footwear});
    }


    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          console.log(data, "edit");

        try{
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
            localStorage.removeItem('category')
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
            localStorage.removeItem('category')
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
     localStorage.removeItem('category')
     const local = localStorage.getItem('category')
     if(local){
       setCategory(local)
       console.log("localstorege ", local)
     }
     console.log("all products",productList)
  }, [setFormData]);

  console.log(formData, "productList");

  
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
                  ({ Math.round(((e.price - e.salePrice) / e.price) * 100)}% off)
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
                onClick={()=>handleDelete(e._id)}
                className='w-[48%] ml-2 mt-3 p-2 rounded-full text-[#D4E8F5] bg-[#000] hover:bg-black/85 cursor-pointer'>Delete</button>
                </div>
            </div>
        </div>

            ))
          : <h1>Product Not Found !</h1>}
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
