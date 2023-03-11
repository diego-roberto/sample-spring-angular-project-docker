package org.project.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Calendar;
import java.util.Date;

public abstract class DataUtil {

	public static final String FORMATO_DIA_MES_ANO = "dd/MM/yyyy";
	public static final String FORMATO_ANO_MES_DIA = "yyyy-MM-dd";

	public static Calendar getCurrentDate() {
		return Calendar.getInstance();
	}

	public static Date getToday() {
		return DataUtil.getCurrentDate().getTime();
	}

	public static Date addDays(Date dt, int days) {
		if (dt == null) {
			dt = getToday();
		}

		Calendar temp = DataUtil.getCurrentDate();
		temp.setTime(dt);

		temp.add(Calendar.DAY_OF_WEEK, days);

		return temp.getTime();
	}

	public static Long countDaysBetween(Date beginAt, Date endAt) {
		return ChronoUnit.DAYS.between(Instant.ofEpochMilli(beginAt.getTime()), Instant.ofEpochMilli(endAt.getTime()));
	}

	public static String convertMonth(String legend) {
		legend = legend.toUpperCase().replace("FEB", "FEV");
		legend = legend.toUpperCase().replace("APR", "ABR");
		legend = legend.toUpperCase().replace("MAY", "MAI");
		legend = legend.toUpperCase().replace("AUG", "AGO");
		legend = legend.toUpperCase().replace("SEP", "SET");
		legend = legend.toUpperCase().replace("OCT", "OUT");
		legend = legend.toUpperCase().replace("DEC", "DEZ");

		return legend;
	}

	public static String formatLocalDate(LocalDate date, String format) {
		if (date == null)
			return null;
		return DateTimeFormatter.ofPattern(format).format(date);
	}

	public static Date toDate(LocalDate localDate) {
		if (localDate == null)
			return null;
		return Date.from(LocalDateTime.of(localDate, LocalTime.MIN).atZone(ZoneId.systemDefault()).toInstant());
	}

	public static LocalDate toLocalDate(Date date) {
		if (date == null)
			return null;

		return Instant.ofEpochMilli(date.getTime()).atZone(ZoneId.systemDefault()).toLocalDate();
	}

	public static Date removeHhMnSs(Date date) throws ParseException {
		DateFormat dateFormat = new SimpleDateFormat(FORMATO_ANO_MES_DIA);
		return dateFormat.parse(dateFormat.format(date));
	}

	public static Date getDateYesterday() {
		LocalDate localDate = LocalDate.now().minusDays(1);
		return Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
	}

	public static Date getDateMinusDays(long days) {
		LocalDate localDate = LocalDate.now().minusDays(days);
		return Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
	}

	public static Date getDateMinusYears(long years) {
		LocalDate localDate = LocalDate.now().minusYears(years);
		return Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
	}

	public static Date getDateToday() {
		LocalDate localDate = LocalDate.now();
		return Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
	}

}
