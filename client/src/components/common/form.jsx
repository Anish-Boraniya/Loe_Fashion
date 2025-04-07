import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
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
  const accessories = []; // Empty, which is fine
  


  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );

        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) =>{
              setFormData({
                ...formData,
                [getControlItem.name]: value,

              })
              if(value === "men" || value === "women" || value === "kids"){
                  localStorage.setItem("category","clothing")
                  setFormData({...formData, size: clothing })
                  setFormData({
                    ...formData,
                    [getControlItem.name]: value,
    
                  })
              }
              if(value === "footwear"){
                localStorage.setItem("category","footwear")
                setFormData({...formData, size: footwear })
                setFormData({
                  ...formData,
                  [getControlItem.name]: value,
  
                })
              }
              if(value === "accessories"){
                localStorage.setItem("category","accessories")
                setFormData({...formData, [getControlItem.size]: accessories})
                setFormData({
                  ...formData,
                  [getControlItem.name]: value,
  
                })
              }

            }
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );

        break;
      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );

        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  }

  const [category,setCategory] = useState("")
  
    const sizeOptionMap = {
  
      
      accessories: [],
      
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

  useEffect(()=>{
     const cat = localStorage.getItem("category")
      console.log("storege,", localStorage.getItem("category"));
      setCategory(cat);
   // localStorage.removeItem("category")
  },[setFormData,formData,setCategory])

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
