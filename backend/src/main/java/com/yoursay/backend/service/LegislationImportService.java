package com.yoursay.backend.service;

import com.yoursay.backend.domain.Legislation;
import com.yoursay.backend.domain.LocalLegislationRequest;
import com.yoursay.backend.repository.LegislationRepository;
import jakarta.transaction.Transactional;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class LegislationImportService {
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

    public LegislationImportService(LegislationRepository legislationRepository) {
        this.legislationRepository = legislationRepository;
    }

    // Topic keyword arrays
    private static final String[] HEALTHCARE_KEYWORDS = {"healthcare", "medicare", "medicaid", "insurance", "hospital", "doctor", "nurse", "pharmaceutical", "mental", "public", "medical", "prescription", "clinic", "patient", "surgery", "dental", "vision", "wellness", "primary", "specialist", "emergency", "plan", "coverage", "drug", "treatment", "diagnosis", "preventive", "system", "reform", "telemedicine", "technology", "epidemic", "pandemic", "vaccine", "immunization", "equity", "long-term", "nursing"};
    private static final String[] EDUCATION_KEYWORDS = {"education", "school", "student", "teacher", "university", "college", "curriculum", "classroom", "scholarship", "loan", "tuition", "literacy", "stem", "elementary", "secondary", "k-12", "public", "private", "charter", "voucher", "financial", "grant", "degree", "diploma", "testing", "assessment", "special", "training", "remote", "distance", "textbook", "funding", "lunch", "after", "early", "preschool", "head start", "reform"};
    private static final String[] ECONOMY_KEYWORDS = {"economy", "job", "employment", "unemployment", "gdp", "inflation", "recession", "market", "trade", "business", "industry", "wage", "income", "growth", "stimulus", "minimum", "labor", "workforce", "manufacturing", "export", "import", "tariff", "small", "entrepreneur", "investment", "stock", "banking", "finance", "credit", "debt", "consumer", "poverty", "development", "subsidy", "bailout", "fiscal", "monetary", "interest", "training"};
    private static final String[] ENVIRONMENT_KEYWORDS = {"environment", "climate", "pollution", "emission", "carbon", "renewable", "sustainability", "conservation", "wildlife", "recycling", "green", "energy", "warming", "epa", "air", "water", "waste", "toxic", "hazardous", "solar", "wind", "geothermal", "hydroelectric", "biodiversity", "ecosystem", "deforestation", "reforestation", "ocean", "marine", "endangered", "resource", "fossil", "oil", "gas", "coal", "change", "protection", "justice"};
    private static final String[] IMMIGRATION_KEYWORDS = {"immigration", "border", "visa", "refugee", "asylum", "citizenship", "deportation", "migrant", "green", "daca", "undocumented", "immigrant", "naturalization", "reform", "detention", "customs", "patrol", "sanctuary", "separation", "permit", "guest", "law", "policy", "residency", "ban", "status", "court", "enforcement", "services"};
    private static final String[] GUN_CONTROL_KEYWORDS = {"gun", "firearm", "weapon", "background", "second", "nra", "shooting", "assault", "concealed", "violence", "ammunition", "law", "safety", "rights", "ban", "magazine", "open", "registration", "license", "red", "trafficking", "show", "dealer", "control", "mass", "school", "self-defense", "stand", "buyback"};
    private static final String[] CIVIL_RIGHTS_KEYWORDS = {"civil", "equality", "discrimination", "racism", "sexism", "lgbtq", "voting", "freedom", "justice", "inclusion", "diversity", "human", "protection", "affirmative", "hate", "disability", "gender", "racial", "religious", "liberties", "opportunity", "anti-discrimination", "marriage", "segregation", "integration", "minority", "social", "women", "transgender"};
    private static final String[] FOREIGN_POLICY_KEYWORDS = {"foreign", "international", "diplomacy", "treaty", "sanction", "war", "military", "defense", "alliance", "united", "agreement", "embassy", "aid", "ambassador", "relations", "law", "peacekeeping", "nato", "conflict", "arms", "nuclear", "counterterrorism", "investment", "overseas", "border", "cooperation", "humanitarian", "affairs", "state", "geopolitics"};
    private static final String[] TAXES_KEYWORDS = {"tax", "irs", "income", "corporate", "cut", "reform", "deduction", "revenue", "taxpayer", "rate", "credit", "return", "property", "sales", "excise", "capital", "shelter", "evasion", "compliance", "code", "bracket", "withholding", "policy", "incentive", "estate", "inheritance", "refund"};
    private static final String[] PUBLIC_SAFETY_KEYWORDS = {"public", "crime", "police", "firefighter", "emergency", "disaster", "rescue", "first", "law", "safety", "security", "prevention", "ambulance", "paramedic", "911", "community", "health", "relief", "evacuation", "hazard", "threat", "risk", "order", "regulation", "fire", "traffic", "school", "domestic", "child"};
    private static final String[] INFRASTRUCTURE_KEYWORDS = {"infrastructure", "road", "bridge", "transportation", "transit", "rail", "airport", "port", "water", "sewer", "broadband", "utility", "construction", "maintenance", "highway", "works", "funding", "pipeline", "electric", "telecommunications", "fiber", "project", "investment", "mass", "repair", "stormwater", "wastewater", "modernization", "resilience", "planning"};
    private static final String[] OTHER_KEYWORDS = {"miscellaneous", "other", "general", "various", "uncategorized", "misc", "not", "unspecified", "catch-all", "additional", "extra", "supplemental"};

    private static final Map<String, String[]> TOPIC_KEYWORDS = Map.ofEntries(
        Map.entry("Healthcare", HEALTHCARE_KEYWORDS),
        Map.entry("Education", EDUCATION_KEYWORDS),
        Map.entry("Economy", ECONOMY_KEYWORDS),
        Map.entry("Environment", ENVIRONMENT_KEYWORDS),
        Map.entry("Immigration", IMMIGRATION_KEYWORDS),
        Map.entry("Gun Control", GUN_CONTROL_KEYWORDS),
        Map.entry("Civil Rights", CIVIL_RIGHTS_KEYWORDS),
        Map.entry("Foreign Policy", FOREIGN_POLICY_KEYWORDS),
        Map.entry("Taxes", TAXES_KEYWORDS),
        Map.entry("Public Safety", PUBLIC_SAFETY_KEYWORDS),
        Map.entry("Infrastructure", INFRASTRUCTURE_KEYWORDS),
        Map.entry("Other", OTHER_KEYWORDS)
    );

    private String determineCategory(String description) {
        if (description == null || description.isEmpty()) return "Other";
        String descLower = description.toLowerCase();
        String bestCategory = "Other";
        int maxMatches = 0;
        for (Map.Entry<String, String[]> entry : TOPIC_KEYWORDS.entrySet()) {
            int matches = 0;
            for (String keyword : entry.getValue()) {
                if (descLower.contains(keyword.toLowerCase())) {
                    matches++;
                }
            }
            if (matches > maxMatches) {
                maxMatches = matches;
                bestCategory = entry.getKey();
            }
        }
        return bestCategory;
    }

    public boolean addLocalLegislation(LocalLegislationRequest legislationRequest) {
        Legislation legislation = new Legislation();
        legislation.setBill_id(null);
        legislation.setTitle(legislationRequest.getTitle());
        legislation.setDescription(legislationRequest.getDescription());
        legislation.setBillLevel("LOCAL");
        legislation.setState(legislationRequest.getState());
        legislation.setCity(legislationRequest.getCity());
        legislation.setZipcode(legislationRequest.getZipcode());
        String currentDate = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        legislation.setBillDate(currentDate);
        legislation.setCategory(determineCategory(legislationRequest.getDescription()));
        try {
            legislationRepository.save(legislation);
            return true;
        } catch (Exception e) {
            return false;
        }
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
                System.out.println(state);
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
            legislation.setBillLevel("FEDERAL");
        } else {
            legislation.setBillLevel("STATE");
        }
        legislation.setState(state);
        legislation.setBillDate(data.getString("status_date"));
        // Set category based on description
        String description = data.getString("description");
        legislation.setCategory(new LegislationImportService(null).determineCategory(description));
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
