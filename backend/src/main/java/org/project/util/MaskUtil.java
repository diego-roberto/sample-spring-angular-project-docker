package org.project.util;

import java.text.ParseException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.swing.text.MaskFormatter;

public class MaskUtil {

    public static String formatName(String name) {
    	if(name == null || name.length() == 0) {
    		return "";
    	}
        String[] words = name.split("\\s+");

		StringBuilder formatedBuilder = new StringBuilder();
		for (String word : words) {
            formatedBuilder.append(word.substring(0, 1).toUpperCase()).append(word.substring(1).toLowerCase()).append(" ");
        }
		String formated = formatedBuilder.toString();

		return formated.substring(0, formated.length() - 1);
    }
    
	public static String cpfFormatter(String cpf) {
		MaskFormatter mask;
		try {
			mask = new MaskFormatter("###.###.###-##");
			mask.setValueContainsLiteralCharacters(false);
			return mask.valueToString(cpf);
		} catch (ParseException e) {
			throw new RuntimeException(e);
		}
	}

	public static String addMaskCnpj(String cnpj) {
		if (StringUtils.isEmpty(cnpj))
			return null;

		try {
			MaskFormatter mask = new MaskFormatter("##.###.###/####-##");
			mask.setValueContainsLiteralCharacters(false);

			return mask.valueToString(cnpj);
		} catch (ParseException ex) {
			Logger.getLogger(MaskUtil.class.getName()).log(Level.SEVERE, null, ex);
			return "";
		}
	}

	public static String removeMask(String cnpj) {
		if (StringUtils.isEmpty(cnpj))
			return null;

		return cnpj.replace(".", "")
				.replace("/", "")
				.replace("-", "");
	}
}
