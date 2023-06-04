import PusherServer from "pusher";
import PusherClient from "pusher-js";

const pusherServer = new PusherServer({
	appId: process.env.PUSHER_APP_ID!,
	key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
	secret: process.env.PUSHER_APP_SECRET!,
	cluster: "eu",
	useTLS: true,
});

const pusherClien = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
	cluster: "eu",
});
