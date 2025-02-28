import { RefObject, useEffect } from "react";

export const useMaskImage = (ref: RefObject<HTMLElement>) => {
	const handleScroll = () => {
		const element = ref.current;
		if (!element) return;
		const { scrollTop, scrollHeight, clientHeight } = element;
		//console.log({ scrollTop, scrollHeight, clientHeight });

		if (scrollTop === 0) {
			// at the top - fade only at the bottom
			element.style.maskImage = "linear-gradient(to bottom, white, white 5%, white 90%, transparent)";
		} else if (Math.floor(scrollTop + clientHeight) >= scrollHeight) {
			// at the bottom - fade only at the top
			element.style.maskImage = "linear-gradient(to bottom, transparent, white 5%, white 90%, white)";
		} else {
			// middle - fade both top and bottom
			element.style.maskImage = "linear-gradient(to bottom, transparent, white 5%, white 90%, transparent)";
		}
	};

	useEffect(() => {
		const element = ref.current;
		if (element) element.addEventListener("scroll", handleScroll);

		return () => {
			if (element) element.removeEventListener("scroll", handleScroll);
		};
	}, []);
}
