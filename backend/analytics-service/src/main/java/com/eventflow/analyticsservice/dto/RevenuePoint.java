package com.eventflow.analyticsservice.dto;

public class RevenuePoint {
  private String name;
  private int revenue;

  public RevenuePoint(String name, int revenue) {
    this.name = name;
    this.revenue = revenue;
  }

  public String getName() {
    return name;
  }

  public int getRevenue() {
    return revenue;
  }
}

