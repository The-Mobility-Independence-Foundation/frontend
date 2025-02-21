"use client";

import { Input } from "@/components/ui/input"
import { FormProvider, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import backendService from "../services/backend.service";
import Filters, { FilterOptions } from "./Filters";

interface SearchProps {
  apiRoute: string;
  receiveData: (data: any[]) => void;
  filterOptions?: FilterOptions;
  placeholderText?: string;
  newButtonText?: string;
  defaultQuery?: string;
  newButtonEvent?: (clicked: boolean) => void;
}

const formSchema = z.object({
  query: z.string()
})

export default function Search({apiRoute, receiveData, placeholderText, newButtonText, newButtonEvent, filterOptions, defaultQuery}: SearchProps) {  
  const [searchQuery, setSearchQuery] = useState("");
  const [partTypes, setPartTypes] = useState(["type1", "type2"]);
  const [brands, setBrands] = useState(["brand1", "brand2"]);
  const [selectedValues, setSelectedValues] = useState(new Map());
  const [showFilter, setShowFilter] = useState(false);

  // TODO: grab brands & types from DB

  const onWidthChange = (newValue: string) => {

  }

  const onHeightChange = (newValue: string) => {

  }

  // const listingFilterOptions: FilterOptions = {
  //   multiSelects: [{
  //     title: "Part Type",
  //     filterType: FilterType.PartType,
  //     options: ["Type 1", "Type 2", "Type 3", "Type 4"]
  //   }, {
  //     title: "Brand",
  //     filterType: FilterType.Brand,
  //     options: ["Brand 1", "Brand 2", "Brand 3", "Brand 4"]
  //   }],
  //   multiInputs: [{
  //     title: "Dimensions",
  //     inputs: [{
  //       placeholder: "Width (in.)",
  //       type: "number",
  //       minValue: "0",
  //       maxValue: "120"
  //     }, {
  //       placeholder: "Height (in.)",
  //       type: "number",
  //       minValue: "0",
  //       maxValue: "120"
  //     }]
  //   }]
  // }

  const onFilterValueChange = (field: string, newValue: any) => {
    let newSelectedValues = new Map(selectedValues);
    if(newValue == null || newValue == "") {
      newSelectedValues.delete(field);
    } else {
      newSelectedValues.set(field, newValue);
    }
    setSelectedValues(newSelectedValues);
  }

  const backendSearch = () => {
    const filtersAsString = Array.from(selectedValues).map(([key, value]) => `${key}:${value}`).join("&");
    const filters = [`query="${searchQuery}`, `filters=${filtersAsString}`];
    backendService.get(apiRoute, filters)
      .then(response => {
        receiveData(response);
      });
  }
    
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

  const onSubmit = (values: z.infer<typeof formSchema>) => setSearchQuery(values.query);
  useEffect(() => backendSearch(), [searchQuery, selectedValues]);

  return <div className="relative">
    <div 
      className="w-full py-[1rem] px-[2%] flex place-content-around items-center bg-[#D1D5DB]"
    >
      {newButtonEvent ? 
        <button onClick={handleNewButtonClick} className="button bg-[#D3E8FF] text-black">
          + {newButtonText || "New"}
          </button>
      : ""}
      <FormProvider {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-[44rem] w-[50%] h-full"
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
                <svg className="absolute right-[0.5rem] !mt-[0rem]" width="27" height="27" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              </FormItem>
            )}
          >
          </FormField>
        </form>
      </FormProvider>
      {filterOptions &&
        <button className="button bg-[#D3E8FF] text-black" onClick={() => setShowFilter(!showFilter)}>
          Filter
        </button>
      }
    </div>

    {filterOptions &&
      <div className={`absolute ${showFilter ? "opacity-100" : "opacity-0 pointer-events-none"} transition-all duration-200 ease-in-out`}>
        <Filters 
          options={filterOptions}
          selectedValues={selectedValues} 
          onValueChange={onFilterValueChange} 
        />
        <div className="w-full h-screen bg-black/20" />
      </div>
    }
  </div>
}