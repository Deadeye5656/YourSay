package com.yoursay.backend.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.ThinkingConfig;
import org.springframework.stereotype.Service;

@Service
public class GemeniService {

    public String generateResponse(String prompt) throws InterruptedException {
        // The client gets the API key from the environment variable `GOOGLE_API_KEY`.
        Client client = new Client();

        ThinkingConfig thinkingConfig = ThinkingConfig.builder()
                .thinkingBudget(0) // Set thinking budget to 0 to disable thinking
                .build();

        GenerateContentConfig generateContentConfig = GenerateContentConfig.builder()
                .thinkingConfig(thinkingConfig)
                .build();

        Thread.sleep(2000L);

        int attempt = 0;
        while (attempt < 5) {
            try {
                GenerateContentResponse response =
                        client.models.generateContent(
                                "gemini-2.0-flash-lite",
                                prompt,
                                generateContentConfig);
                return response.text();
            } catch (Exception e) {
                attempt++;
                if (attempt == 5) {
                    throw e; // rethrow the exception after 3 failed attempts
                }
                Thread.sleep(2000L * attempt); // wait before retrying
            }
        }

        return "";
    }
}
