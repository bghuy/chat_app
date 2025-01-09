"use client"
import {FileIcon, X} from "lucide-react"
import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";
// import "@uploadthing/react/styles.css"
import { useState } from "react";
interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: "serverImage" | "messageFile"
}
export const FileUpload = ({
    onChange,
    value,
    endpoint
}: FileUploadProps) =>{
    const [error,setError] = useState(false);
    const fileType = value?.split(".").pop();
    if(value && fileType !== "pdf" && !error){
        return(
            <div className="relative h-20 w-20">
                <Image
                    fill
                    src={value}
                    alt="Upload"
                    className="rounded-full"
                    onError={()=>{setError(true)}}
                />
                <button
                    onClick={()=>{onChange("")}}
                    className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                    type="button"
                >
                    <X className="h-4 w-4"/>
                </button>
            </div>
        )
    }

    if(value && error){
        return(
            <div className="relative py-1 px-3">
                <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                    <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                    <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                        style={{ wordBreak: "break-all", whiteSpace: "normal" }}
                    >
                        <span className="w-full break-words">{value}</span>
                    </a>
                    
                </div>
                <button
                        onClick={() => {
                            onChange("");
                        }}
                        className="bg-rose-500 text-white p-1 rounded-full absolute -top-0 right-0 shadow-sm z-10"
                        type="button"
                    >
                        <X className="h-4 w-4" />
                    </button>
            </div>

        )
    }

    return(
        <UploadDropzone 
            endpoint={endpoint}
            onClientUploadComplete={(res)=>{
                onChange(res?.[0].url);
            }}
            onUploadError={(error: Error)=>{
                console.log(error)
            }}
        />
    )
}