package org.project.responses;

import java.util.HashMap;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import javax.servlet.http.HttpServletRequest;

public class SuccessResponse<T> {

    public ResponseEntity<T> handle(T object, Class<?> classController, HttpServletRequest request, HttpStatus status) {
        return new ResponseEntity<>(object, status);
    }

    public ResponseEntity<T> handle(HttpStatus status) {
        return new ResponseEntity<>(status);
    }

    public ResponseEntity<T> handle(T object, HttpStatus status) {
        return new ResponseEntity<>(object, status);
    }

    public ResponseEntity<HashMap<String, Object>> handle(String[] keys, Object[] objects, HttpStatus status) {
        final HashMap<String, Object> map = new HashMap<>();

        if (keys.length > 0 && keys.length == objects.length) {
            for (int i = 0; i < keys.length; i++) {
                map.put(keys[i], objects[i]);
            }
        }

        return new ResponseEntity<>(map, status);
    }
}
