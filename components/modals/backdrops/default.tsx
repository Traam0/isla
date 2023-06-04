import { ModalBackDropProps } from ".";
import { motion } from "framer-motion";

export function DefaultModalBackdrop({
	children,
	onClick,
}: ModalBackDropProps): JSX.Element {
	return (
		<motion.div
			{...{ onClick }}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed z-[9999] inset-0 h-screen w-screen bg-black/10 flex items-center justify-center	"
		>
			{children}
		</motion.div>
	);
}
