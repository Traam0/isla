import { useRouter } from "next/router";
import { AppLayout } from "~/layouts";

export default function Tide() {
	const router = useRouter();

	return (
		<AppLayout>
			<div>{router.query.id}</div>
		</AppLayout>
	);
}
