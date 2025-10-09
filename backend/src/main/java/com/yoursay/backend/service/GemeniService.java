package com.yoursay.backend.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.stereotype.Service;

@Service
public class GemeniService {

    public String fetchAiSummaryOfBill(String state, String bill_id, String title){
        // The client gets the API key from the environment variable `GOOGLE_API_KEY`.
        Client client = new Client();

        String prompt = String.format(
                "Provide a concise summary of the following %s bill (%s) titled '%s' in 3-5 sentences," +
                        " focusing on its main objectives and implications." +
                        " Don't say things like based on... or as an AI model... Just give the summary.",
                state, bill_id, title);

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-2.5-pro",
                        prompt,
                        GenerateContentConfig.builder().build());

        return response.text();
    }
}
