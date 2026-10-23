import { useSupabase } from "./useSupabase";
import { useAuth } from "@clerk/clerk-expo";
import { useEffect,useState } from "react";

const useSavedProperty = (propertyId:string,onUnsave?:()=>void) => {
  const [isSaved,setIsSaved]=useState(false)
  const [saveLoading, setSaveLoading]=useState(false)
  const authSupabase = useSupabase()
  const {userId}=useAuth()

  useEffect(()=>{checkIfSaved()},[propertyId,userId])
  
  const checkIfSaved= async () => {
    try {
        if(!userId) return
        const {data,error}=await authSupabase.from("saved_properties").select('id').eq('property_id',propertyId)
        .eq('user_clerk_id',userId).single()
        setIsSaved(!!data)
        console.log("Error in checkIfSaved Try :",error?.message)
    } catch (error) {
        console.log("Error catched checkIfSaved:",error)
    }
  }

  const toggleSave= async ()=>{
    try {
        if(!userId||saveLoading) return
        setSaveLoading(true)
        if(isSaved){
            await authSupabase.from("saved_properties").delete()
            .eq('user_clerk_id',userId)
            .eq('property_id',propertyId)
            setIsSaved(false)
            setSaveLoading(false)
            onUnsave?.()
        }
        else{
            await authSupabase.from("saved_properties").insert({"user_clerk_id":userId,"property_id":propertyId})
            setIsSaved(true)
            setSaveLoading(false)
        }
    } catch (error) {
        console.log("Error catched from toggleSave:",error)
    }
  }

  return{saveLoading,isSaved,toggleSave}
}

export default useSavedProperty