"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import ApiResponse from "@/types/ApiResponse";

const formSchema = z.object({
	oldPassword: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" })
		.max(16, { message: "Password must be at most 16 characters" }),
	newPassword: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" })
		.max(16, { message: "Password must be at most 16 characters" }),
});

const ChangePassword = ({ params }: { params: { id: string } }) => {
	const { id } = params;
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			oldPassword: "",
			newPassword: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		setIsLoading(true);
		try {
			const res = await axios.patch(`/api/add-password/${id}`, values);
			toast({
				title: "Password updated successfully.",
				description:
					"You can now access your link with the new password.",
				duration: 3000,
			});

			router.push(`/link/${res.data.data}`);
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse<string>>;
			const errorMessage = axiosError.response?.data.message;

			toast({
				title: "Update password failed.",
				description:
					errorMessage ??
					"An error occurred while updating password.",
				duration: 3000,
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-2xl font-bold">#update_password: {id}</h1>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="flex flex-col gap-2 mt-4 border border-border p-4 rounded-md w-fit min-w-[300px]">
						<FormField
							control={form.control}
							name="oldPassword"
							render={({ field }) => (
								<FormItem>
									<div className="flex gap-2 items-center">
										<FormControl>
											<Input
												{...field}
												placeholder="Your current password"
												type="password"
											/>
										</FormControl>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem>
									<div className="flex gap-2 items-center">
										<FormControl>
											<Input
												{...field}
												placeholder="Your new password"
												type="password"
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
								"Update Password"
							)}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default ChangePassword;
