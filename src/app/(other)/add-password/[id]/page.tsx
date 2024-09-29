"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ApiResponse from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" })
		.max(16, { message: "Password must be at most 16 characters" }),
});

const page = ({ params }: { params: { id: string } }) => {
	const { id } = params;
	const router = useRouter();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			password: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		try {
			const res = await axios.post(`/api/add-password/${id}`, values);
			toast({
				title: "Password added successfully.",
				description: "You can now access your link with the password.",
				duration: 3000,
			});

			router.push(`/link/${res.data.data}`);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse<string>>;
			let errorMessage = axiosError.response?.data.message;

			toast({
				title: "Add password failed.",
				description:
					errorMessage ?? "An error occurred while adding password.",
				duration: 3000,
				variant: "destructive",
			});
			if (errorMessage === "You are not signed in.") {
				router.push("/sign-in");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-2xl font-bold">#add_password: {id}</h1>
			<p className="text-sm text-foreground/70 mt-2">
				Add a password to secure your link.
			</p>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex flex-col gap-2 mt-4 border border-border p-4 rounded-md">
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<div className="flex gap-2 items-center">
										<FormLabel className="font-medium">
											Password
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Enter your password."
											/>
										</FormControl>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="mt-4 w-fit">
							{isLoading ? (
								<Loader2 className="animate-spin" />
							) : (
								"Add Password"
							)}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default page;
