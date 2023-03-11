package org.project.service.sample;

import org.project.models.sample.Sample;
import org.project.repositories.sample.SampleRepository;
import org.project.util.MaskUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
@Transactional
public class SampleService {

    @Autowired
    private SampleRepository sampleRepository;

    public List<Sample> findAll() {
        return sampleRepository.findAll();
    }

    public Sample findById(Long id) {
        Optional<Sample> sample = sampleRepository.findById(id);
        return sample.orElse(null);
    }

    public Sample create(Sample sample) {
        return sampleRepository.save(sample);
    }

    public Sample update(Sample sample) {
        return sampleRepository.save(sample);
    }

    public void delete(Sample sample) {
        sampleRepository.delete(sample);
    }

    public void updateStatus(Sample sample) {
        sampleRepository.updateStatus(sample.getId(), sample.isStatus());
    }

    public Sample findByCpf(String cpf) {
        String cpfFormated = MaskUtil.cpfFormatter(cpf);
        return sampleRepository.findByCpf(cpf, cpfFormated);
    }

    public Sample findByCpfAndStatusTrue(String cpf) {
        return sampleRepository.findByCpfAndStatusTrue(cpf);
    }

}
