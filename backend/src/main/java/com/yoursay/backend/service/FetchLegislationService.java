package com.yoursay.backend.service;

import com.yoursay.backend.domain.Legislation;
import com.yoursay.backend.repository.LegislationRepository;
import jakarta.transaction.Transactional;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class FetchLegislationService {
    @Value("${legiscan.api.key}")
    private String apiKey;
    private final String basePath = "https://api.legiscan.com/?key=";
    private final String operation = "&op=getMasterList";
    final int totalBills = 6;

    private final LegislationRepository legislationRepository;

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

    public FetchLegislationService(LegislationRepository legislationRepository) {
        this.legislationRepository = legislationRepository;
    }

    @Transactional
    public void fetchMasterList() {
        List<Integer> existingBillIds = new ArrayList<>();

        for (String state : stateAbbreviations) {
            RestTemplate restTemplate = new RestTemplate();
            String LEGISCAN_URL = basePath + apiKey + operation + "&state=" + state;
            String response = restTemplate.getForObject(LEGISCAN_URL, String.class);

            final JSONObject obj = new JSONObject(response);
            final JSONObject geodata = obj.getJSONObject("masterlist");

            int index = getLastIndex(geodata);
            int lastIndex = index;

            int total = 0;
            boolean shouldExcludeByTitle = true;
            boolean secondPass = false;
            int billsToSkip = 10;
            for (; total < totalBills; index-=billsToSkip) {
                try {
                    if (index < 0) {
                        if (secondPass) {
                            break;
                        }
                        index = lastIndex;
                        billsToSkip = 1;
                        shouldExcludeByTitle = false;
                        secondPass = true;
                    }
                    final JSONObject data = geodata.getJSONObject(Integer.toString(index));
                    String title = data.get("title").toString();

                    boolean excluded = false;
                    if (shouldExcludeByTitle) {
                        excluded = checkTitleExclusion(title, excluded);
                    }

                    if (excluded) {
                        continue;
                    }

                    Legislation legislation = buildLegislation(data, title, state);

                    if (existingBillIds.contains(legislation.getBill_id())) {
                        continue;
                    }

                    legislationRepository.save(legislation);

                    existingBillIds.add(legislation.getBill_id());

                    total++;
                } catch (Exception e) {
                    System.out.println("Exception "+e.getMessage());
                }
            }
        }
    }

    private boolean checkTitleExclusion(String title, boolean excluded) {
        for (String excludedTitle : excludedTitles) {
            if (title.contains(excludedTitle)) {
                excluded = true;
                break;
            }
        }
        return excluded;
    }

    private static Legislation buildLegislation(JSONObject data, String title, String state) {
        Legislation legislation = new Legislation();
        legislation.setBill_id(data.getInt("bill_id"));
        legislation.setTitle(title);
        legislation.setDescription(data.getString("description"));
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
