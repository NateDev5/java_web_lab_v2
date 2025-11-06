package org.nate.cardatabasev2.BusinessLogicLayer;

import org.nate.cardatabasev2.DataAccessLayer.Owner;
import org.nate.cardatabasev2.DataAccessLayer.OwnerRepository;
import org.nate.cardatabasev2.PresentationLayer.dto.owner.OwnerRequest;
import org.nate.cardatabasev2.PresentationLayer.dto.owner.OwnerResponse;
import org.nate.cardatabasev2.PresentationLayer.mapper.OwnerMapper;
import org.nate.cardatabasev2.utilities.DuplicateResourceException;
import org.nate.cardatabasev2.utilities.OwnerHasCarsException;
import org.nate.cardatabasev2.utilities.OwnerNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;
@Service
public class OwnerService {
    private final OwnerRepository ownerRepository;
    public OwnerService(OwnerRepository repository) {
        this.ownerRepository = repository;
    }
    @Transactional(readOnly = true)
    public List<OwnerResponse> getAll() {
        return ownerRepository.findAll()
                .stream().map(OwnerMapper::toResponse).toList();
    }
    @Transactional(readOnly = true)
    public OwnerResponse getById(Long id) {
        Owner owner = ownerRepository.findById(id)
                .orElseThrow(() -> new OwnerNotFoundException(id));
        return OwnerMapper.toResponse(owner);
    }
    @Transactional
    public OwnerResponse create(OwnerRequest req) {
        if (ownerRepository.existsByEmailIgnoreCase(req.email())) {
            throw new DuplicateResourceException("Owner email already exists: " + req.email());
        }
        Owner entity = OwnerMapper.toEntity(req);
        Owner saved = ownerRepository.save(entity);
        return OwnerMapper.toResponse(saved);
    }

    @Transactional
    public OwnerResponse update(Long id, OwnerRequest req) {
        Owner current = ownerRepository.findById(id)
                .orElseThrow(() -> new OwnerNotFoundException(id));
        boolean emailChanging = req.email() != null
                && !req.email().equalsIgnoreCase(current.getEmail());
        if (emailChanging && ownerRepository.existsByEmailIgnoreCase(req.email())) {
            throw new DuplicateResourceException("Owner email already exists: " + req.email());
        }
        current.setFirstName(req.firstName());
        current.setLastName(req.lastName());
        current.setEmail(req.email());
        current.setPhone(req.phone());
        Owner saved = ownerRepository.save(current);
        return OwnerMapper.toResponse(saved);
    }
    @Transactional
    public void delete(Long id) {
        Owner owner = ownerRepository.findById(id)
                .orElseThrow(() -> new OwnerNotFoundException(id));
        if (owner.getCars() != null && !owner.getCars().isEmpty()) {
            throw new OwnerHasCarsException(id);
        }
        ownerRepository.delete(owner);
    }

    @Transactional(readOnly = true)
    public List<OwnerResponse> search(
            String firstName,
            String lastName,
            String emailContains,
            String phoneContains,
            Instant minCreated,
            Instant maxCreated,
    Instant minUpdated,
    Instant maxUpdated
 ) {
        String firstNorm = normalize(firstName);
        String lastNorm = normalize(lastName);
        String emailNorm = normalize(emailContains);
        String phoneNorm = normalize(phoneContains);
        return ownerRepository.searchAll(
                        firstNorm, lastNorm, emailNorm, phoneNorm,
                        minCreated, maxCreated, minUpdated, maxUpdated
                )
                .stream().map(OwnerMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public Owner getEntityById(Long id) {
        return ownerRepository.findById(id)
                .orElseThrow(() -> new OwnerNotFoundException(id));
    }

    private static String normalize(String value) {
        return (value == null || value.isBlank()) ? null : value.trim();
    }
}