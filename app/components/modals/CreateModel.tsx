import { z } from "zod";
import ModalBody from "./ModalBody";
import ModalHeader from "./ModalHeader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Manufacturers, ManufacturerData } from "@/app/models/Manufacturer";
import { ModelTypeData, ModelTypes } from "@/app/models/Model";
import backendService from "@/app/services/backend.service";
import { toastErrors } from "@/app/models/Generic";

interface CreateModelModalProps {
  onClose: () => void;
}

export default function CreateModelModal({onClose}: CreateModelModalProps) {
  const [manufacturers, setManufacturers] = useState<ManufacturerData[]>([]);
  const [modelTypes, setModelTypes] = useState<ModelTypeData[]>([]);

  const createModelFormSchema = z.object({
    name: z.string({
      required_error: "Name is required"
    }),
    year: z.number({
      required_error: "Year is required"
    }).min(1900).max(new Date().getFullYear()),
    manufacturer: z.string(),
    modelType: z.string()
  });
  const createModelForm = useForm<z.infer<typeof createModelFormSchema>>({
    resolver: zodResolver(createModelFormSchema),
    defaultValues: {
      name: "",
      year: 1900,
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
  })
  
  return <>
    <ModalHeader title="Create New Part" onClose={onClose}/>
    <ModalBody>
      <>
        Create Model Modal!
      </>
    </ModalBody>
  </>
}