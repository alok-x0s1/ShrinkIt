import React from "react";
import {
	AlertDialog,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogAction,
	AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import ApiResponse from "@/types/ApiResponse";

const DeleteButton = ({ id }: { id: string }) => {
	const router = useRouter();
	const { toast } = useToast();

	const handleDelete = async () => {
		try {
			const response = await axios.delete(`/api/link/${id}`);

			toast({
				title: "Link deleted",
				description: response.data.message,
				duration: 3000,
			});
			router.push("/dashboard");
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse<string>>;
			let errorMessage = axiosError.response?.data.message;

			toast({
				title: "Error",
				description: errorMessage ?? "An error occurred.",
				duration: 3000,
				variant: "destructive",
			});

			if (errorMessage === "You are not signed in.") {
				router.push("/sign-in");
			}
		}
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive">Delete</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you absolutely sure?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently
						delete your account and remove your data from our
						servers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDelete}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteButton;
