import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";

interface AppState {
	notification: boolean;
	localHistory: { id: string; value: string }[];
}

const initialState: AppState = {
	notification: true,
	localHistory: [],
};

export const appSlice = createSlice({
	name: "app",
	initialState,
	reducers: {
		enableNotifications: (state): void => {
			state.notification = true;
		},
		disableNotification: (state): void => {
			state.notification = false;
		},
		clearLocalHistory: (state): void => {
			state.localHistory = [];
		},
		removeFromLocalHistory: (
			state,
			{ payload }: PayloadAction<{ id: string; value: string }>
		): void => {
			state.localHistory = state.localHistory.filter(
				(one) => one.id !== payload.id && one.value !== payload.value
			);
		},
		addToLocalHistory: (
			state,
			{ payload }: PayloadAction<{ id: string; value: string }>
		): void => {
			if (state.localHistory.length < 25) {
				state.localHistory = [
					...state.localHistory.filter(
						(one) => one.id !== payload.id && one.value !== payload.value
					),
					payload,
				];

				return;
			}

			const [first, ...rest] = state.localHistory;

			state.localHistory = [
				...rest.filter(
					(one) => one.id !== payload.id && one.value !== payload.value
				),
				payload,
			];
		},
	},
});

export const {
	enableNotifications,
	disableNotification,
	clearLocalHistory,
	removeFromLocalHistory,
	addToLocalHistory,
} = appSlice.actions;

export default appSlice.reducer;
