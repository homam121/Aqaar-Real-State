import { create } from "zustand";

interface useFilterStoreTypes{
    search:string;
    type:string|null;
    bedrooms:number|null;
    minPrice:number|null;
    maxPrice:number|null;

    setSearch:(value:string)=>void;
    setType:(value:string|null)=>void;
    setBedrooms:(value:number|null)=>void;
    setMinPrice:(value:number|null)=>void;
    setMaxPrice:(value:number|null)=>void;
    resetFilters:()=>void
}

const useFilterStore = create<useFilterStoreTypes>((set)=>({
    search:"",
    type:null,
    bedrooms:null,
    maxPrice:null,
    minPrice:null,

    setSearch:(value)=>set({search:value}),
    setType:(value)=>set({type:value}),
    setBedrooms:(value)=>set({bedrooms:value}),
    setMinPrice:(value)=>set({minPrice:value}),
    setMaxPrice:(value)=>set({maxPrice:value}),
    resetFilters:()=>set({search:"",type:null,bedrooms:null,minPrice:null,maxPrice:null})
}))

export default useFilterStore;