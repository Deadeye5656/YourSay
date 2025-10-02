package com.yoursay.backend.service;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Objects;

@Service
public class FetchLegislationService {
    @Value("${legiscan.api.key}")
    private String apiKey;
    private final String basePath = "https://api.legiscan.com/?key=";
    private final String operation = "&op=getMasterList";
    final int totalBills = 3;
    final int billsToSkip = 20;

    private final GemeniService gemeniService;

    private List<String> excludedTitles = List.of("Day", "day", "Holiday", "holiday", "Week", "week", "Month", "month",
            "Recognition", "recognition", "Memorial", "memorial", "Proclamation", "proclamation", "Commendation", "commendation",
            "Congratulation", "congratulation", "Celebration", "celebration", "Remembrance", "remembrance", "Mourning", "mourning",
            "Commending", "commending", "Congratulating", "congratulating", "Celebrating", "celebrating", "Remembering", "remembering",
            "Commemorating", "commemorating", "Condemning", "condemning", "Condolences", "condolences", "Condolence", "condolence",
            "Tribute", "tribute", "Welcome", "welcome", "Farewell", "Honor", "honor", "Honoring", "honoring", "Recognizing", "recognizing",
            "Welcoming", "welcoming", "Farewell", "farewell", "Honour", "honour", "Honouring", "honouring", "Anniversary", "anniversary");

    public FetchLegislationService(GemeniService gemeniService) {
        this.gemeniService = gemeniService;
    }

    public void fetchMasterList() {
//        return gemeniService.generateResponse("https://legiscan.com/MI/text/HB4001/2025 explain this bill in 5 concise sentences");
        RestTemplate restTemplate = new RestTemplate();
        String LEGISCAN_URL = basePath + apiKey + operation + "&state=US";
        String response = restTemplate.getForObject(LEGISCAN_URL, String.class);

        final JSONObject obj = new JSONObject(response);
        final JSONObject geodata = obj.getJSONObject("masterlist");

        int index = getLastIndex(geodata);

        int total = 0;
        for (; total < totalBills; index-=billsToSkip) {
            try {
                final JSONObject data = geodata.getJSONObject(Integer.toString(index));
                String title = data.get("title").toString();

                boolean excluded = false;
                for (String excludedTitle : excludedTitles) {
                    if (title.contains(excludedTitle)) {
                        excluded = true;
                        break;
                    }
                }
                if (!Objects.equals(data.get("status").toString(), "1") || !Objects.equals(data.get("status").toString(), "2")) {
                    excluded = true;
                }
                if (excluded) {
                    continue;
                }


                total++;
                System.out.println(title);
            } catch (JSONException e) {
                return;
            }
        }
    }

    private static int getLastIndex(JSONObject geodata) {
        int index;
        for (int i = 0; true; i++) {
            try {
                geodata.getJSONObject(Integer.toString(i));
            } catch (JSONException e) {
                index = i - 1;
                break;
            }
        }
        return index;
    }
}
