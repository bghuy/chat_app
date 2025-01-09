'use client'
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { Button } from "../ui/button"
import { FileUpload } from "../file-upload"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useModal } from "../../../hooks/use-modal-store"
import qs from "query-string"
const formSchema = z.object({
    fileUrl: z.string().min(1,{
        message: "Attachment is required"
    })
})

export const MessageFileModal = () =>{
    const {isOpen,onClose, type, data} = useModal();
    const router = useRouter()
    const isModalOpen = isOpen && type === "MessageFile";
    const {apiUrl, query } = data;
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues:{
            fileUrl: ""
        }
    })

    const handleCloseModal = () => {
        form.reset();
        onClose();
    }
    const isLoading = form.formState.isSubmitting;
    const submitForm = async (values: z.infer<typeof formSchema>) =>{
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query,
            })
            const message = await axios.post(url,{
                ...values,
                content: values.fileUrl
            })
            console.log(message);
            router.refresh();
            handleCloseModal();
        } catch (error) {
            console.log(error)
        }
    }
    return(
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Add an attachment
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Send a file as a message
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(submitForm)}
                        className="space-y-8"
                    >
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField 
                                    control={form.control}
                                    name="fileUrl"
                                    render={({field})=>(
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload 
                                                    endpoint= "messageFile"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )} 
                                />
                            </div>
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button disabled={isLoading} variant="primary">
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}