interface SpinnerProps {
	variation: number;
}

export function Spinner(): JSX.Element {
	return (
		<div
			role="loader"
			className="spinner relative rounded-full bg-secondary-500 h-14 w-14 after:content-[''] after:block after:absolute after:rounded-full after:inset-0 after:border-4 after:border-solid after:border-primary-500 after:border-x-transparent after:animate-spinLoader"
		></div>
	);
}
