package org.project.controllers.sample;

import org.project.models.sample.Sample;
import org.project.responses.ErrorResponse;
import org.project.responses.SuccessResponse;
import org.project.service.sample.SampleService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.IOException;
import java.text.ParseException;
import java.util.*;

@RestController
@RequestMapping("/samples")
public class SampleController {

    @Autowired
    private SampleService sampleService;

    @Autowired
    private ObjectMapper objectMapper;

    private final static String NOT_FOUND = "Não encontrado.";

    @GetMapping()
    public ResponseEntity<List<Sample>> index() {
        List<Sample> samples = sampleService.findAll();
        return new SuccessResponse<List<Sample>>().handle(samples, HttpStatus.OK);
    }

    @GetMapping("/findAll")
    public ResponseEntity<List<Sample>> findAll() {
        List<Sample> samples = sampleService.findAll();
        return new SuccessResponse<List<Sample>>().handle(samples, HttpStatus.OK);
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<?> findByCpf(@PathVariable("cpf") String cpf) {
        Sample sample = sampleService.findByCpf(cpf);
        if(sample != null) {
            return new SuccessResponse<Sample>().handle(sample, HttpStatus.OK);
        } else {
            return ErrorResponse.handle(new String[] {NOT_FOUND}, Sample.class, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<Sample> create(@RequestBody @Valid final Sample cParams) throws ParseException {
        Sample sample = sampleService.create(cParams);
        return new SuccessResponse<Sample>().handle(sample, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> destroy(@PathVariable("id") long id) {
        Sample sample = sampleService.findById(id);
        if (sample != null) {
            sampleService.delete(sample);
            return new SuccessResponse<Sample>().handle(sample, HttpStatus.OK);
        }
        return ErrorResponse.handle(new String[] {NOT_FOUND}, Sample.class, HttpStatus.NOT_FOUND);
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<?> update(@PathVariable("id") long id, HttpServletRequest request) throws IOException {
        Sample sample = sampleService.findById(id);
        if (sample != null) {
            Sample updateSample = objectMapper.readerForUpdating(sample).readValue(request.getReader());
            sampleService.updateStatus(updateSample);
            return new SuccessResponse<Sample>().handle(sample, HttpStatus.ACCEPTED);
        } else {
            return ErrorResponse.handle(new String[] {NOT_FOUND}, Sample.class, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/findByCpfAndStatusTrue/{cpf}")
    public ResponseEntity<?> findByCpfAndStatusTrue(@PathVariable String cpf) {
        Sample sample = sampleService.findByCpfAndStatusTrue(cpf);
        if(sample != null)
            return new SuccessResponse<Sample>().handle(sample, HttpStatus.OK);
        else
            return ErrorResponse.handle(new String[] {NOT_FOUND}, Sample.class, HttpStatus.NOT_FOUND);
    }

}
