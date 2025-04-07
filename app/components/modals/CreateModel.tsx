import { z } from "zod";
import ModalBody from "./ModalBody";
import ModalHeader from "./ModalHeader";
import { FormProvider, Noop, RefCallBack, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Manufacturers, ManufacturerData, ManufacturerPost } from "@/app/models/Manufacturer";
import { ModelData, ModelsPost, ModelTypeData, ModelTypePost, ModelTypes } from "@/app/models/Model";
import backendService from "@/app/services/backend.service";
import { toastErrors } from "@/app/models/Generic";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

interface CreateModelModalProps {
  onClose: (model: ModelData | null) => void;
}

export default function CreateModelModal({onClose}: CreateModelModalProps) {
  const [manufacturers, setManufacturers] = useState<ManufacturerData[]>([]);
  const [modelTypes, setModelTypes] = useState<ModelTypeData[]>([]);
  const [loading, setLoading] = useState(false);

  const createModelFormSchema = z.object({
    name: z.string({
      required_error: "Name is required"
    }),
    year: z.coerce.number({
      required_error: "Year is required"
    }).int().min(1900).max(new Date().getFullYear()),
    manufacturer: z.string(),
    modelType: z.string()
  });
  const createModelForm = useForm<z.infer<typeof createModelFormSchema>>({
    resolver: zodResolver(createModelFormSchema),
    defaultValues: {
      name: "",
      year: undefined,
      manufacturer: "",
      modelType: ""
    }
  });

  useEffect(() => {
    backendService.get(`/manufacturers?limit=100`).then((response) => {
      const responseAsManufacturers = response as Manufacturers;
      if(!responseAsManufacturers.success) {
        toastErrors(response);
        return;
      }
      setManufacturers(responseAsManufacturers.data.results);
    });

    backendService.get(`/model-types?limit=100`).then((response) => {
      const responseAsModelTypes = response as ModelTypes;
      if(!responseAsModelTypes.success) {
        toastErrors(response);
        return;
      }
      setModelTypes(responseAsModelTypes.data.results);
    })
  }, [])

  const submitForm = async (values: z.infer<typeof createModelFormSchema>) => {
    setLoading(true);
    let manufacturerID = parseInt(values.manufacturer);
    if(values.manufacturer.length > 0 && isNaN(manufacturerID)) { // create new manufacturer
      const response = await backendService.post(`/manufacturers`, {name: values.manufacturer});
      const responseAsManufacturers = response as ManufacturerPost;
      if(!responseAsManufacturers.success) {
        toastErrors(response);
        setLoading(false);
        return;
      }
      manufacturerID = responseAsManufacturers.data.id;
    }

    const modelTypeID = parseInt(values.modelType);
    if(values.modelType.length > 0 && isNaN(modelTypeID)) { // create new model type
      const response = await backendService.post(`/model-types`, {name: values.modelType});
      const responseAsModelTypes = response as ModelTypePost;
      if(!responseAsModelTypes.success) {
        toastErrors(response);
        setLoading(false);
        return;
      }
      manufacturerID = responseAsModelTypes.data.id;
    }

    const body = {
      manufacturerId: manufacturerID,
      name: values.name,
      year: values.year,
      modelTypeIds: [
        modelTypeID
      ]
    };
    backendService.post(`/models`, body).then((response) => {
      const responseAsModels = response as ModelsPost;
      setLoading(false);
      if(responseAsModels.success) {
        toast(responseAsModels.message);
        onClose(responseAsModels.data);
      } else {
        toastErrors(response);
      }
    })
  }

  const onManufacturerChange = (
    value: string,
    field: {
      onChange: (value: string) => void;
      onBlur?: Noop;
      value?: string;
      disabled?: boolean | undefined;
      name?: "manufacturer";
      ref?: RefCallBack;
    }
  ) => {
    field.onChange(value);
  };

  const onModelTypeChange = (
    value: string,
    field: {
      onChange: (value: string) => void;
      onBlur?: Noop;
      value?: string;
      disabled?: boolean | undefined;
      name?: "modelType";
      ref?: RefCallBack;
    }
  ) => {
    field.onChange(value);
  };
  
  return <>
    <ModalHeader title="Create New Model" onClose={() => onClose(null)}/>
    <ModalBody>
      <FormProvider {...createModelForm}>
        <form onSubmit={createModelForm.handleSubmit(submitForm)}>
          <div className="flex justify-between mb-[0.75rem]">
            <FormField 
              control={createModelForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-[48%]">
                  <FormControl>
                    <Input 
                      {...field}
                      type="string"
                      required={true}
                      placeholder="Name"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField 
              control={createModelForm.control}
              name="year"
              render={({ field }) => (
                <FormItem className="w-[48%]">
                  <FormControl>
                    <Input 
                      {...field}
                      type="number"
                      required={true}
                      placeholder="Year"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
              control={createModelForm.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-baseline mb-[0.75rem]">
                    <Select
                      onValueChange={(value) => onManufacturerChange(value, field)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Manufacturer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Manufacturer</SelectLabel>
                          {manufacturers.map((item) => (
                            <SelectItem
                              key={item.id}
                              value={item.id.toString()}
                            >
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <span className="mx-[0.5rem]">OR</span>
                    <Input 
                      type="string"
                      placeholder="New Manufacturer"
                      onChange={field.onChange}
                    />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={createModelForm.control}
              name="modelType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-baseline mb-[1.75rem]">
                    <Select
                      onValueChange={(value) => onModelTypeChange(value, field)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Model Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Model Type</SelectLabel>
                          {modelTypes.map((item) => (
                            <SelectItem
                              key={item.id}
                              value={item.id.toString()}
                            >
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <span className="mx-[0.5rem]">OR</span>
                    <Input 
                      type="string"
                      placeholder="New Model Type"
                      onChange={field.onChange}
                    />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex">
              <button onClick={() => onClose(null)} className="button ml-auto !bg-[#BBBBBB]">Cancel</button>
              <button type="submit" className="button ml-[1rem] h-[2.75rem] w-[10rem]" disabled={loading}>
                  {loading ? <Spinner className="text-white" /> : "Create Model"}
              </button>
            </div>
        </form>
      </FormProvider>
    </ModalBody>
  </>
}