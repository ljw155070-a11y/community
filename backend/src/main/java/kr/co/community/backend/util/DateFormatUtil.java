package kr.co.community.backend.util;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DateFormatUtil {
    
    /**
     * Date를 "yyyy. MM. dd." 형식으로 변환
     */
    public static String formatDate(Date date) {
        if (date == null) {
            return "";
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy. MM. dd.");
        return sdf.format(date);
    }
    
    /**
     * Date를 "h:mm" 형식으로 변환
     */
    public static String formatTime(Date date) {
        if (date == null) {
            return "";
        }
        SimpleDateFormat sdf = new SimpleDateFormat("h:mm");
        return sdf.format(date);
    }
    
    /**
     * Date를 "yyyy. MM. dd. HH:mm" 형식으로 변환
     */
    public static String formatDateTime(Date date) {
        if (date == null) {
            return "";
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy. MM. dd. HH:mm");
        return sdf.format(date);
    }
}