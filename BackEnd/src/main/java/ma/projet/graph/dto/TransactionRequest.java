package ma.projet.graph.dto;

import lombok.Data;
import ma.projet.graph.entities.TypeTransaction;

import java.time.LocalDate;

@Data
public class TransactionRequest {

    private Long compteId;
    private double montant;
    private LocalDate date;
    private TypeTransaction type;
}