package org.project.repositories.sample;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import org.project.models.sample.Sample;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface SampleRepository extends JpaRepository<Sample, Long> {

    @Query(" SELECT a FROM Sample AS a  WHERE  a.cpf =:cpf or a.cpf =:cpfFormated  ")
    Sample findByCpf(@Param("cpf")String cpf, @Param("cpfFormated") String cpfFormated);

    Optional<Sample> findById(Long id);

    Sample findByCpfAndStatusTrue(String cpf);

    List<Sample> findByCpfAndStatus(String cpf, boolean status);

    @Transactional
    @Modifying
    @Query("UPDATE Sample a SET a.status = ?2 WHERE a.id = ?1")
    void updateStatus(Long userId, Boolean status);

}
