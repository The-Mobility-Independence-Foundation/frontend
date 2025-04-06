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
import { useState, useEffect } from "react";
import { ModelData, Models } from "@/app/models/Model";
import backendService from "@/app/services/backend.service";
import Modal from "./Modal";
import CreateModelModal from "./CreateModel";
import { toast } from "sonner";
import { PartData, PartPost, PartTypeData, PartTypes } from "@/app/models/Part";
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

interface CreatePartModalProps {
  onClose: (part: PartData | null) => void;
}

export default function CreatePartModal({ onClose }: CreatePartModalProps) {
  const [models, setModels] = useState<ModelData[]>([]);
  const [createModelModalIsOpen, setCreateModelModalIsOpen] = useState(false);
  const [partTypes, setPartTypes] = useState<PartTypeData[]>([]);
  const [loading, setLoading] = useState(false);

  const createPartFormSchema = z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    description: z.string(),
    partNumber: z.string({
      required_error: "Part number is required",
    }),
    partTypeID: z.string({
      required_error: "Part type is required",
    }),
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
      partTypeID: "",
      modelID: ""
    }
  });

  useEffect(() => {
    backendService.get(`/models?limit=100`).then((response) => {
      const responseAsModels = response as Models;
      if (!responseAsModels.success) {
        toast(responseAsModels.message);
        return;
      }
      setModels(responseAsModels.data.results);
    });
    backendService.get(`/part-types?limit=100`).then((response) => {
      const responseAsPartTypes = response as PartTypes;
      if (!responseAsPartTypes.success) {
        toast(responseAsPartTypes.message);
        return;
      }
      setPartTypes(responseAsPartTypes.data.results);
    });
  }, [])

  const submitForm = (values: z.infer<typeof createPartFormSchema>) => {
    setLoading(true);
    const body = {
      name: values.name,
      description: values.description,
      partNumber: values.partNumber,
      modelId: parseInt(values.modelID),
      partTypeIds: [
        parseInt(values.partTypeID)
      ]
    }
    backendService.post(`/parts`, body)
      .then(response => {
        const responseAsPart = response as PartPost;
        setLoading(false);
        toast(responseAsPart.message);
        if(responseAsPart.success) {
          onClose(responseAsPart.data);
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
      name?: "partTypeID";
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
              name="partTypeID"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={(value) => onPartTypeChange(value, field)}
                      required={true}
                    >
                      <SelectTrigger className="mb-[0.75rem]">
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

            <div>
              <button onClick={() => onClose(null)} className="button !bg-[#BBBBBB]">Cancel</button>
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
        <CreateModelModal onClose={() => setCreateModelModalIsOpen(false)} />
      </Modal>
    </>
  );
}
