/**
 * Author: Hamish Williams
 * https://github.com/HamishMW/portfolio
 */
import { useCallback, useEffect, useRef, useState } from 'react';

export function useWindowSize() {
	const dimensions = useRef({ width: 1280, height: 800 });


	const createRuler = useCallback(() => {
		const ruler = document.createElement('div');

		ruler.style.position = 'fixed';
		ruler.style.height = '100vh';
		ruler.style.width = '0px';
		ruler.style.top = '0px';

		document.documentElement.appendChild(ruler);

		// Set cache conscientious of device orientation
		dimensions.current.width = window.innerWidth;
		dimensions.current.height = ruler.offsetHeight;

		// Clean up after ourselves
		document.documentElement.removeChild(ruler);
	}, []);

	// Get the actual height on iOS Safari
	const getHeight = useCallback(() => {
		const isIOS = navigator?.userAgent.match(/iphone|ipod|ipad/i);

		if (isIOS) {
			createRuler();
			return dimensions.current.height;
		}

		return window.innerHeight;
	}, [createRuler]);

	const getSize = useCallback(() => {
		return {
			width: window.innerWidth,
			height: getHeight(),
		};
	}, [getHeight]);

	const [windowSize, setWindowSize] = useState(dimensions.current);

	useEffect(() => {
		const handleResize = () => {
			setWindowSize(getSize());
		};

		window.addEventListener('resize', handleResize);
		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [getSize]);

	return windowSize;
}
