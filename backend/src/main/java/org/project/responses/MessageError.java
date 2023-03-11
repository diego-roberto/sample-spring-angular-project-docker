package org.project.responses;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageError {

    private String target;
    private String type;
    private String message;

    public MessageError(final String target, final String type, final String message) {
        this.target = target;
        this.type = type;
        this.message = message;
    }

}
