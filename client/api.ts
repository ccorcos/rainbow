import { Api } from "../types"

function post<T extends keyof Api>(name: T) {
	return async (input: Api[T]["input"]) => {
		const response = await fetch(`/api/${name}`, {
			method: "post",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(input),
		})
		const data = await response.json()
		return data as Api[T]["output"]
	}
}

export const setScene = post("setScene")
