import { useCallback,useEffect,useState } from "react";

export const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const getData= useCallback(async () => {
        setLoading(true)
        try {
            const response=await fetch(url);
            if(!response.ok){
                throw new Error("error fetching data")
            }
            const data=await response.json()
            setData(data)
            console.log(data);
        } catch (error) {
         setError(error.messaege)   
        } finally{
            setLoading(false)
        }
    },[url])
    useEffect(()=>{
        getData();
    },[getData])
    return {data,loading,error}
}