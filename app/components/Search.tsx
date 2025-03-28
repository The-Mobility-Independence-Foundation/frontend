"use client";

import { Input } from "@/components/ui/input"
import { FormProvider, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import backendService from "../services/backend.service";
import ListingFilters from "./filters/ListingFilters";
import { useSearchParams } from "next/navigation";
import { PaginationSearchParams } from "./Pagination";
import InventoryItemFilters from "./filters/InventoryItemFilters";
import { FilterComponentType } from "../types/FilterTypes";
import { toast } from "sonner"

interface SearchProps {
  apiRoute: string;
  searchBy: string;
  receiveResponse: (response: object) => void;
  filterType?: FilterComponentType;
  placeholderText?: string;
  newButtonText?: string;
  defaultQuery?: string;
  newButtonEvent?: (clicked: boolean) => void;
  loadingResponse?: (loading: boolean) => void;
}

const formSchema = z.object({
  query: z.string()
})

const Search = forwardRef(({apiRoute, searchBy, receiveResponse, filterType, placeholderText, newButtonText, defaultQuery, newButtonEvent, loadingResponse}: SearchProps, ref) => {  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedValues, setSelectedValues] = useState(new Map());
  const [showFilter, setShowFilter] = useState(false);

  const queryParams = useSearchParams();
  const offset = queryParams.get(PaginationSearchParams.OFFSET);
  const limit = queryParams.get(PaginationSearchParams.LIMIT);

  // TODO: grab brands & types from DB
  // TODO: grab filters from URL?

  const backendSearch = useCallback(() => {
    // TODO: rework filters
    const filtersAsString = Array.from(selectedValues).map(([key, value]) => `${key}:${value}`).join("&");
    const filters = [`query="${searchQuery}`, `filters=${filtersAsString}`];
    loading(true);
    backendService.get(`${apiRoute}?${searchBy}=${searchQuery}`, filters)
      .then(response => {
        if(response.message) {
          toast(response.message, {
            action: {
              label: "Close",
              onClick: () => {},
            }
          });
          loading(false);
          if(!response.success) {
            return;
          }
        }
        receiveResponse(response);
        loading(false)
      });
  }, [apiRoute]);
    
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: defaultQuery || "",
    }
  });

  const handleNewButtonClick = () => {
    if(newButtonEvent) {
      newButtonEvent(true);
    }
  }

  const onFilterValueChange = (values: Map<string, string>) => {
    setSelectedValues(values);
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => setSearchQuery(values.query);
  useEffect(() => backendSearch(), [searchQuery, selectedValues, offset, limit, backendSearch]);

  const loading = (loading: boolean) => {
    if(loadingResponse) {
      loadingResponse(loading);
    }
  }

  useImperativeHandle(ref, () => ({
    executeSearch: () => {
      backendSearch();
    }
  }))

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
                <svg 
                  className="absolute right-[0.5rem] !mt-[0rem] cursor-pointer" 
                  width="27" 
                  height="27" 
                  viewBox="0 0 15 15" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={backendSearch}
                >
                  <path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              </FormItem>
            )}
          >
          </FormField>
        </form>
      </FormProvider>
      {filterType &&
        <button className="button bg-[#D3E8FF] text-black" onClick={() => setShowFilter(!showFilter)}>
          Filter
        </button>
      }
    </div>

    {filterType &&
      <div className={`absolute z-50 ${showFilter ? "opacity-100" : "opacity-0 pointer-events-none"} transition-all duration-200 ease-in-out w-screen`}>
        {filterType == FilterComponentType.LISTINGS && 
          <ListingFilters onFilterValueChange={onFilterValueChange}/>
        }
        {filterType == FilterComponentType.INVENTORY_ITEMS && 
          <InventoryItemFilters onFilterValueChange={onFilterValueChange}/>
        }
        <div className="w-full h-screen bg-black/20" onClick={() => setShowFilter(false)} />
      </div>
    }
  </div>
});

export default Search;