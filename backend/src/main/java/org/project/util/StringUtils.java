package org.project.util;

import java.nio.charset.StandardCharsets;
import java.text.Normalizer;

public class StringUtils {

    public static boolean isUtf8(String content) {
        return getCharacterNotUtf8(content) == null;
    }

    public static String getCharacterNotUtf8(String content) {
        if (isEmpty(content))
            return null;

        for (int i = 0; i < content.length(); ++i) {
            String character = content.substring(i, i + 1);
            byte[] bytes = character.getBytes(StandardCharsets.UTF_8);

            if (bytes.length > 2)
                return character;
        }

        return null;
    }

    public static String removeAccent(String str) {
        return Normalizer.normalize(str, Normalizer.Form.NFD).replaceAll("[^\\p{ASCII}]", "");
    }

    public static String removeCharacters(String content, String... caracteres) {
        if (isEmpty(content))
            return null;
        for (String c : caracteres) {
            content = content.replace(c, "");
        }
        return content;
    }

    public static boolean isEmpty(String content) {
        return content == null || content.isEmpty();
    }

    public static String returnOnlynumbers(String content) {
        if(isEmpty(content))
            return null;

        char[] teste = content.toCharArray();

        String retorno = "";
        for (char c : teste) {
            if (Character.isDigit(c)) {
                retorno += c;
            }
        }
        return retorno;
    }

}