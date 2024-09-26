import React from "react";

const Loader = () => {
	return (
		<div className="flex justify-center items-center">
			<div className="w-6 h-6 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
		</div>
	);
};

export default Loader;
