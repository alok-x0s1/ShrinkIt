"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ApiResponse from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LinkType } from "@/models/linkModel";

const formSchema = z.object({
	expirationDate: z.string(),
	clickLimit: z.coerce
		.number()
		.min(1, { message: "Click limit must be at least 1" }),
	isActive: z.boolean().default(true),
});

const Edit = () => {
	const path = usePathname();
	const id = path.split("/")[2];
	const { toast } = useToast();
	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [linkData, setLinkData] = useState<LinkType>();

	useEffect(() => {
		setLoading(true);
		const fetchLinkData = async () => {
			try {
				const response = await axios.get(`/api/link/${id}`);
				setLinkData(response.data.data);
			} catch (error) {
				const axiosError = error as AxiosError<ApiResponse<string>>;
				const errorMessage = axiosError.response?.data.message;

				toast({
					title: "Fetch link failed.",
					description:
						errorMessage ??
						"An error occurred while fetching link.",
					duration: 3000,
				});

				if (errorMessage === "You are not signed in.") {
					router.push("/sign-in");
				}
			} finally {
				setLoading(false);
			}
		};
		fetchLinkData();
	}, [id]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			expirationDate: linkData?.expirationDate?.toString() ?? "",
			clickLimit: linkData?.clickLimit,
			isActive: linkData?.isActive,
		},
	});

	useEffect(() => {
		if (linkData) {
			form.reset({
				expirationDate: linkData.expirationDate
					? new Date(linkData.expirationDate)
							.toISOString()
							.slice(0, 16)
					: "",
				clickLimit: linkData.clickLimit,
				isActive: linkData.isActive,
			});
		}
	}, [linkData, form]);

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		if (linkData) {
			const selectedDate = new Date(data.expirationDate);
			const dbDate = new Date(linkData.expirationDate);
			if (selectedDate < dbDate) {
				toast({
					title: "Invalid Date",
					description:
						"The selected expiration date must be greater than or equal to the existing expiration date.",
					duration: 3000,
					variant: "destructive",
				});
				return;
			}
			if (data.clickLimit < linkData.clickLimit) {
				toast({
					title: "Invalid Click Limit",
					description:
						"Click limit must be greater than or equal to the existing limit.",
					duration: 3000,
					variant: "destructive",
				});
				return;
			}

			setIsSubmitting(true);
			try {
				const response = await axios.patch(`/api/link/${id}`, data);
				toast({
					title: "Link updated successfully",
					description: "The link has been updated successfully.",
					duration: 3000,
				});

				router.back();
			} catch (error) {
				const axiosError = error as AxiosError<ApiResponse<string>>;
				const errorMessage = axiosError.response?.data.message;

				toast({
					title: "Update link failed.",
					description:
						errorMessage ??
						"An error occurred while updating the link.",
					duration: 3000,
					variant: "destructive",
				});
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	if (loading)
		return (
			<div className="flex justify-center items-start pt-32 min-h-screen">
				<h1 className="text-2xl font-bold flex items-center gap-2">
					<Loader2 className="animate-spin" /> Loading...
				</h1>
			</div>
		);

	return (
		<div className="flex flex-col items-center justify-start gap-12 min-h-screen pt-32">
			<h1 className="text-xl font-bold">#edit_link: {id}</h1>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className="relative flex gap-4 flex-wrap flex-col items-start border border-border p-4 pt-8 rounded-sm">
						<div className="absolute -top-4 left-8 px-4 py-1 bg-background border border-border rounded-sm">
							Update the link details
						</div>
						<FormField
							control={form.control}
							name="expirationDate"
							render={({ field }) => (
								<FormItem className="flex items-center gap-2">
									<FormLabel className="w-fit">
										Expiration Date
									</FormLabel>
									<FormControl>
										<Input
											type="datetime-local"
											{...field}
											className="w-fit"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex gap-4 flex-wrap flex-col items-start">
							<FormField
								control={form.control}
								name="clickLimit"
								render={({ field }) => (
									<FormItem className="flex items-center justify-center gap-2 w-fit">
										<FormLabel className="w-fit text-nowrap">
											Click Limit
										</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												className="w-full"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="isActive"
								render={({ field }) => (
									<FormItem className="flex items-center justify-center gap-2 w-fit">
										<FormLabel className="w-fit">
											Active
										</FormLabel>
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
												className="w-6 h-6"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<Button className="mt-4" type="submit">
							{isSubmitting ? (
								<Loader2 className="animate-spin" />
							) : (
								"Update"
							)}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default Edit;
