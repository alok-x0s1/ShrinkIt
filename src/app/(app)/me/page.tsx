"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ApiResponse, { ErrorResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { Loader, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounceCallback } from "usehooks-ts";

interface Profile {
	username: string;
	email: string;
	createdLinks: string[];
}

const formSchema = z.object({
	username: z.string().min(3).max(30),
});

const Profile = () => {
	const [data, setData] = useState<Profile | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	useEffect(() => {
		const fetchProfile = async () => {
			setIsLoading(true);
			try {
				const res = await axios.get("/api/me");
				setData(res.data.data);
			} catch (error) {
				const axiosError = error as AxiosError<ApiResponse<string>>;
				let errorMessage = axiosError.response?.data.message;

				toast({
					title: "Fetch profile failed.",
					description:
						errorMessage ??
						"An error occurred while fetching profile.",
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
		fetchProfile();
	}, []);

	const handleDelete = async () => {
		try {
			const res = await axios.delete("/api/me");
			toast({
				title: "Account deleted",
				description: res.data.message,
				duration: 3000,
			});
			router.push("/");
		} catch (error) {
			const axiosError = error as AxiosError<ApiResponse<string>>;
			let errorMessage = axiosError.response?.data.message;

			toast({
				title: "Account deletion failed",
				description:
					errorMessage ?? "An error occurred while deleting account.",
				duration: 3000,
				variant: "destructive",
			});
		}
	};

	return (
		<motion.div
			className="flex justify-center items-start pt-32 min-h-screen relative"
			initial={{ opacity: 0, y: -100 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 100 }}
			transition={{ duration: 0.5 }}
		>
			<motion.div
				className="w-full max-w-md p-8 space-y-8 rounded-lg relative shadow-sm border shadow-gray-500"
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.3 }}
			>
				<div className="text-center">
					{isLoading ? (
						<div className="flex items-center gap-2 justify-center">
							<Loader2 className="animate-spin" />
							<p className="text-lg font-medium">Loading...</p>
						</div>
					) : (
						<>
							<h1 className="text-4xl font-bold tracking-tight mb-6 text-start">
								Profile
							</h1>
							<div className="flex flex-col gap-2 items-start">
								<p className="text-base font-medium">
									Name : {data?.username}
								</p>
								<p className="text-base font-medium">
									Email : {data?.email}
								</p>
							</div>

							<div className="absolute top-0 right-4">
								<LogOutButton className="mt-4 px-4 py-2" />
							</div>

							<div className="my-2 text-start">
								<p className="text-base font-medium">
									<span
										className="font-bold underline mr-2 cursor-pointer"
										onClick={() =>
											router.push("/dashboard")
										}
									>
										LinksCount
									</span>{" "}
									{data?.createdLinks.length}
								</p>
								<span className="text-xs text-foreground/80">
									*click on LinksCount to go to Dashboard.
								</span>
							</div>

							<div className="flex justify-start items-center gap-2">
								<EditProfileButton
									className="mt-4 px-4 py-2"
									name={data?.username}
								/>
								<DeleteButton
									handleDelete={handleDelete}
									className="mt-4 px-4 py-2"
								/>
							</div>
						</>
					)}
				</div>
			</motion.div>
		</motion.div>
	);
};

export default Profile;

const DeleteButton = ({
	handleDelete,
	className,
}: {
	handleDelete: () => void;
	className: string;
}) => {
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive" className={className}>
					Delete
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Are you sure you want to delete your account?
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

const EditProfileButton = ({
	className,
	name,
}: {
	className: string;
	name: string | undefined;
}) => {
	const [username, setUsername] = useState<string>("");
	const [usernameMessage, setUsernameMessage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const debounced = useDebounceCallback(setUsername, 500);
	const { toast } = useToast();

	useEffect(() => {
		const validateUsername = async () => {
			if (username) {
				setIsLoading(true);
				setUsernameMessage(null);
				try {
					const res = await axios.get(
						`/api/check-username?username=${username}`
					);

					setUsernameMessage(res.data.message);
				} catch (error) {
					const axiosError = error as AxiosError<ErrorResponse>;
					let errorMessage = axiosError.response?.data.errorDetails;
					setUsernameMessage(errorMessage!);
				} finally {
					setIsLoading(false);
				}
			}
		};
		validateUsername();
	}, [username]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: name,
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		setIsSubmitting(true);
		try {
			const res = await axios.patch("/api/me", data);
			toast({
				title: "Profile updated",
				description: res.data.message,
				duration: 3000,
			});

			setTimeout(() => {
				setIsOpen(false);
			}, 1000);
		} catch (error) {
			const axiosError = error as AxiosError<ErrorResponse>;
			let errorMessage = axiosError.response?.data.message;
			toast({
				title: "Profile update failed",
				description:
					errorMessage ?? "An error occurred while updating profile.",
				duration: 3000,
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogTrigger asChild>
				<Button className={className}>Edit Profile</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Profile</AlertDialogTitle>
					<AlertDialogDescription className="space-y-4 text-foreground">
						<div className="flex flex-col gap-2">
							<p className="text-sm text-foreground/80">
								Edit your username here contains 3 to 30
								characters.
							</p>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<FormField
										control={form.control}
										name="username"
										render={({ field }) => (
											<FormItem className="flex gap-2 flex-col">
												<FormControl>
													<Input
														type="text"
														{...field}
														onChange={(e) => {
															field.onChange(e);
															debounced(
																e.target.value
															);
														}}
													/>
												</FormControl>
												{isLoading && (
													<Loader2 className="animate-spin"></Loader2>
												)}
												<p
													className={`text-sm ${
														usernameMessage ===
														"Username is unique."
															? "text-green-700"
															: "text-destructive"
													}`}
												>
													{usernameMessage}
												</p>
												<FormMessage />
											</FormItem>
										)}
									/>
								</form>
							</Form>
						</div>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<Button
						disabled={isSubmitting || isLoading}
						type="submit"
						onClick={form.handleSubmit(onSubmit)}
					>
						{isSubmitting ? (
							<Loader2 className="animate-spin" />
						) : (
							"Update"
						)}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

const LogOutButton = ({ className }: { className: string }) => {
	const router = useRouter();
	const { toast } = useToast();

	const handleLogOut = async () => {
		try {
			const res = await axios.get("/api/sign-out");
			toast({
				title: "Success",
				description: res.data.message,
				duration: 3000,
			});
			router.push("/");
		} catch (error) {
			const axiosError = error as AxiosError<ErrorResponse>;
			let errorMessage = axiosError.response?.data.message;
			toast({
				title: "Log out failed",
				description:
					errorMessage ?? "An error occurred while logging out.",
				duration: 3000,
				variant: "destructive",
			});
			console.log(error);
		}
	};

	return (
		<Button
			className={className}
			variant="destructive"
			onClick={handleLogOut}
		>
			Log Out
		</Button>
	);
};
