package com.ms.billingservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


@NoArgsConstructor @AllArgsConstructor @Data @ToString
public class Product {
    private Long id;
    private String name;
    private double price;
    private double quantity;
}
