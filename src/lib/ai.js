import { toaster } from "./toaster";

export const ai = {
    ask: async (prompt, model, onStream, onComplete) => {
        const id = crypto.randomUUID();
        try {
            const response = await puter.ai.chat(prompt, { model, stream: true, speed: 0.1 });
            console.log(response);
            for await (const part of response) {
                onStream(part.text || "", id)
            } 
            onComplete(id)
        } catch (err) {
            console.log(err);
            return onStream("<font color='red'>No content available. Please try another prompt or switching to a different AI model.</font>", id)
        }
    }
}