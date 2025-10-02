package com.yoursay.backend.service;

import com.yoursay.backend.domain.Legislation;
import com.yoursay.backend.repository.LegislationRepository;
import jakarta.transaction.Transactional;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Service
public class FetchLegislationService {
    @Value("${legiscan.api.key}")
    private String apiKey;
    private final String basePath = "https://api.legiscan.com/?key=";
    private final String operation = "&op=getMasterList";
    final int totalBills = 1;
    final int billsToSkip = 20;

    private final LegislationRepository legislationRepository;

    private final GemeniService gemeniService;

    private List<String> excludedTitles = List.of("Day", "day", "Holiday", "holiday", "Week", "week", "Month", "month",
            "Recognition", "recognition", "Memorial", "memorial", "Proclamation", "proclamation", "Commendation", "commendation",
            "Congratulation", "congratulation", "Celebration", "celebration", "Remembrance", "remembrance", "Mourning", "mourning",
            "Commending", "commending", "Congratulating", "congratulating", "Celebrating", "celebrating", "Remembering", "remembering",
            "Commemorating", "commemorating", "Condemning", "condemning", "Condolences", "condolences", "Condolence", "condolence",
            "Tribute", "tribute", "Welcome", "welcome", "Farewell", "Honor", "honor", "Honoring", "honoring", "Recognizing", "recognizing",
            "Welcoming", "welcoming", "Farewell", "farewell", "Honour", "honour", "Honouring", "honouring", "Anniversary", "anniversary");

    private List<String> stateAbbreviations = List.of(
            "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
            "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
            "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
            "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
            "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "US", "DC"
    );

    public FetchLegislationService(LegislationRepository legislationRepository, GemeniService gemeniService) {
        this.legislationRepository = legislationRepository;
        this.gemeniService = gemeniService;
    }

    @Transactional
    public void fetchMasterList() {
        for (String state : stateAbbreviations) {
            RestTemplate restTemplate = new RestTemplate();
            String LEGISCAN_URL = basePath + apiKey + operation + "&state=" + state;
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
                    if (data.getInt("status") < 1 || data.getInt("status") > 2) {
                        excluded = true;
                    }
                    if (excluded) {
                        continue;
                    }

                    String aiDescription = gemeniService.generateResponse(data.get("number").toString() +
                            data.get("title").toString() + data.get("description").toString() + " explain this bill from "
                            + state + " in 5 concise sentences");

                    Legislation legislation = buildLegislation(data, title, aiDescription, state);

                    legislationRepository.save(legislation);

                    total++;

                    System.out.println(legislation.getState());
                } catch (JSONException e) {
                    return;
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        }
    }

    private static Legislation buildLegislation(JSONObject data, String title, String aiDescription, String state) {
        Legislation legislation = new Legislation();
        legislation.setBill_id(data.getInt("bill_id"));
        legislation.setTitle(title);
        legislation.setDescription(aiDescription);
        if (state.equals("US")) {
            legislation.setLevel("FEDERAL");
        } else {
            legislation.setLevel("STATE");
        }
        legislation.setState(state);

        List<String> dateList = Arrays.asList(data.getString("status_date").split("-"));
        Date date = new Date();
        date.setYear(Integer.parseInt(dateList.get(0))-1900);
        date.setMonth(Integer.parseInt(dateList.get(1))-1);
        date.setMinutes(Integer.parseInt(dateList.get(2)));
        legislation.setDate(date);
        return legislation;
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
