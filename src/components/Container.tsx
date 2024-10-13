import { cn } from "@/lib/utils";
import { CSSProperties, ReactNode } from "react";

const Container = ({
	children,
	className,
	style,
}: {
	children: ReactNode
	className?: string,
	style?: CSSProperties
}) => {
	return (
		<>
			<div className={cn("flex justify-center items-center w-full h-svh", className)} style={style}>
				{children}
			</div>
		</>
	);
};

export default Container;
