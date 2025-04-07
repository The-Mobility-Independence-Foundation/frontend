"use client";

import {
  ControllerRenderProps,
  FormProvider,
  Noop,
  RefCallBack,
  useForm,
} from "react-hook-form";
import ModalBody from "./ModalBody";
import ModalHeader from "./ModalHeader";
import { z } from "zod";
import { useState, useEffect, useCallback } from "react";
import { ModelData, Models } from "@/app/models/Model";
import backendService from "@/app/services/backend.service";
import Modal from "./Modal";
import CreateModelModal from "./CreateModel";
import { toast } from "sonner";
import { PartData, PartPost, PartTypeData, PartTypePost, PartTypes } from "@/app/models/Part";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { toastErrors } from "@/app/models/Generic";

interface CreatePartModalProps {
  onClose: (part: PartData | null) => void;
}

export default function CreatePartModal({ onClose }: CreatePartModalProps) {
  const [models, setModels] = useState<ModelData[]>([]);
  const [createModelModalIsOpen, setCreateModelModalIsOpen] = useState(false);
  const [partTypes, setPartTypes] = useState<PartTypeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingModel, setPendingModel] = useState<string | null>();

  const createPartFormSchema = z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    description: z.string(),
    partNumber: z.string({
      required_error: "Part number is required",
    }),
    partType: z.string(),
    modelID: z.string({
      required_error: "Model is required",
    }),
  });
  const createPartForm = useForm<z.infer<typeof createPartFormSchema>>({
    resolver: zodResolver(createPartFormSchema),
    defaultValues: {
      name: "",
      description: "",
      partNumber: "",
      partType: "",
      modelID: ""
    }
  });

  useEffect(() => {
    backendService.get(`/part-types?limit=100`).then((response) => {
      const responseAsPartTypes = response as PartTypes;
      if (!responseAsPartTypes.success) {
        toastErrors(response)
        return;
      }
      setPartTypes(responseAsPartTypes.data.results);
    });
  }, [])

  const getModels = useCallback(() => {
    backendService.get(`/models?limit=100`).then((response) => {
      const responseAsModels = response as Models;
      if (!responseAsModels.success) {
        toastErrors(response)
        return;
      }
      setModels(responseAsModels.data.results);
    });
  }, [])

  const submitForm = async (values: z.infer<typeof createPartFormSchema>) => {
    setLoading(true);
    let partTypeID = parseInt(values.partType);
    if(values.partType.length > 0 && isNaN(partTypeID)) { // create new part type if doesnt exist
      const response = await backendService.post(`/part-types`, {name: values.partType});
      const responseAsPartType = response as PartTypePost;
      if(!response.success) {
        toastErrors(response);
        setLoading(false);
        return;
      }
      partTypeID = responseAsPartType.data.id;
    }
    const body = {
      name: values.name,
      description: values.description,
      partNumber: values.partNumber,
      modelId: parseInt(values.modelID),
      partTypeIds: [
        partTypeID
      ]
    }
    
    backendService.post(`/parts`, body)
      .then(response => {
        const responseAsPart = response as PartPost;
        setLoading(false);
        if(responseAsPart.success) {
          toast(responseAsPart.message);
          onClose(responseAsPart.data);
        } else {
          toastErrors(response)
        }
      })
  };

  const onPartTypeChange = (
    value: string,
    field: {
      onChange: any;
      onBlur?: Noop;
      value?: string;
      disabled?: boolean | undefined;
      name?: "partType";
      ref?: RefCallBack;
    }
  ) => {
    field.onChange(value);
  };

  const onModelChange = (
    value: string,
    field: {
      onChange: any;
      onBlur?: Noop;
      value?: string;
      disabled?: boolean | undefined;
      name?: "modelID";
      ref?: RefCallBack;
    }
  ) => {
    field.onChange(value);
  };

  const onCreateModelModalClose = async (model: ModelData | null) => {
    setCreateModelModalIsOpen(false);
    if(model) {
      setPendingModel(model.id.toString());
      getModels();
    }
  }

  useEffect(() => {
    if(pendingModel && models.find(m => m.id.toString() == pendingModel)) {
      createPartForm.setValue("modelID", pendingModel);
      setPendingModel(null);
    }
  }, [pendingModel, models]);

  useEffect(() => {
    getModels();
  }, [])

  return (
    <>
      <ModalHeader title="Create New Part" onClose={() => onClose(null)} />
      <ModalBody>
        <FormProvider {...createPartForm}>
          <form onSubmit={createPartForm.handleSubmit(submitForm)}>
            <FormField
              control={createPartForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="mb-[0.75rem]">
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
              control={createPartForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="mb-[0.75rem]">
                    <Textarea
                      {...field}
                      required={false}
                      placeholder="Description"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={createPartForm.control}
              name="partNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="mb-[0.75rem]">
                    <Input
                      {...field}
                      type="string"
                      required={true}
                      placeholder="Part Number"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={createPartForm.control}
              name="partType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-baseline mb-[0.75rem]">
                    <Select
                      onValueChange={(value) => onPartTypeChange(value, field)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Part Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Part Type</SelectLabel>
                          {partTypes.map((item) => (
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
                      placeholder="New Part Type"
                      onChange={field.onChange}
                    />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={createPartForm.control}
              name="modelID"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={(value) => onModelChange(value, field)}
                      required={true}
                      value={field.value}
                    >
                      <SelectTrigger className="mb-[0.25rem]">
                        <SelectValue placeholder="Model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Model</SelectLabel>
                          {models.map((item) => (
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
                  </FormControl>
                </FormItem>
              )}
            />
            <button className="button text-xs mb-[1.75rem]" onClick={() => setCreateModelModalIsOpen(true)}>Create New Model</button>

            <div className="flex">
              <button onClick={() => onClose(null)} className="button ml-auto !bg-[#BBBBBB]">Cancel</button>
              <button type="submit" className="button ml-[1rem] h-[2.75rem] w-[8rem]" disabled={loading}>
                  {loading ? <Spinner className="text-white" /> : "Create Part"}
              </button>
            </div>
          </form>
        </FormProvider>
      </ModalBody>
      <Modal
        isOpen={createModelModalIsOpen}
        onClose={() => setCreateModelModalIsOpen(false)}
      >
        <CreateModelModal onClose={(model) => onCreateModelModalClose(model)} />
      </Modal>
    </>
  );
}
