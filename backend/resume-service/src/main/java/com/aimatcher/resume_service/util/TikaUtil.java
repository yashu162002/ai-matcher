package com.aimatcher.resume_service.util;

import org.apache.tika.Tika;
import java.io.File;

public class TikaUtil {

    public static String extractText(File file) throws Exception {
        Tika tika = new Tika();
        return tika.parseToString(file);
    }
}
