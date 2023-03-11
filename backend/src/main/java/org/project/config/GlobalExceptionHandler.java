package org.project.config;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import org.springframework.web.multipart.MultipartException;

@ControllerAdvice
public class GlobalExceptionHandler {

    private final static Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleBusinessException(HttpServletRequest req, Exception e) {
        logger.error(e.getMessage(), e);
        return parseError(req, e);
    }

    @ExceptionHandler(MultipartException.class)
    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleMultipartException(HttpServletRequest req, Throwable e) {
        logger.error(e.getMessage());
        return parseError(req, e);
    }

    private Map<String, Object> parseError(HttpServletRequest req, Throwable exception) {
        Map<String, Object> objectMap = new HashMap<>();
        objectMap.put("message_developer", exception.getClass().toString());
        objectMap.put("message_user", exception.getMessage());
        objectMap.put("uri", req.getRequestURI());
        return objectMap;
    }

    private Map<String, Object> parseError(HttpServletRequest req, Exception exception) {
        Map<String, Object> objectMap = new HashMap<>();
        objectMap.put("message_developer", exception.getClass().toString());
        objectMap.put("message_user", exception.getMessage());
        objectMap.put("uri", req.getRequestURI());
        return objectMap;
    }

}
