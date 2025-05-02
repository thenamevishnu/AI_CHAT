import { toaster } from "./toaster";

export const ai = {
    ask: async (prompt, model, onStream, onComplete) => {
        try {
            const id = crypto.randomUUID();
            const response = await puter.ai.chat(prompt, { model, stream: true, speed: 0.1 });
            console.log(response);
            for await (const part of response) {
                onStream(part.text, id)
            } 
            onComplete(id)
        } catch (err) {
            return toaster.error("Try again with another model.")
        }
    }
}