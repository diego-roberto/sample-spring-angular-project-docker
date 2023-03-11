package org.project.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.util.Iterator;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class JsonUtil {


    public static String toJson(Object object) throws JsonProcessingException {
        ObjectWriter objectWriter = new ObjectMapper().writer().withDefaultPrettyPrinter();
        return objectWriter.writeValueAsString(object);
    }

    public static void removeField(JSONObject jsonObject, String field) throws JSONException {
        jsonObject.remove(field);

        Iterator<String> iterator = jsonObject.keys();

        while (iterator.hasNext()) {
            String key = iterator.next();
            Object child = jsonObject.get(key);

            if (child instanceof JSONArray) {
                JSONArray jsonArray = ((JSONArray) child);
                int size = jsonArray.length();

                for (int i = 0; i < size; i++) {
                    removeField(jsonArray.getJSONObject(i), field);
                }
            }
            if (child instanceof JSONObject) {
                removeField(((JSONObject) child), field);
            }
        }
    }

}
