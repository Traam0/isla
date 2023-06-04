import { motion } from "framer-motion";

interface ModalWrapperProps {
	children: React.ReactNode;
}

export default function ModalWrapper({
	children,
}: ModalWrapperProps): JSX.Element {
	return (
		<motion.section
			role="modal"
			onClick={(e) => e.stopPropagation()}
			className="bg-background-500 m-auto px-8 rounded-xl flex flex-col items-center "
			style={{
				width: "clamp(50%, 650px, 90%)",
				height: "min(50%, 350px)",
			}}
		>
			{children}
		</motion.section>
	);
}
