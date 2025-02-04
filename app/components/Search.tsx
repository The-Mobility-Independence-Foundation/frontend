"use client";

import { Input } from "@/components/ui/input"
import { FormProvider, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import backendService from "../services/backend.service";
import Filters from "./Filters";

interface Props {
  apiRoute: string;
  receiveData: (data: any[]) => void;
  filter?: boolean;
  placeholderText?: string;
  newButtonText?: string;
  defaultQuery?: string;
  newButtonEvent?: (clicked: boolean) => void;
}

const formSchema = z.object({
  query: z.string()
})

export default function Search({apiRoute, receiveData, placeholderText, newButtonText, newButtonEvent, filter, defaultQuery}: Props) {  
  const [searchQuery, setSearchQuery] = useState("");
  const [partTypes, setPartTypes] = useState(["type1", "type2"]);
  const [brands, setBrands] = useState(["brand1", "brand2"]);
  const [selectedValues, setSelectedValues] = useState(new Map());

  const onFilterValueChange = (field: string, newValue: any) => {
    console.log(field, newValue);
  }

  const [showFilter, setShowFilter] = useState("" as any);
  
  useEffect(() => {
    // TODO: parse filter result into route
    const filters = [`query="${searchQuery}`];
    backendService.get(apiRoute, filters)
      .then(response => {
        receiveData(response);
      });
  }, [searchQuery]);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: defaultQuery || "",
    }
  });

  const handleNewButtonClick = (event: any) => {
    if(newButtonEvent) {
      newButtonEvent(true);
    }
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSearchQuery(values.query);
  }

  const toggleFilter = () => {
    if(filter) {
      if(showFilter == "") {
        setShowFilter(<Filters partTypes={partTypes} brands={brands} selectedValues={selectedValues} onValueChange={onFilterValueChange}></Filters>);
      } else {
        setShowFilter("");
      }
    }
  }

  return <><div 
    className="w-full py-[15px] px-[2%] flex place-content-around items-center"
    style={{backgroundColor: "#D1D5DB"}}
  >
    {newButtonEvent ? 
      <button onClick={handleNewButtonClick} className="bg-[#D3E8FF] text-black">
        + {newButtonText || "New"}
        </button>
    : ""}
    <FormProvider {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-[700px] w-[50%] h-full"
      >
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className="flex relative items-center">
              <FormControl>
                  <Input 
                    {...field}
                    className="bg-white rounded-sm border-black"
                    placeholder={placeholderText || "Search"}
                  />
              </FormControl>
              <svg className="absolute right-[5px] !mt-[0px]" width="27" height="27" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </FormItem>
          )}
        >
        </FormField>
      </form>
    </FormProvider>
    {filter ?
      <button className="bg-[#D3E8FF] text-black" onClick={() => toggleFilter()}>
        Filter
      </button>
    : ""}
  </div>
  {showFilter}
  </>
}